import { Author } from '../services/research.service';

export class ResearchUtility {
    static cleanName(name: string): string {
        if (!name) return '';
        return name.trim()
            .replace(/^(Md\.?|Dr\.?|Prof\.?|Mr\.?|Mrs\.?|Mohammad\.?|Mohammed\.?)/i, '')
            .replace(/[*†‡§]/g, '')
            .replace(/[.,]/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    static getOrdinal(n: number): string {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return (s[(v - 20) % 10] || s[v] || s[0]);
    }

    static formatTime(ts: string) {
        const date = new Date(ts);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    static formatFullTime(ts: string) {
        const date = new Date(ts);
        return date.toLocaleString([], {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    static formatAuthors(authors: Author[]): string {
        if (!authors || authors.length === 0) return '---';
        return authors.map(a => a.name).join(', ');
    }

    static getStatusColor(status: string): string {
        switch (status) {
            case 'PUBLISHED': return '#10b981';
            case 'ACCEPTED': return '#22c55e';
            case 'WORKING': return '#94a3b8';
            case 'RUNNING': return '#3b82f6';
            case 'HYPOTHESIS': return '#8b5cf6';
            case 'REJECTED': return '#ef4444';
            default: return '#64748b';
        }
    }

    static mapStatus(val: string): string {
        const s = String(val || '').toUpperCase().trim();
        const valid = ['WORKING', 'RUNNING', 'HYPOTHESIS', 'ACCEPTED', 'PUBLISHED', 'REJECTED'];
        return valid.includes(s) ? s : 'WORKING';
    }

    static mapPaperType(val: string): string {
        const t = String(val || '').toUpperCase();
        const valid = ['ARTICLE', 'JOURNAL', 'CONFERENCE', 'REVIEW', 'BOOK_CHAPTER', 'PREPRINT', 'POSTER', 'THESIS', 'HYPOTHESIS'];
        return valid.includes(t) ? t : 'ARTICLE';
    }

    static parseAuthors(val: any, coAuthorStats: any[]): Author[] {
        if (!val) return [];
        const rawInput = String(val);
        let chunks = rawInput.split(/[,;]|\s+and\s+/i)
            .map(n => n.trim())
            .filter(n => n.length > 0);

        const knownAuthors = coAuthorStats.map(s => s.name);
        const finalAuthors: string[] = [];

        chunks.forEach(chunk => {
            const words = chunk.split(/\s+/);
            if (words.length >= 4 && knownAuthors.length > 0) {
                let remaining = chunk;
                let foundAny = false;
                const sortedKnown = [...knownAuthors].sort((a, b) => b.length - a.length);

                for (const known of sortedKnown) {
                    if (remaining.includes(known)) {
                        const regex = new RegExp(`\\b${known} \\b`, 'i');
                        if (regex.test(remaining)) {
                            finalAuthors.push(known);
                            remaining = remaining.replace(regex, '').trim();
                            foundAny = true;
                        }
                    }
                }
                if (remaining.length > 0) {
                    if (!foundAny) finalAuthors.push(chunk);
                    else if (remaining.split(/\s+/).length >= 2) finalAuthors.push(remaining);
                }
            } else {
                finalAuthors.push(chunk);
            }
        });

        return [...new Set(finalAuthors)].map(name => {
            const clean = name.replace(/[*†‡§]/g, '').trim();
            return {
                name: clean,
                role: 'Author',
                contributionPercentage: 0
            };
        }).filter(a => a.name.length > 0);
    }

    static unique<T>(items: T[], key: keyof T): T[] {
        const seen = new Set();
        return items.filter(item => {
            const val = item[key];
            if (seen.has(val)) return false;
            seen.add(val);
            return true;
        });
    }
}
