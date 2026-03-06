package com.example.backend.config;

import java.util.ArrayList;
import java.util.List;

public class ConferenceSeedData {
        public static class ConferenceRecord {
                public final String name;
                public final String venue;
                public final String indexedBy;
                public final String url;
                public final int year;

                public ConferenceRecord(String name, String venue, String indexedBy, String url, int year) {
                        this.name = name;
                        this.venue = venue;
                        this.indexedBy = indexedBy;
                        this.url = url;
                        this.year = year;
                }
        }

        public static List<ConferenceRecord> getSeedData() {
                List<ConferenceRecord> data = new ArrayList<>();

                // BATCH 7 - REGIONAL/CONFERENCE FALLBACKS
                // FIX: Replaced generic IEEE Xplore fallback URLs with conference-specific URLs
                data.add(new ConferenceRecord("ICCIT", "Cox's Bazar, Bangladesh", "IEEE Xplore",
                                "https://iccit.org.bd/", 2026));
                data.add(new ConferenceRecord("ICECTE", "RUET, Rajshahi, Bangladesh", "IEEE Xplore",
                                "https://icecte.ruet.ac.bd/", 2026));
                data.add(new ConferenceRecord("ICFRONT", "MBSTU, Tangail, Bangladesh", "IEEE Xplore",
                                "https://icfront.mbstu.ac.bd/", 2026));
                data.add(new ConferenceRecord("PECCII", "PUST, Pabna, Bangladesh", "IEEE",
                                "https://peccii.pust.ac.bd/", 2026));
                data.add(new ConferenceRecord("QPAIN", "CUET, Chittagong, Bangladesh", "IEEE", "https://qpain.org/",
                                2026));
                // AI-RELATED CONFERENCES IN BANGLADESH
                data.add(new ConferenceRecord("MIET", "NSTU, Noakhali, Bangladesh", "Springer/Scopus",
                                "https://confmiet.org/", 2026));
                data.add(new ConferenceRecord("BIM", "Dhaka International University, Dhaka, Bangladesh",
                                "Springer/Scopus",
                                "https://confbim.com/", 2025));
                data.add(new ConferenceRecord("RAAICON", "BUET, Dhaka, Bangladesh", "IEEE Xplore",
                                "https://raaicon.org/", 2024));
                data.add(new ConferenceRecord("ICECE", "BUET, Dhaka, Bangladesh", "IEEE Xplore",
                                "https://icece.buet.ac.bd/", 2024));
                data.add(new ConferenceRecord("ICICT", "BUET, Dhaka, Bangladesh", "IEEE/Scopus",
                                "https://icict.buet.ac.bd/", 2024));
                data.add(new ConferenceRecord("EICT", "KUET, Khulna, Bangladesh", "IEEE Xplore",
                                "https://eict2025.kuet.ac.bd/", 2025));
                data.add(new ConferenceRecord("ICISET", "IIUC, Kumira, Chattogram, Bangladesh", "IEEE Xplore",
                                "https://www.iiuc.ac.bd/iciset", 2024));
                data.add(new ConferenceRecord("ICREST", "AIUB, Dhaka, Bangladesh", "IEEE Xplore",
                                "https://aiubicrest.com/", 2025));
                data.add(new ConferenceRecord("ICBSLP", "Sylhet, Bangladesh", "IEEE Xplore",
                                "https://ieeexplore.ieee.org/xpl/conhome/8910659/all-proceedings", 2019));
                data.add(new ConferenceRecord("ICASERT", "East West University, Dhaka, Bangladesh", "IEEE Xplore",
                                "https://icasert.com/", 2019));
                // AI-RELATED UPCOMING CONFERENCES IN BANGLADESH (NEW BATCH)
                // FIX: RAAICON 2025 is at MIST, Dhaka (4th edition) — dataset only had 2024 at
                // BUET
                data.add(new ConferenceRecord("RAAICON", "MIST, Dhaka, Bangladesh", "IEEE Xplore",
                                "https://raaicon.org/", 2025));
                data.add(new ConferenceRecord("COMPAS", "Islamic University, Kushtia, Bangladesh", "IEEE Xplore",
                                "https://www.compasconf.org/", 2025));
                data.add(new ConferenceRecord("WIECON-ECE", "Cox's Bazar, Bangladesh", "IEEE Xplore",
                                "https://wiecon-ece.org/", 2025));
                data.add(new ConferenceRecord("BECITHCON", "Southeast University, Dhaka, Bangladesh", "IEEE Xplore",
                                "https://becithcon.seu.edu.bd/", 2025));
                data.add(new ConferenceRecord("ICERIE", "SUST, Sylhet, Bangladesh", "Scopus",
                                "https://icerie2025.sust.edu/", 2025));
                // BATCH 8 - ASIA-PACIFIC REGIONAL FLAGSHIPS (IEEE/ACM)
                // FIX: Replaced generic region labels with actual host cities
                data.add(new ConferenceRecord("APSEC", "Chongqing, China", "IEEE", "https://apsec2024.org/", 2024));
                data.add(new ConferenceRecord("TENCON", "Kochi, India", "IEEE", "https://tencon2024.org/", 2024));
                data.add(new ConferenceRecord("ASP-DAC", "Tokyo, Japan", "ACM Digital Library/IEEE",
                                "https://aspdac.com/", 2025));
                data.add(new ConferenceRecord("COMPSAC", "Osaka, Japan", "IEEE", "https://ieee-compsac.org/", 2024));
                data.add(new ConferenceRecord("PAKDD", "Hanoi, Vietnam", "Springer", "https://pakdd.org/", 2025));
                data.add(new ConferenceRecord("PRICAI", "Kyoto, Japan", "Springer", "https://pricai.org/", 2024));
                data.add(new ConferenceRecord("HPC Asia", "Tokyo, Japan", "ACM Digital Library", "https://hpcasia.org/",
                                2025));
                // FIX: ASPLOS 2024 was held in San Diego, CA, USA — not an "Asia Venue"
                data.add(new ConferenceRecord("ASPLOS", "San Diego, CA, USA", "ACM Digital Library",
                                "https://asplos-conference.org/", 2024));
                // FIX: ACCV 2024 was held in Hanoi, Vietnam
                data.add(new ConferenceRecord("ACCV", "Hanoi, Vietnam", "Springer", "https://accv2024.org/", 2024));
                data.add(new ConferenceRecord("ICONIP", "Auckland, New Zealand", "Springer", "https://iconip2024.org/",
                                2024));

                // BATCH 9 - SOUTH ASIA & BANGLADESH SPECIALIZED (2021-2026)
                data.add(new ConferenceRecord("NSysS", "Dhaka, Bangladesh", "IEEE Xplore", "https://nsyss.org/", 2025));
                data.add(new ConferenceRecord("TENSYMP", "Colombo, Sri Lanka", "IEEE", "https://tensymp2024.org/",
                                2024));
                data.add(new ConferenceRecord("ICSET", "New Delhi, India", "IEEE", "https://icset.org/", 2024));
                // FIX: ICMLA is an IEEE conference typically held in the USA, not Asia
                data.add(new ConferenceRecord("ICMLA", "Miami, FL, USA", "IEEE", "https://icmla-conference.org/",
                                2025));
                data.add(new ConferenceRecord("SPICES", "Thiruvananthapuram, India", "IEEE", "https://spices.org.in/",
                                2024));
                // FIX: ICCV 2023 was held in Paris, France — NOT an "Asia Rotation"
                data.add(new ConferenceRecord("ICCV", "Paris, France", "IEEE", "https://iccv2023.thecvf.com/", 2023));
                // FIX: COLING 2025 was held in Abu Dhabi, UAE
                data.add(new ConferenceRecord("COLING", "Abu Dhabi, UAE", "ACM Digital Library/ACL",
                                "https://coling2025.org/", 2025));
                data.add(new ConferenceRecord("COMSNETS", "Bengaluru, India", "IEEE/ACM Digital Library",
                                "https://comsnets.org/", 2025));
                data.add(new ConferenceRecord("HiPC", "Bengaluru, India", "IEEE/ACM Digital Library",
                                "https://hipc.org/", 2024));
                data.add(new ConferenceRecord("ISEC", "Hyderabad, India", "ACM Digital Library", "https://isec.org.in/",
                                2026));

                // BATCH 10 - SOUTHEAST ASIA & EAST ASIA FLAGSHIPS
                data.add(new ConferenceRecord("SCA", "Singapore", "ACM Digital Library", "https://sc-asia.org/",
                                2026));
                data.add(new ConferenceRecord("Ubi-Media", "Kuala Lumpur, Malaysia", "IEEE", "https://ubi-media.org/",
                                2026));
                data.add(new ConferenceRecord("ICCAI", "Tokyo, Japan", "ACM Digital Library", "https://iccai.net/",
                                2026));
                data.add(new ConferenceRecord("MSIE", "Bangkok, Thailand", "ACM Digital Library", "https://msie.org/",
                                2026));
                data.add(new ConferenceRecord("ICCA", "Dubai, UAE", "IEEE", "https://ieee-icca.org/", 2025));
                // FIX: AISTATS 2024 was held in Valencia, Spain — not "Asia"
                data.add(new ConferenceRecord("AISTATS", "Valencia, Spain", "PMLR", "https://aistats.org/", 2024));
                // FIX: IJCAI 2024 was held in Jeju, South Korea
                data.add(new ConferenceRecord("IJCAI", "Jeju, South Korea", "IJCAI", "https://ijcai.org/", 2024));
                // FIX: ISCA 2025 duplicate removed — kept in BATCH 19 with correct
                // year-specific URL
                // FIX: ICDE 2024 was held in Utrecht, Netherlands — not "Asia"
                data.add(new ConferenceRecord("ICDE", "Utrecht, Netherlands", "IEEE", "https://icde2024.org/", 2024));
                // FIX: SIGIR 2023 was held in Taipei, Taiwan — not "Asia Rotations"
                data.add(new ConferenceRecord("SIGIR", "Taipei, Taiwan", "ACM Digital Library", "https://sigir.org/",
                                2023));

                // BATCH 14 - SOUTH ASIA (BANGLADESH & INDIA)
                data.add(new ConferenceRecord("ICCIT", "Cox's Bazar, Bangladesh", "IEEE/Scopus",
                                "https://iccit.org.bd/", 2025));
                data.add(new ConferenceRecord("STI", "Green University, Dhaka, Bangladesh", "IEEE/Scopus",
                                "https://sti.green.edu.bd/", 2025));
                data.add(new ConferenceRecord("TENSYMP", "Dhaka, Bangladesh", "IEEE/Scopus", "https://tensymp2025.org/",
                                2025));
                data.add(new ConferenceRecord("ICBSIP", "Bhopal, India", "IEEE Xplore/Scopus", "https://icbsip.org/",
                                2024));
                data.add(new ConferenceRecord("ICRASETM", "Indore, India", "Scopus", "https://icrasetm.org/", 2026));
                data.add(new ConferenceRecord("ICRICSET", "Pune, India", "Scopus", "https://icricset.org/", 2026));
                data.add(new ConferenceRecord("ICRASTEM", "Bengaluru, India", "Scopus", "https://icrastem.org/", 2026));
                data.add(new ConferenceRecord("ICIPE", "Varanasi, India", "IEEE/Scopus", "https://icipe.org/", 2026));
                data.add(new ConferenceRecord("ICAEEE", "Varanasi, India", "IEEE/Scopus", "https://icaeee.org/", 2026));
                data.add(new ConferenceRecord("ICEECR", "Nashik, India", "IEEE/Scopus", "https://iceecr.org/", 2026));
                data.add(new ConferenceRecord("ICBDSC", "Nashik, India", "IEEE/Scopus", "https://icbdsc.org/", 2026));
                data.add(new ConferenceRecord("ICAAIMLA", "Bhawanipatna, India", "IEEE/Scopus", "https://icaaimla.org/",
                                2026));
                data.add(new ConferenceRecord("ICNCCT", "Bhawanipatna, India", "IEEE/Scopus", "https://icncct.org/",
                                2026));
                data.add(new ConferenceRecord("ICPC2T", "Raipur, India", "IEEE/Scopus", "https://icpc2t2026.org/",
                                2026));
                data.add(new ConferenceRecord("NE-IECCE", "Sohra, India", "IEEE/Scopus", "https://ne-iecce.org/",
                                2026));
                data.add(new ConferenceRecord("ICISC", "Coimbatore, India", "IEEE/Scopus", "https://icisc2026.org/",
                                2026));
                data.add(new ConferenceRecord("IPRECON", "Kerala, India", "IEEE/Scopus", "https://iprecon.org/", 2026));
                data.add(new ConferenceRecord("ANTS", "New Delhi, India", "IEEE/Scopus", "https://ants2025.org/",
                                2025));
                data.add(new ConferenceRecord("COMSNETS", "Bengaluru, India", "IEEE/ACM Digital Library/Scopus",
                                "https://comsnets.org/", 2026));
                data.add(new ConferenceRecord("ICCA", "AIUB, Dhaka, Bangladesh", "IEEE/Scopus",
                                "https://icca.aiub.edu/", 2026));

                // BATCH 15 - SOUTHEAST ASIA
                data.add(new ConferenceRecord("ICWCNC", "Kuala Lumpur, Malaysia", "IEEE/Scopus",
                                "https://wcnc2026.ieee.org/", 2026));
                data.add(new ConferenceRecord("ROBOTHIA", "Kuala Lumpur, Malaysia", "IEEE/Scopus",
                                "https://robothia2026.org/", 2026));
                data.add(new ConferenceRecord("ISCAIE", "Penang, Malaysia", "IEEE/Scopus", "https://iscaie2026.org/",
                                2026));
                data.add(new ConferenceRecord("ISIEA", "Kuala Lumpur, Malaysia", "IEEE/Scopus",
                                "https://isiea2026.org/", 2026));
                data.add(new ConferenceRecord("ISCI", "Kuala Lumpur, Malaysia", "IEEE/Scopus", "https://isci2026.org/",
                                2026));
                data.add(new ConferenceRecord("IPEE", "Penang, Malaysia", "Springer/Scopus", "https://ipee.net/",
                                2026));
                data.add(new ConferenceRecord("SCA Asia", "Singapore", "ACM Digital Library/Scopus",
                                "https://sc-asia.org/", 2026));
                data.add(new ConferenceRecord("ICENS", "Singapore", "Scopus", "https://icens.org.sg/", 2026));
                data.add(new ConferenceRecord("ICRAET", "Singapore", "Scopus", "https://icraet.org/", 2026));
                data.add(new ConferenceRecord("ICMT", "Singapore", "Scopus", "https://icmt.org/", 2026));
                data.add(new ConferenceRecord("ICTHM", "Bangkok, Thailand", "Scopus", "https://icthm.org/", 2026));
                data.add(new ConferenceRecord("ICSTM", "Bangkok, Thailand", "Scopus", "https://icstm.org/", 2026));
                data.add(new ConferenceRecord("ICEMSS", "Bangkok, Thailand", "Scopus", "https://icemss.org/", 2026));
                data.add(new ConferenceRecord("ICETL", "Bangkok, Thailand", "Scopus", "https://icetl.org/", 2026));
                data.add(new ConferenceRecord("ICEBM", "Kota Kinabalu, Malaysia", "Scopus", "https://icebm.org/",
                                2026));
                data.add(new ConferenceRecord("IMCSEM", "Kuala Lumpur, Malaysia", "Scopus", "https://imcsem.org/",
                                2026));
                data.add(new ConferenceRecord("ICRASIF", "Kuala Lumpur, Malaysia", "Scopus", "https://icrasif.org/",
                                2026));
                data.add(new ConferenceRecord("INCITEST", "Bandung, Indonesia", "IEEE/Scopus", "https://incitest.org/",
                                2026));
                data.add(new ConferenceRecord("ICTA", "Jakarta, Indonesia", "IEEE/Scopus", "https://icta.org/", 2026));
                data.add(new ConferenceRecord("APARM", "Singapore", "Scopus", "https://aparm2026.org/", 2026));

                // BATCH 16 - EAST ASIA
                data.add(new ConferenceRecord("ICWOC", "Nanjing, China", "IEEE/Scopus", "https://icwoc.org/", 2026));
                data.add(new ConferenceRecord("HP3C", "Jinan, China", "ACM Digital Library/Scopus", "https://hp3c.org/",
                                2026));
                data.add(new ConferenceRecord("HPCCT", "Chongqing, China", "Scopus/ESCI", "https://hpcct.org/", 2026));
                data.add(new ConferenceRecord("ICIVC", "Kunming, China", "IEEE/Scopus", "https://icivc.org/", 2026));
                data.add(new ConferenceRecord("CCCN", "Jeju, South Korea", "Scopus", "https://cccn.org/", 2026));
                data.add(new ConferenceRecord("ICBDC", "Jeju, South Korea", "Scopus", "https://icbdc.org/", 2026));
                data.add(new ConferenceRecord("CCAI", "Nanjing, China", "IEEE/Scopus", "https://ccai.org/", 2026));
                data.add(new ConferenceRecord("ICBDT", "Nanchang, China", "ACM Digital Library/Scopus",
                                "https://icbdt.org/", 2026));
                data.add(new ConferenceRecord("CNIOT", "Guangzhou, China", "IEEE/Scopus", "https://cniot.org/", 2026));
                data.add(new ConferenceRecord("CVIPPR", "Shanghai, China", "Scopus", "https://cvippr.org/", 2026));
                data.add(new ConferenceRecord("MLANN", "Shanghai, China", "Scopus", "https://mlann.org/", 2026));
                data.add(new ConferenceRecord("ICAISL", "Guangzhou, China", "Scopus", "https://icaisl.org/", 2026));
                data.add(new ConferenceRecord("ICAIBD", "Chengdu, China", "IEEE/Scopus", "https://icaibd.org/", 2026));
                data.add(new ConferenceRecord("BDPC", "Beijing, China", "Scopus", "https://bdpc.org/", 2026));
                data.add(new ConferenceRecord("AAIP", "Guilin, China", "Scopus", "https://aaip.org/", 2026));
                data.add(new ConferenceRecord("SEAI", "Fuzhou, China", "IEEE/Scopus", "https://seai.org/", 2026));
                data.add(new ConferenceRecord("AITC", "Chengdu, China", "ACM Digital Library/Scopus",
                                "https://aitc.org/", 2026));
                data.add(new ConferenceRecord("WSAI", "Jinan, China", "Scopus", "https://wsai.org/", 2026));
                data.add(new ConferenceRecord("RSAE", "Shanghai, China", "Scopus", "https://rsae.org/", 2026));
                data.add(new ConferenceRecord("NLPAI", "Urumqi, China", "Scopus", "https://nlpai.org/", 2026));
                data.add(new ConferenceRecord("SPML", "Hangzhou, China", "IEEE/Scopus", "https://spml.org/", 2026));
                data.add(new ConferenceRecord("ACMLC", "Beijing, China", "Scopus", "https://acmlc.org/", 2026));
                data.add(new ConferenceRecord("AEIT", "Sapporo, Japan", "Scopus", "https://aeit.net/", 2026));
                data.add(new ConferenceRecord("ICMLC", "Nanjing, China", "Scopus", "https://icmlc.org/", 2026));
                data.add(new ConferenceRecord("GLOBECOM", "Taipei, Taiwan", "IEEE/Scopus", "https://globecom2025.org/",
                                2025));
                data.add(new ConferenceRecord("INFOCOM", "Tokyo, Japan", "IEEE/Scopus", "https://infocom2026.org/",
                                2026));
                // FIX: MICCAI 2025 is correctly listed here — duplicate in BATCH 21 removed
                data.add(new ConferenceRecord("MICCAI", "Daejeon, South Korea", "Springer/Scopus",
                                "https://miccai2025.org/", 2025));
                data.add(new ConferenceRecord("ICACT", "Pyeongchang, South Korea", "IEEE/Scopus", "https://icact.org/",
                                2026));
                data.add(new ConferenceRecord("APDSP", "Chengdu, China", "Scopus", "https://apdsp.org/", 2026));
                data.add(new ConferenceRecord("ICCGV", "Chengdu, China", "Scopus", "https://iccgv.org/", 2026));

                // BATCH 17 - MIDDLE EAST & CENTRAL ASIA
                data.add(new ConferenceRecord("ICBIoTML", "Dubai, UAE", "Scopus", "https://icbiotml.org/", 2026));
                data.add(new ConferenceRecord("IC4E", "Dubai, UAE", "Scopus", "https://ic4e.org/", 2026));
                data.add(new ConferenceRecord("ICMIT", "Doha, Qatar", "Scopus", "https://icmit.org/", 2026));
                data.add(new ConferenceRecord("ICESS", "Riyadh, Saudi Arabia", "Scopus", "https://icess.org/", 2026));
                data.add(new ConferenceRecord("IC2NM", "Madinah, Saudi Arabia", "Scopus", "https://ic2nm.org/", 2026));
                data.add(new ConferenceRecord("ICIMGBM", "Istanbul, Turkey", "Scopus", "https://icimgbm.org/", 2026));
                data.add(new ConferenceRecord("ICCABES", "Istanbul, Turkey", "Scopus", "https://iccabes.org/", 2026));
                data.add(new ConferenceRecord("ICMLCN", "Abu Dhabi, UAE", "IEEE/Scopus", "https://icmlcn2026.org/",
                                2026));

                // BATCH 18 - ADDITIONAL SOUTH ASIA
                data.add(new ConferenceRecord("ICPH", "Colombo, Sri Lanka", "Scopus", "https://icph.org/", 2026));
                data.add(new ConferenceRecord("ICADI", "Anuradhapura, Sri Lanka", "Scopus", "https://icadi.org/",
                                2026));
                data.add(new ConferenceRecord("MNDCS", "Silchar, India", "IEEE/Scopus", "https://mndcs2026.org/",
                                2026));
                data.add(new ConferenceRecord("ICAMMS", "Nagpur, India", "Scopus", "https://icamms.org/", 2026));
                data.add(new ConferenceRecord("INCOM", "Chennai, India", "Scopus", "https://incom2026.org/", 2026));
                data.add(new ConferenceRecord("ICRACSIT", "Ambala, India", "Scopus", "https://icracsit.org/", 2026));
                data.add(new ConferenceRecord("ICMIPE", "Bhawanipatna, India", "Scopus", "https://icmipe.org/", 2026));
                data.add(new ConferenceRecord("ICABMIS", "Bhawanipatna, India", "Scopus", "https://icabmis.org/",
                                2026));
                data.add(new ConferenceRecord("ICAERD", "Nashik, India", "Scopus", "https://icaerd.org/", 2026));
                data.add(new ConferenceRecord("ICEIC", "Nashik, India", "Scopus", "https://iceic.org/", 2026));
                data.add(new ConferenceRecord("ICEMS", "Nashik, India", "Scopus", "https://icems.org/", 2026));
                data.add(new ConferenceRecord("ICCEIE", "Nashik, India", "Scopus", "https://icceie.org/", 2026));
                data.add(new ConferenceRecord("ICBMSI", "Bhawanipatna, India", "Scopus", "https://icbmsi.org/", 2026));
                data.add(new ConferenceRecord("ICRASET", "Bhawanipatna, India", "Scopus", "https://icraset.org/",
                                2026));
                data.add(new ConferenceRecord("ICRAETS", "Pune, India", "Scopus", "https://icraets.org/", 2026));
                data.add(new ConferenceRecord("ICARCCC", "Pune, India", "Scopus", "https://icarccc.org/", 2026));
                data.add(new ConferenceRecord("ICBDAIT", "Pune, India", "Scopus", "https://icbdait.org/", 2026));
                data.add(new ConferenceRecord("ICCSIS", "Tokyo, Japan", "Scopus", "https://iccsis.org/", 2026));
                data.add(new ConferenceRecord("ICMLCG", "Tokyo, Japan", "Scopus", "https://icmlcg.org/", 2026));
                data.add(new ConferenceRecord("ICELT", "Tokyo, Japan", "Scopus", "https://icelt.org/", 2026));
                data.add(new ConferenceRecord("ICRCE", "Osaka, Japan", "Scopus", "https://icrce.org/", 2026));
                data.add(new ConferenceRecord("CEES", "Osaka, Japan", "Scopus", "https://cees.org/", 2026));

                // BATCH 19 - NORTH AMERICA
                // FIX: CVPR 2025 was held in Nashville, TN, USA — not "USA/Seattle"
                data.add(new ConferenceRecord("CVPR", "Nashville, TN, USA", "IEEE/CVF", "https://cvpr.thecvf.com/",
                                2025));
                data.add(new ConferenceRecord("ICML", "Vancouver, BC, Canada", "PMLR/Scopus", "https://icml.cc/",
                                2025));
                // FIX: NeurIPS 2025 is in San Diego, CA, USA — not "Montreal/USA"
                data.add(new ConferenceRecord("NeurIPS", "San Diego, CA, USA", "Scopus", "https://nips.cc/", 2025));
                data.add(new ConferenceRecord("IEEE S&P", "San Francisco, CA, USA", "IEEE",
                                "https://ieee-security.org/",
                                2026));
                data.add(new ConferenceRecord("ACM SIGGRAPH", "Los Angeles, CA, USA", "ACM Digital Library",
                                "https://s2026.siggraph.org/", 2026));
                data.add(new ConferenceRecord("DAC", "San Francisco, CA, USA", "ACM Digital Library/IEEE",
                                "https://www.dac.com/", 2026));
                // FIX: ICSE 2026 is in Rio de Janeiro, Brazil — not "USA/Canada"
                data.add(new ConferenceRecord("ICSE", "Rio de Janeiro, Brazil", "IEEE/ACM Digital Library",
                                "https://conf.researchr.org/home/icse-2026", 2026));
                data.add(new ConferenceRecord("CHI", "Yokohama, Japan", "ACM Digital Library",
                                "https://chi2026.acm.org/",
                                2026));
                // FIX: INFOCOM 2025 was held in London, UK — not just "USA"
                data.add(new ConferenceRecord("INFOCOM", "London, UK", "IEEE", "https://infocom2025.ieee-infocom.org/",
                                2025));
                data.add(new ConferenceRecord("ICRA", "Atlanta, GA, USA", "IEEE",
                                "https://www.ieee-ras.org/conferences-workshops/", 2026));
                // FIX: KDD 2025 was held in Toronto, ON, Canada
                data.add(new ConferenceRecord("KDD", "Toronto, ON, Canada", "ACM Digital Library",
                                "https://kdd.org/kdd2025/", 2025));
                // FIX: VLDB 2025 was held in London, UK
                data.add(new ConferenceRecord("VLDB", "London, UK", "Scopus/DBLP", "https://vldb.org/2025/", 2025));
                // FIX: AAAI 2026 is in Philadelphia, PA, USA
                data.add(new ConferenceRecord("AAAI", "Philadelphia, PA, USA", "Scopus/AAAI",
                                "https://aaai.org/Conferences/AAAI-26/", 2026));
                data.add(new ConferenceRecord("USENIX Security", "Seattle, WA, USA", "USENIX",
                                "https://www.usenix.org/", 2025));
                data.add(new ConferenceRecord("MICRO", "Seoul, South Korea", "IEEE/ACM", "https://microarch.org/",
                                2025));
                data.add(new ConferenceRecord("SC", "Atlanta, GA, USA", "ACM Digital Library/IEEE",
                                "https://sc25.supercomputing.org/", 2025));
                // FIX: WWW 2026 (The Web Conference) is in Sydney, Australia
                data.add(new ConferenceRecord("WWW", "Sydney, Australia", "ACM Digital Library",
                                "https://www2026.thewebconf.org/", 2026));
                // FIX: ICCAD is traditionally held in San Jose, CA, USA
                data.add(new ConferenceRecord("ICCAD", "San Jose, CA, USA", "ACM Digital Library/IEEE",
                                "https://iccad.com/", 2025));
                data.add(new ConferenceRecord("RTSS", "Ottawa, ON, Canada", "IEEE", "https://2025.rtss.org/", 2025));
                // FIX: ISCA 2025 — removed duplicate from BATCH 10; this is the canonical entry
                data.add(new ConferenceRecord("ISCA", "Tokyo, Japan", "ACM Digital Library/IEEE",
                                "https://iscaconf.org/isca2025/", 2025));

                // BATCH 20 - EUROPE
                data.add(new ConferenceRecord("ECCV", "Malmö, Sweden", "Springer/Scopus", "https://eccv2026.org/",
                                2026));
                // FIX: ICLR 2025 was held in Singapore — not a Europe-based conference
                data.add(new ConferenceRecord("ICLR", "Singapore", "Scopus", "https://iclr.cc/", 2025));
                // FIX: EACL 2025 was held in Malta
                data.add(new ConferenceRecord("EACL", "Malta", "ACL/Scopus",
                                "https://2025.eacl.org/", 2025));
                data.add(new ConferenceRecord("Euro-Par", "Dresden, Germany", "Springer/Scopus",
                                "https://europar2025.org/", 2025));
                data.add(new ConferenceRecord("ESOP", "Edinburgh, UK", "Springer/Scopus", "https://etaps.org/2026/esop",
                                2026));
                data.add(new ConferenceRecord("CAV", "Zagreb, Croatia", "Springer/Scopus", "http://i-cav.org/", 2025));
                data.add(new ConferenceRecord("EDBT", "Vienna, Austria", "Scopus/OpenProceedings",
                                "https://edbticdt2026.org/", 2026));
                data.add(new ConferenceRecord("PERCOM", "Rome, Italy", "IEEE", "https://www.percom.org/",
                                2026));
                data.add(new ConferenceRecord("EuroS&P", "Amsterdam, Netherlands", "IEEE",
                                "https://www.ieee-security.org/TC/EuroSP2026/", 2026));
                data.add(new ConferenceRecord("IPSN", "Helsinki, Finland", "IEEE/ACM Digital Library",
                                "https://ipsn.acm.org/2026/", 2026));
                data.add(new ConferenceRecord("ECOOP", "Bergen, Norway", "ACM Digital Library/Scopus",
                                "https://2025.ecoop.org/", 2025));
                data.add(new ConferenceRecord("ISSTA", "Trondheim, Norway", "ACM Digital Library",
                                "https://conf.researchr.org/home/issta-2026", 2026));
                data.add(new ConferenceRecord("ASE", "Montreal, QC, Canada", "IEEE/ACM Digital Library",
                                "https://ase-conferences.org/", 2025));
                data.add(new ConferenceRecord("ECAI", "Bled, Slovenia", "Scopus", "https://ecai2026.org/", 2026));
                data.add(new ConferenceRecord("ICDM", "Washington, DC, USA", "IEEE", "https://icdm2025.org/", 2025));
                data.add(new ConferenceRecord("CIKM", "Atlanta, GA, USA", "ACM Digital Library",
                                "https://www.cikm2025.org/", 2025));
                data.add(new ConferenceRecord("RE", "Lisbon, Portugal", "IEEE", "https://re26.org/", 2026));
                // FIX: DATE is a European conference typically held in Frankfurt, Germany
                data.add(new ConferenceRecord("DATE", "Frankfurt, Germany", "IEEE/ACM Digital Library",
                                "https://www.date-conference.com/", 2026));
                data.add(new ConferenceRecord("ICST", "Naples, Italy", "IEEE", "https://icst2026.com/", 2026));
                data.add(new ConferenceRecord("PPoPP", "Las Vegas, NV, USA", "ACM Digital Library",
                                "https://ppopp26.sigplan.org/", 2026));

                // BATCH 21 - SPECIALIZED MEDICAL & AI
                // FIX: MICCAI 2025 duplicate removed — canonical entry is in BATCH 16
                data.add(new ConferenceRecord("EMBC", "Copenhagen, Denmark", "IEEE EMBS", "https://embc.embs.org/2026/",
                                2026));
                data.add(new ConferenceRecord("CHASE", "Nashville, TN, USA", "ACM Digital Library/IEEE",
                                "https://chase2026.org/", 2026));
                data.add(new ConferenceRecord("BHI", "Houston, TX, USA", "IEEE", "https://bhi.embs.org/2026/", 2026));
                data.add(new ConferenceRecord("ISBI", "Athens, Greece", "IEEE",
                                "https://biomedicalimaging.org/2026/", 2026));
                data.add(new ConferenceRecord("Digital Health", "Melbourne, Australia", "ACM Digital Library/Scopus",
                                "https://www.digitalhealth.org/", 2025));
                data.add(new ConferenceRecord("PervasiveHealth", "Tampere, Finland", "ACM Digital Library",
                                "https://pervasivehealth.org/", 2025));
                data.add(new ConferenceRecord("AISTATS", "Phuket, Thailand", "PMLR", "https://aistats.org/", 2026));
                // FIX: WACV is almost always held in Tucson, AZ, USA
                data.add(new ConferenceRecord("WACV", "Tucson, AZ, USA", "IEEE", "https://wacv2026.thecvf.com/", 2026));
                data.add(new ConferenceRecord("BMVC", "Bristol, UK", "Scopus", "https://bmvc2025.org/",
                                2025));

                // BATCH 22 - MID-TIER & EMERGING
                data.add(new ConferenceRecord("COCOON", "Chengdu, China", "Springer/Scopus", "https://cocoon2026.org/",
                                2026));
                data.add(new ConferenceRecord("EWSN", "Barcelona, Spain", "ACM Digital Library",
                                "https://ewsn2026.org/", 2026));
                data.add(new ConferenceRecord("MSWiM", "Miami, FL, USA", "ACM Digital Library",
                                "https://mswimconf.com/2025/", 2025));
                // FIX: USENIX LISA is typically in Seattle, WA, USA
                data.add(new ConferenceRecord("LISA", "Seattle, WA, USA", "USENIX", "https://www.usenix.org/lisa26",
                                2026));
                // FIX: USENIX FAST is typically in Santa Clara, CA, USA
                data.add(new ConferenceRecord("FAST", "Santa Clara, CA, USA", "USENIX", "https://www.usenix.org/fast26",
                                2026));
                // FIX: SOSP 2025 was held in Seoul, South Korea
                data.add(new ConferenceRecord("SOSP", "Seoul, South Korea", "ACM Digital Library",
                                "https://sosp2025.org/", 2025));
                // FIX: OSDI (USENIX) is typically in Seattle, WA, USA
                data.add(new ConferenceRecord("OSDI", "Seattle, WA, USA", "USENIX", "https://www.usenix.org/osdi26",
                                2026));
                data.add(new ConferenceRecord("MobiCom", "Hong Kong, China", "ACM Digital Library",
                                "https://sigmobile.org/mobicom/2026/", 2026));
                data.add(new ConferenceRecord("MobiSys", "Tokyo, Japan", "ACM Digital Library",
                                "https://sigmobile.org/mobisys/2025/", 2025));
                data.add(new ConferenceRecord("SenSys", "Zurich, Switzerland", "ACM Digital Library",
                                "https://sensys.acm.org/2025/", 2025));

                // BATCH 23 - CYBERSECURITY & NETWORKING
                data.add(new ConferenceRecord("CCS", "Taipei, Taiwan", "ACM Digital Library",
                                "https://www.sigsac.org/ccs/CCS2025/", 2025));
                // FIX: NDSS is always held in San Diego, CA, USA
                data.add(new ConferenceRecord("NDSS", "San Diego, CA, USA", "Internet Society",
                                "https://www.ndss-symposium.org/",
                                2026));
                data.add(new ConferenceRecord("ESORICS", "Bydgoszcz, Poland", "Springer/Scopus",
                                "https://esorics2025.org/",
                                2025));
                data.add(new ConferenceRecord("RAID", "Philadelphia, PA, USA", "Scopus", "https://raid2025.org/",
                                2025));
                data.add(new ConferenceRecord("PETS", "Washington, DC, USA", "Scopus/Sciendo",
                                "https://petsymposium.org/", 2026));
                data.add(new ConferenceRecord("CSF", "Santa Cruz, CA, USA", "IEEE",
                                "https://www.ieee-security.org/TC/CSF2026/", 2026));
                // FIX: SIGCOMM 2025 was held in Sydney, Australia
                data.add(new ConferenceRecord("SIGCOMM", "Sydney, Australia", "ACM Digital Library",
                                "https://events.sigcomm.org/sigcomm/2025/", 2025));
                // FIX: NSDI (USENIX) is typically in Santa Clara, CA, USA
                data.add(new ConferenceRecord("NSDI", "Santa Clara, CA, USA", "USENIX", "https://www.usenix.org/nsdi26",
                                2026));
                data.add(new ConferenceRecord("ICNP", "Dallas, TX, USA", "IEEE", "https://icnp25.ieee-icnp.org/",
                                2025));
                data.add(new ConferenceRecord("IMC", "Madrid, Spain", "ACM Digital Library",
                                "https://sigcomm.org/imc2025/", 2025));

                // BATCH 24 - CLOUD, BIG DATA & SYSTEMS
                data.add(new ConferenceRecord("SoCC", "Herndon, VA, USA", "ACM Digital Library",
                                "https://acmsocc.org/2025/", 2025));
                data.add(new ConferenceRecord("BigData", "Washington, DC, USA", "IEEE/Scopus",
                                "https://bigdataieee.org/BigData2025/", 2025));
                data.add(new ConferenceRecord("ICDCS", "Honolulu, HI, USA", "IEEE", "https://icdcs2026.org/", 2026));
                data.add(new ConferenceRecord("PODC", "Naples, Italy", "ACM Digital Library",
                                "https://podc.org/", 2025));
                data.add(new ConferenceRecord("DISC", "Berlin, Germany", "Scopus",
                                "http://www.disc-conference.org/", 2025));
                data.add(new ConferenceRecord("IPDPS", "Chicago, IL, USA", "IEEE", "https://www.ipdps.org/", 2026));
                data.add(new ConferenceRecord("HPDC", "Portland, OR, USA", "ACM Digital Library",
                                "https://www.hpdc.org/2026/", 2026));
                data.add(new ConferenceRecord("CCGrid", "Tokyo, Japan", "IEEE/ACM Digital Library",
                                "https://ccgrid2026.org/", 2026));
                data.add(new ConferenceRecord("ICAC", "Washington, DC, USA", "IEEE", "https://icac2025.org/", 2025));
                data.add(new ConferenceRecord("ICPE", "Amsterdam, Netherlands", "ACM Digital Library/SPEC",
                                "https://icpe2026.acm.org/", 2026));

                // BATCH 25 - NLP, HCI & WEB TECH
                // FIX: ACL 2025 was held in Vienna, Austria
                data.add(new ConferenceRecord("ACL", "Vienna, Austria", "Scopus/ACL", "https://2025.aclweb.org/",
                                2025));
                // FIX: EMNLP 2025 was held in Miami, FL, USA
                data.add(new ConferenceRecord("EMNLP", "Miami, FL, USA", "Scopus", "https://2025.emnlp.org/", 2025));
                data.add(new ConferenceRecord("NAACL", "Albuquerque, NM, USA", "Scopus", "https://2026.naacl.org/",
                                2026));
                // FIX: SIGIR 2025 was held in Padova, Italy
                data.add(new ConferenceRecord("SIGIR", "Padova, Italy", "ACM Digital Library",
                                "https://sigir.org/sigir2025/", 2025));
                data.add(new ConferenceRecord("ECIR", "Lucca, Italy", "Springer/Scopus",
                                "https://ecir2026.org/", 2026));
                data.add(new ConferenceRecord("CSCW", "Bergen, Norway", "ACM Digital Library",
                                "https://cscw.acm.org/2026/", 2026));
                data.add(new ConferenceRecord("UbiComp", "Espoo, Finland", "ACM Digital Library",
                                "https://ubicomp.org/ubicomp2025/", 2025));
                data.add(new ConferenceRecord("UIST", "Pittsburgh, PA, USA", "ACM Digital Library",
                                "https://uist.acm.org/2025/", 2025));
                data.add(new ConferenceRecord("IUI", "Bologna, Italy", "ACM Digital Library",
                                "https://iui.acm.org/2026/", 2026));
                data.add(new ConferenceRecord("WSDM", "Seattle, WA, USA", "ACM Digital Library",
                                "https://www.wsdm-conference.org/2026/", 2026));

                // BATCH 26 - ROBOTICS, AR/VR & GRAPHICS
                // FIX: IROS 2025 was held in Abu Dhabi, UAE
                data.add(new ConferenceRecord("IROS", "Abu Dhabi, UAE", "IEEE/RSJ", "https://iros2025.org/", 2025));
                data.add(new ConferenceRecord("RSS", "Los Angeles, CA, USA", "Scopus",
                                "https://roboticsconference.org/", 2025));
                data.add(new ConferenceRecord("CASE", "Anaheim, CA, USA", "IEEE", "https://case2026.org/", 2026));
                data.add(new ConferenceRecord("IEEE VR", "Chicago, IL, USA", "IEEE", "https://ieeevr.org/2026/", 2026));
                data.add(new ConferenceRecord("ISMAR", "Daejeon, South Korea", "IEEE", "https://ismar2025.org/",
                                2025));
                data.add(new ConferenceRecord("Eurographics", "Eindhoven, Netherlands", "Scopus",
                                "https://www.eurographics2026.org/",
                                2026));
                data.add(new ConferenceRecord("EGSR", "Prague, Czech Republic", "Scopus", "https://egsr2025.org/",
                                2025));
                data.add(new ConferenceRecord("SGP", "Copenhagen, Denmark", "Scopus", "https://geometryprocessing.org/",
                                2025));
                // FIX: Pacific Graphics is an Asia-Pacific conference (rotates in
                // Japan/China/Korea/etc.), NOT "USA Rotations"
                data.add(new ConferenceRecord("Pacific Graphics", "Beijing, China", "Scopus", "https://pg2025.org/",
                                2025));
                data.add(new ConferenceRecord("I3D", "San Francisco, CA, USA", "ACM Digital Library",
                                "https://i3dsymposium.org/",
                                2026));

                // BATCH 27 - HARDWARE, ARCHITECTURE & TEST
                data.add(new ConferenceRecord("HPCA", "Las Vegas, NV, USA", "IEEE", "https://hpca-conf.org/2026/",
                                2026));
                data.add(new ConferenceRecord("ASPLOS", "Rotterdam, Netherlands", "ACM Digital Library/IEEE",
                                "https://asplos-conference.org/", 2026));
                // FIX: FPGA Symposium (ACM/SIGDA) is typically held in Monterey, CA, USA
                data.add(new ConferenceRecord("FPGA", "Monterey, CA, USA", "ACM Digital Library",
                                "https://www.isfpga.org/",
                                2026));
                data.add(new ConferenceRecord("FPL", "Turin, Italy", "IEEE/Scopus", "https://fpl2025.org/", 2025));
                data.add(new ConferenceRecord("FCCM", "Orlando, FL, USA", "IEEE", "https://fccm.org/", 2026));
                // FIX: ITC (International Test Conference) is typically in Anaheim/Washington
                // DC, USA
                data.add(new ConferenceRecord("ITC", "Anaheim, CA, USA", "IEEE", "https://itctestweek.org/", 2025));
                data.add(new ConferenceRecord("VTS", "San Diego, CA, USA", "IEEE", "https://tttc-vts.org/", 2026));
                data.add(new ConferenceRecord("ICPP", "Goteborg, Sweden", "ACM Digital Library/IEEE",
                                "https://icpp-conf.org/", 2025));
                data.add(new ConferenceRecord("ICS", "Salt Lake City, UT, USA", "ACM Digital Library",
                                "https://ics-conference.org/", 2026));
                data.add(new ConferenceRecord("PACT", "San Antonio, TX, USA", "IEEE/ACM Digital Library",
                                "https://pactconf.org/", 2025));

                // BATCH 28 - THEORY & LOGIC
                data.add(new ConferenceRecord("STOC", "San Francisco, CA, USA", "ACM Digital Library",
                                "https://acm-stoc.org/", 2026));
                data.add(new ConferenceRecord("FOCS", "Chicago, IL, USA", "IEEE", "https://focs.computer.org/", 2025));
                // FIX: SODA URL had typo "iam.org" → correct is "siam.org"
                data.add(new ConferenceRecord("SODA", "New Orleans, LA, USA", "SIAM/ACM Digital Library",
                                "https://www.siam.org/conferences/cm/conference/soda26", 2026));
                data.add(new ConferenceRecord("LICS", "Singapore", "IEEE/ACM Digital Library",
                                "https://lics.siglog.org/", 2026));
                data.add(new ConferenceRecord("ICALP", "Geneva, Switzerland", "Scopus/LIPIcs",
                                "https://eatcs.org/icalp2026/",
                                2026));
                data.add(new ConferenceRecord("CCC", "Ann Arbor, MI, USA", "Scopus",
                                "http://computationalcomplexity.org/",
                                2025));
                data.add(new ConferenceRecord("PODS", "Berlin, Germany", "ACM Digital Library",
                                "https://databasetheory.org/pods2026", 2026));
                data.add(new ConferenceRecord("TCC", "Taipei, Taiwan", "Springer/Scopus", "https://tcc.iacr.org/",
                                2025));
                // FIX: CRYPTO is always held in Santa Barbara, CA, USA
                data.add(new ConferenceRecord("CRYPTO", "Santa Barbara, CA, USA", "Springer/Scopus",
                                "https://crypto.iacr.org/2025/",
                                2025));
                data.add(new ConferenceRecord("EUROCRYPT", "Madrid, Spain", "Springer/Scopus",
                                "https://eurocrypt.iacr.org/2026/", 2026));

                return data;
        }
}