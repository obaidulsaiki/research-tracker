package com.example.backend.config;

import java.util.ArrayList;
import java.util.List;

public class JournalSeedData {

        public static class JournalRecord {
                public final String name;
                public final String publisher;
                public final String ifFactor;
                public final String quartile;
                public final String url;
                public final int year;

                public JournalRecord(String name, String publisher, String ifFactor, String quartile, String url,
                                int year) {
                        this.name = name;
                        this.publisher = publisher;
                        this.ifFactor = ifFactor;
                        this.quartile = quartile;
                        this.url = url;
                        this.year = year;
                }
        }

        public static List<JournalRecord> getSeedData() {
                List<JournalRecord> data = new ArrayList<>();
                // BATCH 1 - TOP TIER GENERAL CS & SYSTEMS
                data.add(new JournalRecord("IEEE Communications Surveys & Tutorials", "IEEE Xplore", "34.40", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=9739", 2024));
                data.add(
                                new JournalRecord("ACM Computing Surveys", "ACM DL", "23.80", "Q1",
                                                "https://dl.acm.org/journal/csur", 2024));
                data.add(new JournalRecord("Nature Machine Intelligence", "Nature", "18.80", "Q1",
                                "https://www.nature.com/natmachintell/", 2024));
                data.add(new JournalRecord("IEEE Transactions on Pattern Analysis and Machine Intelligence", "IEEE",
                                "18.90",
                                "Q1", "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=34", 2024));
                data.add(new JournalRecord("Information Fusion", "Elsevier", "14.70", "Q1",
                                "https://www.sciencedirect.com/journal/information-fusion", 2024));
                data.add(new JournalRecord("Science Robotics", "AAAS", "22.80", "Q1",
                                "https://www.science.org/journal/scirobotics", 2024));
                data.add(new JournalRecord("Computer Science Review", "Elsevier", "12.70", "Q1",
                                "https://www.sciencedirect.com/journal/computer-science-review", 2024));
                data.add(new JournalRecord("Communications of the ACM", "ACM", "11.10", "Q1", "https://cacm.acm.org/",
                                2024));
                data.add(new JournalRecord("Medical Image Analysis", "Elsevier", "10.70", "Q1",
                                "https://www.sciencedirect.com/journal/medical-image-analysis", 2024));
                data.add(new JournalRecord("IEEE Internet of Things Journal", "IEEE", "8.20", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6488907", 2024));
                data.add(new JournalRecord("Expert Systems with Applications", "Elsevier", "7.50", "Q1",
                                "https://www.sciencedirect.com/journal/expert-systems-with-applications", 2024));
                data.add(new JournalRecord("IEEE Transactions on Software Engineering", "IEEE CS", "7.40", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=32", 2024));
                data.add(new JournalRecord("Journal of Big Data", "Springer", "10.80", "Q1",
                                "https://journalofbigdata.springeropen.com/", 2024));
                data.add(new JournalRecord("Future Gen. Computer Systems", "Elsevier", "6.20", "Q1",
                                "https://www.sciencedirect.com/journal/future-generation-computer-systems", 2024));
                data.add(new JournalRecord("Applied Soft Computing", "Elsevier", "7.20", "Q1",
                                "https://www.sciencedirect.com/journal/applied-soft-computing", 2024));
                data.add(new JournalRecord("Knowledge-Based Systems", "Elsevier", "7.20", "Q1",
                                "https://www.sciencedirect.com/journal/knowledge-based-systems", 2024));
                data.add(new JournalRecord("IEEE Transactions on Multimedia", "IEEE", "6.30", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6046", 2024));
                data.add(
                                new JournalRecord("Bioinformatics", "Oxford", "4.40", "Q1",
                                                "https://academic.oup.com/bioinformatics", 2024));
                data.add(new JournalRecord("IEEE Access", "IEEE", "3.40", "Q2",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6287639", 2024));
                data.add(new JournalRecord("Scientific Reports", "Nature Portfolio", "3.80", "Q1",
                                "https://www.nature.com/srep/", 2024));
                data.add(new JournalRecord("Journal of Systems and Software", "Elsevier", "3.50", "Q1",
                                "https://www.sciencedirect.com/journal/journal-of-systems-and-software", 2024));
                data.add(new JournalRecord("Computing (Springer)", "Springer", "2.40", "Q2",
                                "https://link.springer.com/journal/607", 2024));
                data.add(new JournalRecord("SN Computer Science", "Springer Nature", "2.20", "Q2",
                                "https://www.springer.com/journal/42979", 2024));
                data.add(new JournalRecord("Discover Computing", "Springer Nature", "2.10", "Q2",
                                "https://www.springer.com/journal/44196", 2024));
                data.add(new JournalRecord("PeerJ Computer Science", "PeerJ", "2.40", "Q2",
                                "https://peerj.com/computer-science/", 2024));
                data.add(new JournalRecord("Journal of Neuroscience Methods", "Elsevier", "2.30", "Q3",
                                "https://www.sciencedirect.com/journal/journal-of-neuroscience-methods", 2024));
                data.add(new JournalRecord("Data In Brief", "Elsevier", "1.20", "Q3",
                                "https://www.sciencedirect.com/journal/data-in-brief", 2024));
                data.add(new JournalRecord("Biomedical Materials & Devices", "Springer Nature", "3.20", "Q2",
                                "https://link.springer.com/journal/44227", 2024));
                data.add(new JournalRecord("Heliyon", "Cell Press", "3.40", "Q1", "https://www.cell.com/heliyon/home",
                                2024));
                data.add(new JournalRecord("Information Systems Frontiers", "Springer Nature", "5.20", "Q1",
                                "https://link.springer.com/journal/13278", 2024));
                data.add(new JournalRecord("Journal of Computer Science", "Science Pubs", "1.00", "Q4",
                                "https://thescipub.com/jcs", 2024));
                data.add(new JournalRecord("Open Cell Signaling", "PeerJ", "1.00", "Q4",
                                "https://peerj.com/journals/cell-signaling/", 2024));

                // BATCH 2 - ADVANCED COMPUTING & SPECIALIZED AI
                data.add(new JournalRecord("Journal of the ACM (JACM)", "ACM Digital Library", "3.50", "Q1",
                                "https://dl.acm.org/journal/jacm", 2024));
                data.add(new JournalRecord("IEEE Transactions on Computers", "IEEE Xplore", "3.70", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=12", 2024));
                data.add(new JournalRecord("AI Open", "Elsevier", "10.50", "Q1",
                                "https://www.sciencedirect.com/journal/ai-open", 2024));
                data.add(new JournalRecord("IEEE Transactions on Cybernetics", "IEEE", "9.40", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6221036", 2024));
                data.add(new JournalRecord("Journal of Machine Learning Research", "JMLR.org", "6.20", "Q1",
                                "https://www.jmlr.org/", 2024));
                data.add(new JournalRecord("ACM Transactions on Software Engineering and Methodology", "ACM", "5.20",
                                "Q1",
                                "https://dl.acm.org/journal/tosem", 2024));
                data.add(new JournalRecord("IEEE Transactions on Industrial Informatics", "IEEE", "10.10", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=9424", 2024));
                data.add(new JournalRecord("Computer Communications", "Elsevier", "5.70", "Q1",
                                "https://www.sciencedirect.com/journal/computer-communications", 2024));
                data.add(new JournalRecord("Journal of Network and Computer Applications", "Elsevier", "8.70", "Q1",
                                "https://www.sciencedirect.com/journal/journal-of-network-and-computer-applications",
                                2024));
                data.add(new JournalRecord("Robotics and Computer-Integrated Manufacturing", "Elsevier", "10.40", "Q1",
                                "https://www.sciencedirect.com/journal/robotics-and-computer-integrated-manufacturing",
                                2024));
                data.add(new JournalRecord("IEEE Transactions on Mobile Computing", "IEEE", "7.70", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7755", 2024));
                data.add(new JournalRecord("Computers & Education", "Elsevier", "10.30", "Q1",
                                "https://www.sciencedirect.com/journal/computers-and-education", 2024));
                data.add(new JournalRecord("IEEE Transactions on Affective Computing", "IEEE", "9.60", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=5165369", 2024));
                data.add(new JournalRecord("ACM Transactions on Information Systems", "ACM", "5.40", "Q1",
                                "https://dl.acm.org/journal/tois", 2024));
                data.add(new JournalRecord("Swarm and Evolutionary Computation", "Elsevier", "8.20", "Q1",
                                "https://www.sciencedirect.com/journal/swarm-and-evolutionary-computation", 2024));
                data.add(new JournalRecord("Government Information Quarterly", "Elsevier", "10.00", "Q1",
                                "https://www.sciencedirect.com/journal/government-information-quarterly", 2024));
                data.add(new JournalRecord("IEEE Transactions on Services Computing", "IEEE", "5.50", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=4629386", 2024));
                data.add(new JournalRecord("Big Data and Cognitive Computing", "MDPI", "4.20", "Q2",
                                "https://www.mdpi.com/journal/bdcc", 2024));
                data.add(new JournalRecord("Software: Practice and Experience", "Wiley", "2.10", "Q2",
                                "https://onlinelibrary.wiley.com/journal/1097024x", 2024));
                data.add(new JournalRecord("Empirical Software Engineering", "Springer", "3.20", "Q1",
                                "https://link.springer.com/journal/10664", 2024));
                data.add(new JournalRecord("Theoretical Computer Science", "Elsevier", "1.00", "Q3",
                                "https://www.sciencedirect.com/journal/theoretical-computer-science", 2024));
                data.add(new JournalRecord("SIAM Journal on Computing", "SIAM", "2.10", "Q2",
                                "https://www.siam.org/journals/sicomp", 2024));
                data.add(new JournalRecord("Computer Graphics Forum", "Wiley", "2.50", "Q2",
                                "https://onlinelibrary.wiley.com/journal/14678659", 2024));
                data.add(new JournalRecord("Multimedia Tools and Applications", "Springer", "3.00", "Q2",
                                "https://link.springer.com/journal/11042", 2024));
                data.add(new JournalRecord("Journal of Cloud Computing", "Springer", "4.61", "Q2",
                                "https://journalofcloudcomputing.springeropen.com/", 2024));
                data.add(new JournalRecord("Computing in Science and Engineering", "IEEE", "1.80", "Q3",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=5992", 2024));
                data.add(new JournalRecord("Journal of Parallel and Distributed Computing", "Elsevier", "3.40", "Q2",
                                "https://www.sciencedirect.com/journal/journal-of-parallel-and-distributed-computing",
                                2024));
                data.add(new JournalRecord("International Journal of Control", "Taylor and Francis", "1.60", "Q3",
                                "https://www.tandfonline.com/journals/tcon20", 2024));
                data.add(new JournalRecord("Theory of Computing Systems", "Springer", "1.10", "Q4",
                                "https://link.springer.com/journal/224", 2024));

                // BATCH 3 - LINGUISTICS & SPEECH
                data.add(new JournalRecord("Transactions of the Association for Computational Linguistics", "MIT Press",
                                "6.90",
                                "Q1", "https://transacl.org/", 2024));
                data.add(new JournalRecord("Computational Linguistics", "MIT Press", "5.30", "Q1",
                                "https://direct.mit.edu/coli", 2024));
                data.add(new JournalRecord("IEEE/ACM Transactions on Audio, Speech, and Language Processing",
                                "IEEE Xplore",
                                "5.10", "Q1", "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6570655",
                                2024));
                data.add(new JournalRecord("Computer Speech & Language", "Elsevier", "4.30", "Q1",
                                "https://www.sciencedirect.com/journal/computer-speech-and-language", 2024));
                data.add(new JournalRecord("ACM Transactions on Asian and Low-Resource Language Information Processing",
                                "ACM Digital Library", "2.10", "Q2", "https://dl.acm.org/journal/tallip", 2024));
                data.add(new JournalRecord("Speech Communication", "Elsevier", "3.20", "Q2",
                                "https://www.sciencedirect.com/journal/speech-communication", 2024));
                data.add(new JournalRecord("Language Resources and Evaluation", "Springer", "2.10", "Q2",
                                "https://link.springer.com/journal/10579", 2024));
                data.add(new JournalRecord("Machine Translation", "Springer", "2.40", "Q2",
                                "https://link.springer.com/journal/10590", 2024));
                data.add(new JournalRecord("Journal of Quantitative Linguistics", "Taylor and Francis Online", "1.30",
                                "Q2",
                                "https://www.tandfonline.com/journals/njql20", 2024));

                // BATCH 4 - NLP & APPLIED ARTIFICIAL INTELLIGENCE
                data.add(new JournalRecord("Natural Language Processing Journal", "Elsevier", "7.10", "Q1",
                                "https://www.sciencedirect.com/journal/natural-language-processing-journal", 2024));
                data.add(new JournalRecord("Information Sciences", "Elsevier", "8.10", "Q1",
                                "https://www.sciencedirect.com/journal/information-sciences", 2024));
                data.add(new JournalRecord("ACM Transactions on Intelligent Systems and Technology",
                                "ACM Digital Library",
                                "5.40", "Q1", "https://dl.acm.org/journal/tissp", 2024));
                data.add(new JournalRecord("IEEE Intelligent Systems", "IEEE Xplore", "5.60", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=9670", 2024));
                data.add(new JournalRecord("Journal of Artificial Intelligence Res.", "AI Access", "4.50", "Q1",
                                "https://jair.org/", 2024));
                data.add(new JournalRecord("Language, Speech, and Hearing Services", "ASHA", "2.90", "Q1",
                                "https://pubs.asha.org/journal/lshss", 2024));
                data.add(new JournalRecord("International Journal of Speech-Language Pathology", "Taylor and Francis",
                                "1.90",
                                "Q1", "https://www.tandfonline.com/journals/yjsl20", 2024));
                data.add(new JournalRecord("Language and Speech", "SAGE", "1.10", "Q2",
                                "https://journals.sagepub.com/home/las", 2024));
                data.add(new JournalRecord("Journal of Memory and Language", "Elsevier", "3.00", "Q1",
                                "https://www.sciencedirect.com/journal/journal-of-memory-and-language", 2024));
                data.add(new JournalRecord("Computer Assisted Language Learning", "Taylor & Francis", "6.60", "Q1",
                                "https://www.tandfonline.com/journals/ncal20", 2024));
                data.add(new JournalRecord("ReCALL", "Cambridge University Press", "5.70", "Q1",
                                "https://www.cambridge.org/core/journals/recall", 2024));
                data.add(new JournalRecord("System", "Elsevier", "5.60", "Q1",
                                "https://www.sciencedirect.com/journal/system", 2024));
                data.add(new JournalRecord("Language Teaching", "Cambridge University Press", "5.10", "Q1",
                                "https://www.cambridge.org/core/journals/language-teaching", 2024));
                data.add(new JournalRecord("Applied Linguistics", "Oxford Academic", "4.20", "Q1",
                                "https://academic.oup.com/applij", 2024));
                data.add(new JournalRecord("Journal of Second Language Writing", "Elsevier", "4.50", "Q1",
                                "https://www.sciencedirect.com/journal/journal-of-second-language-writing", 2024));
                data.add(new JournalRecord("International Journal of Lexicography", "Oxford Academic", "1.30", "Q2",
                                "https://academic.oup.com/ijl", 2024));
                data.add(new JournalRecord("Linguistic Inquiry", "MIT Press", "1.60", "Q2",
                                "https://direct.mit.edu/ling", 2024));
                data.add(new JournalRecord("Journal of Pragmatics", "Elsevier", "1.70", "Q2",
                                "https://www.sciencedirect.com/journal/journal-of-pragmatics", 2024));
                data.add(new JournalRecord("Corpus Linguistics and Linguistic Theory", "De Gruyter", "1.70", "Q2",
                                "https://www.degruyter.com/journal/key/cllt/html", 2024));

                // BATCH 5 - AI IN MEDICINE & HEALTH
                data.add(new JournalRecord("The Lancet Digital Health", "Elsevier", "24.10", "Q1",
                                "https://www.thelancet.com/journals/landig/home", 2024));
                data.add(new JournalRecord("npj Digital Medicine", "Nature", "15.30", "Q1",
                                "https://www.nature.com/npjdigitalmed/", 2024));
                data.add(new JournalRecord("Artificial Intelligence in Medicine", "Elsevier", "10.40", "Q1",
                                "https://www.sciencedirect.com/journal/artificial-intelligence-in-medicine", 2024));
                data.add(new JournalRecord("IEEE Transactions on Medical Imaging", "IEEE Xplore", "11.30", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=42", 2024));
                data.add(new JournalRecord("JAMA Network Open (AI Focus)", "AMA", "13.80", "Q1",
                                "https://jamanetwork.com/journals/jamanetworkopen", 2024));
                data.add(new JournalRecord("Journal of Medical Internet Research", "JMIR Publications", "7.10", "Q1",
                                "https://www.jmir.org/", 2024));
                data.add(new JournalRecord("Journal of the American Medical Informatics Association", "Oxford", "7.10",
                                "Q1",
                                "https://academic.oup.com/jamia", 2024));
                data.add(new JournalRecord("IEEE Journal of Biomedical & Health", "IEEE", "7.70", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6221020", 2024));
                data.add(new JournalRecord("Frontiers in Artificial Intelligence", "Frontiers", "4.70", "Q1",
                                "https://www.frontiersin.org/journals/artificial-intelligence", 2024));
                data.add(new JournalRecord("JMIR AI (New Flagship)", "JMIR Pubs", "2.00", "Q2",
                                "https://ai.jmir.org/", 2024));
                data.add(new JournalRecord("Patterns (Cell Press)", "Cell Press", "6.50", "Q1",
                                "https://www.cell.com/patterns/home", 2024));
                data.add(new JournalRecord("Intelligence-Based Medicine", "Elsevier", "4.20", "Q2",
                                "https://www.sciencedirect.com/journal/intelligence-based-medicine", 2024));
                data.add(new JournalRecord("International Journal of Medical Informatics", "Elsevier", "3.70", "Q2",
                                "https://www.sciencedirect.com/journal/international-journal-of-medical-informatics",
                                2024));
                data.add(new JournalRecord("Frontiers in Digital Health", "Frontiers", "3.80", "Q1",
                                "https://www.frontiersin.org/journals/digital-health", 2024));
                data.add(new JournalRecord("Smart Health", "Elsevier", "4.10", "Q2",
                                "https://www.sciencedirect.com/journal/smart-health", 2024));
                data.add(new JournalRecord("Computers in Biology and Medicine", "Elsevier", "7.70", "Q1",
                                "https://www.sciencedirect.com/journal/computers-in-biology-and-medicine", 2024));
                data.add(new JournalRecord("Computer Methods and Programs in Biomedicine", "Elsevier", "5.10", "Q1",
                                "https://www.sciencedirect.com/journal/computer-methods-and-programs-in-biomedicine",
                                2024));
                data.add(new JournalRecord("Lancet Neurology (AI/Tech)", "Elsevier", "45.50", "Q1",
                                "https://www.thelancet.com/journals/laneur/home", 2024));
                data.add(new JournalRecord("Radiology: Artificial Intelligence", "RSNA", "10.20", "Q1",
                                "https://pubs.rsna.org/journal/radiologyai", 2024));
                data.add(new JournalRecord("JACC: Advances (AI in Cardiology)", "Elsevier", "6.80", "Q1",
                                "https://www.jacc.org/journal/advances", 2024));
                data.add(new JournalRecord("Digital Health", "SAGE", "3.90", "Q2",
                                "https://journals.sagepub.com/home/dhj", 2024));
                data.add(new JournalRecord("Pathology Informatics", "Elsevier", "3.10", "Q2",
                                "https://www.jpathinformatics.org/", 2024));
                data.add(new JournalRecord("Deep Learning in Medical Physics", "Wiley", "4.50", "Q2",
                                "https://onlinelibrary.wiley.com/journal/26927071", 2024));
                data.add(new JournalRecord("AI in Precision Oncology", "Liebert", "5.30", "Q1",
                                "https://www.liebertpub.com/loi/aipo", 2024));
                data.add(new JournalRecord("Cardiovascular Digital Health Journal", "Elsevier", "2.80", "Q2",
                                "https://www.cvdhj.org/", 2024));
                data.add(new JournalRecord("BMC Medical Informatics and Decision Making", "BioMed Central", "3.50",
                                "Q2",
                                "https://bmcmedinformdecismak.biomedcentral.com/", 2024));
                data.add(new JournalRecord("Diagnostic and Interventional Imaging", "Elsevier", "3.90", "Q2",
                                "https://www.sciencedirect.com/journal/diagnostic-and-interventional-imaging", 2024));
                data.add(new JournalRecord("Computational & Structural Biotech", "Elsevier", "6.10", "Q1",
                                "https://www.sciencedirect.com/journal/computational-and-structural-biotechnology-journal",
                                2024));
                data.add(new JournalRecord("IEEE Transactions on NanoBioscience", "IEEE", "3.90", "Q2",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7728", 2024));
                data.add(new JournalRecord("PLOS Digital Health", "PLOS", "3.20", "Q2",
                                "https://journals.plos.org/digitalhealth/", 2024));
                data.add(new JournalRecord("Health Informatics Journal", "SAGE", "2.80", "Q2",
                                "https://journals.sagepub.com/home/jhi", 2024));
                data.add(new JournalRecord("Computers, Materials and Continua", "Tech Science Press", "3.10", "Q2",
                                "https://www.techscience.com/journal/cmc", 2024));
                data.add(new JournalRecord("Journal of Biomedical Informatics", "Elsevier", "4.50", "Q1",
                                "https://www.sciencedirect.com/journal/journal-of-biomedical-informatics", 2024));
                data.add(new JournalRecord("Applied Sciences (Section: Med AI)", "MDPI", "2.70", "Q2",
                                "https://www.mdpi.com/journal/applsci", 2024));
                data.add(new JournalRecord("Diagnostics (Medical AI section)", "MDPI", "3.60", "Q2",
                                "https://www.mdpi.com/journal/diagnostics", 2024));
                data.add(new JournalRecord("Healthcare (MDPI)", "MDPI", "2.80", "Q2",
                                "https://www.mdpi.com/journal/healthcare", 2024));
                data.add(
                                new JournalRecord("Journal of Imaging", "MDPI", "2.10", "Q3",
                                                "https://www.mdpi.com/journal/jimaging", 2024));

                // BATCH 6 - CYBERSECURITY, ROBOTICS, HCI & ENGINEERING
                data.add(new JournalRecord("IEEE Transactions on Information Forensics and Security", "IEEE", "6.80",
                                "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=10206", 2024));
                data.add(new JournalRecord("Journal of Cybersecurity", "Oxford", "3.50", "Q1",
                                "https://academic.oup.com/cybersecurity", 2024));
                data.add(new JournalRecord("IEEE Security & Privacy", "IEEE", "3.20", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8013", 2024));
                data.add(new JournalRecord("ACM Transactions on Privacy and Security", "ACM", "3.00", "Q1",
                                "https://dl.acm.org/journal/tops", 2024));
                data.add(new JournalRecord("Computers & Security", "Elsevier", "4.80", "Q1",
                                "https://www.sciencedirect.com/journal/computers-and-security", 2024));
                data.add(new JournalRecord("IEEE Transactions on Dependable and Secure Computing", "IEEE", "7.30", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8858", 2024));
                data.add(new JournalRecord("IET Information Security", "Wiley/IET", "1.80", "Q2",
                                "https://ietresearch.onlinelibrary.wiley.com/journal/17518717", 2024));
                data.add(new JournalRecord("Journal of Cryptology", "Springer", "1.60", "Q2",
                                "https://link.springer.com/journal/145", 2024));
                data.add(new JournalRecord("International Journal of Information Security", "Springer", "2.50", "Q1",
                                "https://link.springer.com/journal/10207", 2024));
                data.add(new JournalRecord("Ad Hoc Networks", "Elsevier", "4.80", "Q1",
                                "https://www.sciencedirect.com/journal/ad-hoc-networks", 2024));
                data.add(new JournalRecord("Soft Robotics", "Liebert", "6.40", "Q1",
                                "https://www.liebertpub.com/loi/soro", 2024));
                data.add(new JournalRecord("IEEE Transactions on Robotics", "IEEE", "10.50", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8860", 2024));
                data.add(new JournalRecord("The International Journal of Robotics Research", "SAGE", "7.50", "Q1",
                                "https://journals.sagepub.com/home/ijr", 2024));
                data.add(new JournalRecord("IEEE Robotics and Automation Letters", "IEEE", "5.20", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7083534", 2024));
                data.add(new JournalRecord("Journal of Field Robotics", "Wiley", "5.60", "Q1",
                                "https://onlinelibrary.wiley.com/journal/15564967", 2024));
                data.add(new JournalRecord("Autonomous Robots", "Springer", "3.90", "Q2",
                                "https://link.springer.com/journal/10514", 2024));
                data.add(new JournalRecord("Bioinspiration & Biomimetics", "IOP", "3.10", "Q2",
                                "https://iopscience.iop.org/journal/1748-3190", 2024));
                data.add(new JournalRecord("IEEE Transactions on Haptics", "IEEE", "2.50", "Q2",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=4543165", 2024));
                data.add(new JournalRecord("Intelligent Service Robotics", "Springer", "2.40", "Q2",
                                "https://link.springer.com/journal/11370", 2024));
                data.add(new JournalRecord("Int. Journal of Human-Computer Studies", "Elsevier", "5.30", "Q1",
                                "https://www.sciencedirect.com/journal/international-journal-of-human-computer-studies",
                                2024));
                data.add(new JournalRecord("ACM Transactions on Computer-Human Interaction", "ACM", "4.80", "Q1",
                                "https://dl.acm.org/journal/tochi", 2024));
                data.add(new JournalRecord("Human-Computer Interaction (Journal)", "T&F", "6.50", "Q1",
                                "https://www.tandfonline.com/journals/hhci20", 2024));
                data.add(new JournalRecord("Interacting with Computers", "Oxford", "1.40", "Q3",
                                "https://academic.oup.com/iwc", 2024));
                data.add(new JournalRecord("Behaviour & Information Technology", "T&F", "3.70", "Q2",
                                "https://www.tandfonline.com/journals/tbit20", 2024));
                data.add(new JournalRecord("Journal of Multimodal User Interfaces", "Springer", "2.20", "Q2",
                                "https://link.springer.com/journal/12193", 2024));
                data.add(new JournalRecord("Virtual Reality (Springer)", "Springer", "4.20", "Q1",
                                "https://link.springer.com/journal/10055", 2024));
                data.add(new JournalRecord("Universal Access in the Information Society", "Springer", "2.40", "Q2",
                                "https://link.springer.com/journal/10209", 2024));
                data.add(new JournalRecord("User Modeling and User-Adapted Interaction", "Springer", "4.50", "Q1",
                                "https://link.springer.com/journal/11257", 2024));
                data.add(new JournalRecord("Engineering (Elsevier)", "Elsevier", "11.60", "Q1",
                                "https://www.sciencedirect.com/journal/engineering", 2024));
                data.add(new JournalRecord("Advanced Engineering Informatics", "Elsevier", "9.90", "Q1",
                                "https://www.sciencedirect.com/journal/advanced-engineering-informatics", 2024));
                data.add(new JournalRecord("Automation in Construction", "Elsevier", "11.50", "Q1",
                                "https://www.sciencedirect.com/journal/automation-in-construction", 2024));
                data.add(new JournalRecord("Journal of Strategic Information Systems", "Elsevier", "11.80", "Q1",
                                "https://www.sciencedirect.com/journal/journal-of-strategic-information-systems",
                                2024));
                data.add(new JournalRecord("Sustainable Cities and Society", "Elsevier", "11.70", "Q1",
                                "https://www.sciencedirect.com/journal/sustainable-cities-and-society", 2024));
                data.add(new JournalRecord("Computer-Aided Civil and Infrastructure Engineering", "Wiley", "9.10", "Q1",
                                "https://onlinelibrary.wiley.com/journal/14678667", 2024));
                data.add(new JournalRecord("IEEE Systems Journal", "IEEE", "4.00", "Q2",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=4267003", 2024));
                data.add(new JournalRecord("Reliability Engineering and System Safety", "Elsevier", "8.10", "Q1",
                                "https://www.sciencedirect.com/journal/reliability-engineering-and-system-safety",
                                2024));
                data.add(new JournalRecord("Technovation", "Elsevier", "10.90", "Q1",
                                "https://www.sciencedirect.com/journal/technovation", 2024));
                data.add(new JournalRecord("Journal of Engineering Education", "Wiley", "3.50", "Q1",
                                "https://onlinelibrary.wiley.com/journal/21689830", 2024));
                // BATCH 8 - AI, MACHINE LEARNING & PATTERN RECOGNITION (EXTENDED)
                data.add(new JournalRecord("Neural Networks", "Elsevier", "7.80", "Q1",
                                "https://www.sciencedirect.com/journal/neural-networks", 2024));
                data.add(new JournalRecord("Pattern Recognition", "Elsevier", "8.00", "Q1",
                                "https://www.sciencedirect.com/journal/pattern-recognition", 2024));
                data.add(new JournalRecord("Machine Learning", "Springer", "5.90", "Q1",
                                "https://link.springer.com/journal/10994", 2024));
                data.add(new JournalRecord("IEEE Transactions on Neural Networks and Learning Systems", "IEEE", "10.40",
                                "Q1", "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=5962385", 2024));
                data.add(new JournalRecord("International Journal of Computer Vision", "Springer", "11.60", "Q1",
                                "https://link.springer.com/journal/11263", 2024));
                data.add(new JournalRecord("Neurocomputing", "Elsevier", "6.00", "Q1",
                                "https://www.sciencedirect.com/journal/neurocomputing", 2024));
                data.add(new JournalRecord("Artificial Intelligence", "Elsevier", "14.40", "Q1",
                                "https://www.sciencedirect.com/journal/artificial-intelligence", 2024));
                data.add(new JournalRecord("Engineering Applications of Artificial Intelligence", "Elsevier", "8.00",
                                "Q1",
                                "https://www.sciencedirect.com/journal/engineering-applications-of-artificial-intelligence",
                                2024));
                data.add(new JournalRecord("Neural Computing and Applications", "Springer", "6.00", "Q1",
                                "https://link.springer.com/journal/521", 2024));
                data.add(new JournalRecord("Cognitive Computation", "Springer", "5.40", "Q1",
                                "https://link.springer.com/journal/12559", 2024));

                // BATCH 9 - SIGNAL PROCESSING & COMMUNICATIONS
                data.add(new JournalRecord("IEEE Transactions on Signal Processing", "IEEE", "5.40", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=78", 2024));
                data.add(new JournalRecord("Signal Processing", "Elsevier", "4.40", "Q1",
                                "https://www.sciencedirect.com/journal/signal-processing", 2024));
                data.add(new JournalRecord("IEEE Wireless Communications", "IEEE", "10.90", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7742", 2024));
                data.add(new JournalRecord("IEEE Journal on Selected Areas in Communications", "IEEE", "16.40", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=49", 2024));
                data.add(new JournalRecord("Digital Signal Processing", "Elsevier", "2.90", "Q2",
                                "https://www.sciencedirect.com/journal/digital-signal-processing", 2024));
                data.add(new JournalRecord("Signal Processing: Image Communication", "Elsevier", "3.50", "Q2",
                                "https://www.sciencedirect.com/journal/signal-processing-image-communication", 2024));
                data.add(new JournalRecord("IEEE Communications Magazine", "IEEE", "11.20", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=35", 2024));
                data.add(new JournalRecord("Sensors", "MDPI", "3.90", "Q2", "https://www.mdpi.com/journal/sensors",
                                2024));
                data.add(new JournalRecord("Remote Sensing", "MDPI", "5.00", "Q1",
                                "https://www.mdpi.com/journal/remotesensing", 2024));
                data.add(new JournalRecord("IET Signal Processing", "Wiley", "1.70", "Q2",
                                "https://ietresearch.onlinelibrary.wiley.com/journal/17519683", 2024));

                // BATCH 10 - DATA SCIENCE, BIG DATA & CLOUD
                data.add(new JournalRecord("IEEE Transactions on Knowledge and Data Engineering", "IEEE", "8.90", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=69", 2024));
                data.add(new JournalRecord("Data Mining and Knowledge Discovery", "Springer", "5.40", "Q1",
                                "https://link.springer.com/journal/10618", 2024));
                data.add(new JournalRecord("Big Data Research", "Elsevier", "3.70", "Q2",
                                "https://www.sciencedirect.com/journal/big-data-research", 2024));
                data.add(new JournalRecord("IEEE Transactions on Cloud Computing", "IEEE", "8.10", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6245519", 2024));
                data.add(new JournalRecord("Journal of Big Data", "Springer", "10.80", "Q1",
                                "https://journalofbigdata.springeropen.com/", 2024));
                data.add(new JournalRecord("EPJ Data Science", "Springer", "3.60", "Q1",
                                "https://epjdatascience.springeropen.com/", 2024));
                data.add(new JournalRecord("Data Science and Engineering", "Springer", "4.20", "Q2",
                                "https://link.springer.com/journal/41019", 2024));
                data.add(new JournalRecord("IEEE Transactions on Parallel and Distributed Systems", "IEEE", "5.30",
                                "Q1", "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=71", 2024));
                data.add(new JournalRecord("Future Generation Computer Systems", "Elsevier", "7.70", "Q1",
                                "https://www.sciencedirect.com/journal/future-generation-computer-systems", 2024));
                data.add(new JournalRecord("Cluster Computing", "Springer", "4.40", "Q2",
                                "https://link.springer.com/journal/10586", 2024));

                // BATCH 11 - BIO-INFORMATICS & INTERDISCIPLINARY
                data.add(new JournalRecord("Briefings in Bioinformatics", "Oxford", "9.50", "Q1",
                                "https://academic.oup.com/bib", 2024));
                data.add(new JournalRecord("PLOS Computational Biology", "PLOS", "4.30", "Q1",
                                "https://journals.plos.org/ploscompbiol/", 2024));
                data.add(new JournalRecord("BMC Bioinformatics", "Springer", "3.00", "Q2",
                                "https://bmcbioinformatics.biomedcentral.com/", 2024));
                data.add(new JournalRecord("IEEE Transactions on Evolutionary Computation", "IEEE", "14.30", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=4233", 2024));
                data.add(new JournalRecord("Journal of Cheminformatics", "Springer", "8.20", "Q1",
                                "https://jcheminf.biomedcentral.com/", 2024));
                data.add(new JournalRecord("Molecular Systems Biology", "EMBO Press", "9.90", "Q1",
                                "https://www.embopress.org/journal/17444292", 2024));
                data.add(new JournalRecord("IEEE Journal of Biomedical and Health Informatics", "IEEE", "7.70", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6221020", 2024));
                data.add(new JournalRecord("Complexity", "Wiley", "2.10", "Q2",
                                "https://www.hindawi.com/journals/complexity/", 2024));
                data.add(new JournalRecord("Scientific Data", "Nature", "9.80", "Q1", "https://www.nature.com/sdata/",
                                2024));
                data.add(new JournalRecord("IEEE/ACM Transactions on Computational Biology and Bioinformatics",
                                "IEEE/ACM", "4.50", "Q2",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8857", 2024));

                return data;
        }
}
