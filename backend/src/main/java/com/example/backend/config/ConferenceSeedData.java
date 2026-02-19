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
        data.add(new ConferenceRecord("ICCIT", "Cox's Bazar, Bangladesh", "IEEE Xplore",
                "https://ieeexplore.ieee.org/xpl/conhome/1000346/all-proceedings", 2026));
        data.add(new ConferenceRecord("ICECTE", "CUET, Bangladesh", "IEEE Xplore",
                "https://ieeexplore.ieee.org/xpl/conhome/1000346/all-proceedings", 2026));
        data.add(new ConferenceRecord("ICEFRONT", "International", "IEEE Xplore",
                "https://ieeexplore.ieee.org/xpl/conhome/1000346/all-proceedings", 2026));
        data.add(new ConferenceRecord("PECCII", "International", "IEEE", "https://ieeexplore.ieee.org/", 2024));
        data.add(new ConferenceRecord("QPAIN", "International", "IEEE", "https://qpain.org/", 2026));
        // BATCH 8 - ASIA-PACIFIC REGIONAL FLAGSHIPS (IEEE/ACM)
        data.add(new ConferenceRecord("APSEC", "Asia-Pacific", "IEEE", "https://apsec2024.org/", 2024));
        data.add(new ConferenceRecord("TENCON", "Region 10", "IEEE", "https://tencon2024.org/", 2024));
        data.add(new ConferenceRecord("ASP-DAC", "Asia-South Pacific", "ACM/IEEE", "https://aspdac.com/", 2025));
        data.add(new ConferenceRecord("COMPSAC", "Japan/Hybrid", "IEEE", "https://ieee-compsac.org/", 2024));
        data.add(new ConferenceRecord("PAKDD", "Asia", "Springer", "https://pakdd.org/", 2025));
        data.add(new ConferenceRecord("PRICAI", "Pacific Rim", "Springer", "https://pricai.org/", 2024));
        data.add(new ConferenceRecord("HPC Asia", "Asia-Pacific", "ACM", "https://hpcasia.org/", 2025));
        data.add(new ConferenceRecord("ASPLOS", "Asia Venues", "ACM", "https://asplos-conference.org/", 2024));
        data.add(new ConferenceRecord("ACCV", "Asian", "Springer", "https://accv2024.org/", 2024));
        data.add(new ConferenceRecord("ICONIP", "International", "Springer", "https://iconip2024.org/", 2024));
        // BATCH 9 - SOUTH ASIA & BANGLADESH SPECIALIZED (2021-2026)
        data.add(new ConferenceRecord("NSysS", "Dhaka, Bangladesh", "IEEE Xplore", "https://nsyss.org/", 2025));
        data.add(new ConferenceRecord("TENSYMP", "Region 10", "IEEE", "https://tensymp2024.org/", 2024));
        data.add(new ConferenceRecord("ICSET", "South Asia", "IEEE", "https://icset.org/", 2024));
        data.add(new ConferenceRecord("ICMLA", "Asia", "IEEE", "https://icmla-conference.org/", 2025));
        data.add(new ConferenceRecord("SPICES", "India", "IEEE", "https://spices.org.in/", 2024));
        data.add(new ConferenceRecord("ICCV", "Asia Rotations", "IEEE", "https://iccv2023.thecvf.com/", 2023));
        data.add(new ConferenceRecord("COLING", "Asia Venues", "ACM/ACL", "https://coling2025.org/", 2025));
        data.add(new ConferenceRecord("COMSNETS", "Bangalore, India", "IEEE/ACM", "https://comsnets.org/", 2025));
        data.add(new ConferenceRecord("HiPC", "India", "IEEE/ACM", "https://hipc.org/", 2024));
        data.add(new ConferenceRecord("ISEC", "India", "ACM", "https://isec.org.in/", 2026));
        // BATCH 10 - SOUTHEAST ASIA & EAST ASIA FLAGSHIPS
        data.add(new ConferenceRecord("SCA", "Singapore/Japan", "ACM", "https://sc-asia.org/", 2026));
        data.add(new ConferenceRecord("Ubi-Media", "Malaysia", "IEEE", "https://ubi-media.org/", 2026));
        data.add(new ConferenceRecord("ICCAI", "Japan", "ACM", "https://iccai.net/", 2026));
        data.add(new ConferenceRecord("MSIE", "Thailand", "ACM", "https://msie.org/", 2026));
        data.add(new ConferenceRecord("ICCA", "International", "IEEE", "https://ieee-icca.org/", 2025));
        data.add(new ConferenceRecord("AISTATS", "Asia", "PMLR", "https://aistats.org/", 2024));
        data.add(new ConferenceRecord("IJCAI", "Asia Rotations", "IJCAI", "https://ijcai.org/", 2024));
        data.add(new ConferenceRecord("ISCA", "Asia Rotations", "ACM/IEEE", "https://iscaconf.org/", 2025));
        data.add(new ConferenceRecord("ICDE", "Asia Rotations", "IEEE", "https://icde2024.org/", 2024));
        data.add(new ConferenceRecord("SIGIR", "Asia Rotations", "ACM", "https://sigir.org/", 2023));
        // BATCH 14 - SOUTH ASIA (BANGLADESH & INDIA)
        data.add(
                new ConferenceRecord("ICCIT", "Cox's Bazar, Bangladesh", "IEEE/Scopus", "https://iccit.org.bd/", 2025));
        data.add(new ConferenceRecord("STI", "Green University, Dhaka", "IEEE/Scopus", "https://sti.green.edu.bd/",
                2025));
        data.add(new ConferenceRecord("TENSYMP", "South Asia", "IEEE/Scopus", "https://tensymp2025.org/", 2025));
        data.add(new ConferenceRecord("ICBSIP", "India", "IEEE Xplore/Scopus", "https://icbsip.org/", 2024));
        data.add(new ConferenceRecord("ICRASETM", "Indore, India", "Scopus", "https://icrasetm.org/", 2026));
        data.add(new ConferenceRecord("ICRICSET", "Pune, India", "Scopus", "https://icricset.org/", 2026));
        data.add(new ConferenceRecord("ICRASTEM", "Bangalore, India", "Scopus", "https://icrastem.org/", 2026));
        data.add(new ConferenceRecord("ICIPE", "Varanasi, India", "IEEE/Scopus", "https://icipe.org/", 2026));
        data.add(new ConferenceRecord("ICAEEE", "Varanasi, India", "IEEE/Scopus", "https://icaeee.org/", 2026));
        data.add(new ConferenceRecord("ICEECR", "Nashik, India", "IEEE/Scopus", "https://iceecr.org/", 2026));
        data.add(new ConferenceRecord("ICBDSC", "Nashik, India", "IEEE/Scopus", "https://icbdsc.org/", 2026));
        data.add(new ConferenceRecord("ICAAIMLA", "Bhawanipatna, India", "IEEE/Scopus", "https://icaaimla.org/", 2026));
        data.add(new ConferenceRecord("ICNCCT", "Bhawanipatna, India", "IEEE/Scopus", "https://icncct.org/", 2026));
        data.add(new ConferenceRecord("ICPC2T", "Raipur, India", "IEEE/Scopus", "https://icpc2t2026.org/", 2026));
        data.add(new ConferenceRecord("NE-IECCE", "Sohra, India", "IEEE/Scopus", "https://ne-iecce.org/", 2026));
        data.add(new ConferenceRecord("ICISC", "Coimbatore, India", "IEEE/Scopus", "https://icisc2026.org/", 2026));
        data.add(new ConferenceRecord("IPRECON", "Kerala, India", "IEEE/Scopus", "https://iprecon.org/", 2026));
        data.add(new ConferenceRecord("ANTS", "Delhi, India", "IEEE/Scopus", "https://ants2025.org/", 2025));
        data.add(
                new ConferenceRecord("COMSNETS", "Bangalore, India", "IEEE/ACM/Scopus", "https://comsnets.org/", 2026));
        data.add(new ConferenceRecord("ICCA", "AIUB, Dhaka", "IEEE/Scopus", "https://icca.aiub.edu/", 2026));
        // BATCH 15 - SOUTHEAST ASIA
        data.add(new ConferenceRecord("ICWCNC", "Kuala Lumpur, Malaysia", "IEEE/Scopus", "https://wcnc2026.ieee.org/",
                2026));
        data.add(new ConferenceRecord("ROBOTHIA", "Kuala Lumpur, Malaysia", "IEEE/Scopus", "https://robothia2026.org/",
                2026));
        data.add(new ConferenceRecord("ISCAIE", "Penang, Malaysia", "IEEE/Scopus", "https://iscaie2026.org/", 2026));
        data.add(
                new ConferenceRecord("ISIEA", "Kuala Lumpur, Malaysia", "IEEE/Scopus", "https://isiea2026.org/", 2026));
        data.add(new ConferenceRecord("ISCI", "Kuala Lumpur, Malaysia", "IEEE/Scopus", "https://isci2026.org/", 2026));
        data.add(new ConferenceRecord("IPEE", "Penang, Malaysia", "Springer/Scopus", "https://ipee.net/", 2026));
        data.add(new ConferenceRecord("SCA Asia", "Singapore", "ACM/Scopus", "https://sc-asia.org/", 2026));
        data.add(new ConferenceRecord("ICENS", "Singapore", "Scopus", "https://icens.org.sg/", 2026));
        data.add(new ConferenceRecord("ICRAET", "Singapore", "Scopus", "https://icraet.org/", 2026));
        data.add(new ConferenceRecord("ICMT", "Singapore", "Scopus", "https://icmt.org/", 2026));
        data.add(new ConferenceRecord("ICTHM", "Bangkok, Thailand", "Scopus", "https://icthm.org/", 2026));
        data.add(new ConferenceRecord("ICSTM", "Bangkok, Thailand", "Scopus", "https://icstm.org/", 2026));
        data.add(new ConferenceRecord("ICEMSS", "Bangkok, Thailand", "Scopus", "https://icemss.org/", 2026));
        data.add(new ConferenceRecord("ICETL", "Bangkok, Thailand", "Scopus", "https://icetl.org/", 2026));
        data.add(new ConferenceRecord("ICEBM", "Kota Kinabalu, Malaysia", "Scopus", "https://icebm.org/", 2026));
        data.add(new ConferenceRecord("IMCSEM", "Kuala Lumpur, Malaysia", "Scopus", "https://imcsem.org/", 2026));
        data.add(new ConferenceRecord("ICRASIF", "Kuala Lumpur, Malaysia", "Scopus", "https://icrasif.org/", 2026));
        data.add(new ConferenceRecord("INCITEST", "Indonesia", "IEEE/Scopus", "https://incitest.org/", 2026));
        data.add(new ConferenceRecord("ICTA", "Jakarta, Indonesia", "IEEE/Scopus", "https://icta.org/", 2026));
        data.add(new ConferenceRecord("APARM", "Singapore", "Scopus", "https://aparm2026.org/", 2026));
        // BATCH 16 - EAST ASIA
        data.add(new ConferenceRecord("ICWOC", "Nanjing, China", "IEEE/Scopus", "https://icwoc.org/", 2026));
        data.add(new ConferenceRecord("HP3C", "Jinan, China", "ACM/Scopus", "https://hp3c.org/", 2026));
        data.add(new ConferenceRecord("HPCCT", "Chongqing, China", "Scopus/ESCI", "https://hpcct.org/", 2026));
        data.add(new ConferenceRecord("ICIVC", "Kunming, China", "IEEE/Scopus", "https://icivc.org/", 2026));
        data.add(new ConferenceRecord("CCCN", "Jeju, South Korea", "Scopus", "https://cccn.org/", 2026));
        data.add(new ConferenceRecord("ICBDC", "Jeju, South Korea", "Scopus", "https://icbdc.org/", 2026));
        data.add(new ConferenceRecord("CCAI", "Nanjing, China", "IEEE/Scopus", "https://ccai.org/", 2026));
        data.add(new ConferenceRecord("ICBDT", "Nanchang, China", "ACM/Scopus", "https://icbdt.org/", 2026));
        data.add(new ConferenceRecord("CNIOT", "Guangzhou, China", "IEEE/Scopus", "https://cniot.org/", 2026));
        data.add(new ConferenceRecord("CVIPPR", "Shanghai, China", "Scopus", "https://cvippr.org/", 2026));
        data.add(new ConferenceRecord("MLANN", "Shanghai, China", "Scopus", "https://mlann.org/", 2026));
        data.add(new ConferenceRecord("ICAISL", "Guangzhou, China", "Scopus", "https://icaisl.org/", 2026));
        data.add(new ConferenceRecord("ICAIBD", "Chengdu, China", "IEEE/Scopus", "https://icaibd.org/", 2026));
        data.add(new ConferenceRecord("BDPC", "Beijing, China", "Scopus", "https://bdpc.org/", 2026));
        data.add(new ConferenceRecord("AAIP", "Guilin, China", "Scopus", "https://aaip.org/", 2026));
        data.add(new ConferenceRecord("SEAI", "Fuzhou, China", "IEEE/Scopus", "https://seai.org/", 2026));
        data.add(new ConferenceRecord("AITC", "Chengdu, China", "ACM/Scopus", "https://aitc.org/", 2026));
        data.add(new ConferenceRecord("WSAI", "Jinan, China", "Scopus", "https://wsai.org/", 2026));
        data.add(new ConferenceRecord("RSAE", "Shanghai, China", "Scopus", "https://rsae.org/", 2026));
        data.add(new ConferenceRecord("NLPAI", "Urumqi, China", "Scopus", "https://nlpai.org/", 2026));
        data.add(new ConferenceRecord("SPML", "Hangzhou, China", "IEEE/Scopus", "https://spml.org/", 2026));
        data.add(new ConferenceRecord("ACMLC", "Beijing, China", "Scopus", "https://acmlc.org/", 2026));
        data.add(new ConferenceRecord("AEIT", "Sapporo, Japan", "Scopus", "https://aeit.net/", 2026));
        data.add(new ConferenceRecord("ICMLC", "Nanjing, China", "Scopus", "https://icmlc.org/", 2026));
        data.add(new ConferenceRecord("GLOBECOM", "Taipei, Taiwan", "IEEE/Scopus", "https://globecom2025.org/", 2025));
        data.add(new ConferenceRecord("INFOCOM", "Tokyo, Japan", "IEEE/Scopus", "https://infocom2026.org/", 2026));
        data.add(new ConferenceRecord("MICCAI", "Daejeon, South Korea", "Springer/Scopus", "https://miccai2025.org/",
                2025));
        data.add(new ConferenceRecord("ICACT", "Pyeong Chang, South Korea", "IEEE/Scopus", "https://icact.org/", 2026));
        data.add(new ConferenceRecord("APDSP", "Chengdu, China", "Scopus", "https://apdsp.org/", 2026));
        data.add(new ConferenceRecord("ICCGV", "Chengdu, China", "Scopus", "https://iccgv.org/", 2026));
        // BATCH 17 - MIDDLE EAST & CENTRAL ASIA
        data.add(new ConferenceRecord("ICBIoTML", "Dubai, UAE", "Scopus", "https://icbiotml.org/", 2026));
        data.add(new ConferenceRecord("IC4E", "Dubai, UAE", "Scopus", "https://ic4e.org/", 2026));
        data.add(new ConferenceRecord("ICMIT", "Doha, Qatar", "Scopus", "https://icmit.org/", 2026));
        data.add(new ConferenceRecord("ICESS", "Riyadh, Saudi Arabia", "Scopus", "https://icess.org/", 2026));
        data.add(new ConferenceRecord("IC2NM", "Medina, Saudi Arabia", "Scopus", "https://ic2nm.org/", 2026));
        data.add(new ConferenceRecord("ICIMGBM", "Istanbul, Turkey", "Scopus", "https://icimgbm.org/", 2026));
        data.add(new ConferenceRecord("ICCABES", "Istanbul, Turkey", "Scopus", "https://iccabes.org/", 2026));
        data.add(new ConferenceRecord("ICMLCN", "Abu Dhabi, UAE", "IEEE/Scopus", "https://icmlcn2026.org/", 2026));
        // BATCH 18 - ADDITIONAL SOUTH ASIA
        data.add(new ConferenceRecord("ICPH", "Colombo, Sri Lanka", "Scopus", "https://icph.org/", 2026));
        data.add(new ConferenceRecord("ICADI", "Anuradhapura, Sri Lanka", "Scopus", "https://icadi.org/", 2026));
        data.add(new ConferenceRecord("MNDCS", "Silchar, India", "IEEE/Scopus", "https://mndcs2026.org/", 2026));
        data.add(new ConferenceRecord("ICAMMS", "Nagpur, India", "Scopus", "https://icamms.org/", 2026));
        data.add(new ConferenceRecord("INCOM", "India", "Scopus", "https://incom2026.org/", 2026));
        data.add(new ConferenceRecord("ICRACSIT", "Ambala, India", "Scopus", "https://icracsit.org/", 2026));
        data.add(new ConferenceRecord("ICMIPE", "Bhawanipatna, India", "Scopus", "https://icmipe.org/", 2026));
        data.add(new ConferenceRecord("ICABMIS", "Bhawanipatna, India", "Scopus", "https://icabmis.org/", 2026));
        data.add(new ConferenceRecord("ICAERD", "Nashik, India", "Scopus", "https://icaerd.org/", 2026));
        data.add(new ConferenceRecord("ICEIC", "Nashik, India", "Scopus", "https://iceic.org/", 2026));
        data.add(new ConferenceRecord("ICEMS", "Nashik, India", "Scopus", "https://icems.org/", 2026));
        data.add(new ConferenceRecord("ICCEIE", "Nashik, India", "Scopus", "https://icceie.org/", 2026));
        data.add(new ConferenceRecord("ICBMSI", "Bhawanipatna, India", "Scopus", "https://icbmsi.org/", 2026));
        data.add(new ConferenceRecord("ICRASET", "Bhawanipatna, India", "Scopus", "https://icraset.org/", 2026));
        data.add(new ConferenceRecord("ICRAETS", "Pune, India", "Scopus", "https://icraets.org/", 2026));
        data.add(new ConferenceRecord("ICARCCC", "Pune, India", "Scopus", "https://icarccc.org/", 2026));
        data.add(new ConferenceRecord("ICBDAIT", "Pune, India", "Scopus", "https://icbdait.org/", 2026));
        data.add(new ConferenceRecord("ICCSIS", "Tokyo, Japan", "Scopus", "https://iccsis.org/", 2026));
        data.add(new ConferenceRecord("ICMLCG", "Tokyo, Japan", "Scopus", "https://icmlcg.org/", 2026));
        data.add(new ConferenceRecord("ICELT", "Tokyo, Japan", "Scopus", "https://icelt.org/", 2026));
        data.add(new ConferenceRecord("ICRCE", "Osaka, Japan", "Scopus", "https://icrce.org/", 2026));
        data.add(new ConferenceRecord("CEES", "Osaka, Japan", "Scopus", "https://cees.org/", 2026));
        // BATCH 19 - NORTH AMERICA
        data.add(new ConferenceRecord("CVPR", "USA/Seattle", "IEEE/CVF", "https://cvpr.thecvf.com/", 2025));
        data.add(new ConferenceRecord("ICML", "Vancouver, Canada", "PMLR/Scopus", "https://icml.cc/", 2025));
        data.add(new ConferenceRecord("NeurIPS", "Montreal/USA", "Scopus", "https://nips.cc/", 2025));
        data.add(new ConferenceRecord("IEEE S&P", "San Francisco, USA", "IEEE", "https://ieee-security.org/", 2026));
        data.add(new ConferenceRecord("ACM SIGGRAPH", "Los Angeles, USA", "ACM", "https://s2026.siggraph.org/", 2026));
        data.add(new ConferenceRecord("DAC", "San Francisco, USA", "ACM/IEEE", "https://www.dac.com/", 2026));
        data.add(new ConferenceRecord("ICSE", "USA/Canada", "IEEE/ACM", "https://conf.researchr.org/home/icse-2026",
                2026));
        data.add(new ConferenceRecord("CHI", "International", "ACM", "https://chi2026.acm.org/", 2026));
        data.add(new ConferenceRecord("INFOCOM", "USA", "IEEE", "https://infocom2025.ieee-infocom.org/", 2025));
        data.add(new ConferenceRecord("ICRA", "International", "IEEE",
                "https://www.ieee-ras.org/conferences-workshops/", 2026));
        data.add(new ConferenceRecord("KDD", "Knowledge Discovery", "ACM", "https://kdd.org/kdd2025/", 2025));
        data.add(new ConferenceRecord("VLDB", "Databases", "Scopus/DBLP", "https://vldb.org/2025/", 2025));
        data.add(new ConferenceRecord("AAAI", "AI Flagship", "Scopus/AAAI", "https://aaai.org/Conferences/AAAI-26/",
                2026));
        data.add(new ConferenceRecord("USENIX Security", "USA", "USENIX", "https://www.usenix.org/", 2025));
        data.add(new ConferenceRecord("MICRO", "Microarchitecture", "IEEE/ACM", "https://microarch.org/", 2025));
        data.add(new ConferenceRecord("SC", "Supercomputing", "ACM/IEEE", "https://sc25.supercomputing.org/", 2025));
        data.add(new ConferenceRecord("WWW", "The Web Conf", "ACM", "https://www2026.thewebconf.org/", 2026));
        data.add(new ConferenceRecord("ICCAD", "International", "ACM/IEEE", "https://iccad.com/", 2025));
        data.add(new ConferenceRecord("RTSS", "Real-Time Systems", "IEEE", "https://2025.rtss.org/", 2025));
        data.add(new ConferenceRecord("ISCA", "Computer Architecture", "ACM/IEEE", "https://iscaconf.org/isca2025/",
                2025));
        // BATCH 20 - EUROPE
        data.add(new ConferenceRecord("ECCV", "Europe", "Springer/Scopus", "https://eccv2026.org/", 2026));
        data.add(new ConferenceRecord("ICLR", "Learning Representations", "Scopus", "https://iclr.cc/", 2025));
        data.add(new ConferenceRecord("EACL", "Computational Linguistics", "ACL/Scopus", "https://2025.eacl.org/",
                2025));
        data.add(new ConferenceRecord("Euro-Par", "Parallel Computing", "Springer/Scopus", "https://europar2025.org/",
                2025));
        data.add(new ConferenceRecord("ESOP", "Programming", "Springer/Scopus", "https://etaps.org/2026/esop", 2026));
        data.add(new ConferenceRecord("CAV", "Verification", "Springer/Scopus", "http://i-cav.org/", 2025));
        data.add(new ConferenceRecord("EDBT", "Database Tech", "Scopus/OpenProceedings", "https://edbticdt2026.org/",
                2026));
        data.add(new ConferenceRecord("PERCOM", "Pervasive Computing", "IEEE", "https://www.percom.org/", 2026));
        data.add(new ConferenceRecord("EuroS&P", "Europe", "IEEE", "https://www.ieee-security.org/TC/EuroSP2026/",
                2026));
        data.add(new ConferenceRecord("IPSN", "Sensor Networks", "IEEE/ACM", "https://ipsn.acm.org/2026/", 2026));
        data.add(new ConferenceRecord("ECOOP", "Object-Oriented", "ACM/Scopus", "https://2025.ecoop.org/", 2025));
        data.add(new ConferenceRecord("ISSTA", "Software Testing", "ACM", "https://conf.researchr.org/home/issta-2026",
                2026));
        data.add(new ConferenceRecord("ASE", "Europe", "IEEE/ACM", "https://ase-conferences.org/", 2025));
        data.add(new ConferenceRecord("ECAI", "European AI", "Scopus", "https://ecai2026.org/", 2026));
        data.add(new ConferenceRecord("ICDM", "Europe Rotations", "IEEE", "https://icdm2025.org/", 2025));
        data.add(new ConferenceRecord("CIKM", "Info & Knowledge", "ACM", "https://www.cikm2025.org/", 2025));
        data.add(new ConferenceRecord("RE", "Europe", "IEEE", "https://re26.org/", 2026));
        data.add(new ConferenceRecord("DATE", "Europe", "IEEE/ACM", "https://www.date-conference.com/", 2026));
        data.add(new ConferenceRecord("ICST", "Software Testing", "IEEE", "https://icst2026.com/", 2026));
        data.add(new ConferenceRecord("PPoPP", "Parallel Programming", "ACM", "https://ppopp26.sigplan.org/", 2026));
        // BATCH 21 - SPECIALIZED MEDICAL & AI
        data.add(new ConferenceRecord("MICCAI", "Medical Image", "Springer/Scopus", "https://miccai2025.org/", 2025));
        data.add(new ConferenceRecord("EMBC", "Bio Engineering", "IEEE EMBS", "https://embc.embs.org/2026/", 2026));
        data.add(new ConferenceRecord("CHASE", "Connected Health", "ACM/IEEE", "https://chase2026.org/", 2026));
        data.add(new ConferenceRecord("BHI", "Health Informatics", "IEEE", "https://bhi.embs.org/2026/", 2026));
        data.add(new ConferenceRecord("ISBI", "Biomedical Imaging", "IEEE", "https://biomedicalimaging.org/2026/",
                2026));
        data.add(new ConferenceRecord("Digital Health", "International", "ACM/Scopus", "https://www.digitalhealth.org/",
                2025));
        data.add(new ConferenceRecord("PervasiveHealth", "International", "ACM", "https://pervasivehealth.org/", 2025));
        data.add(new ConferenceRecord("AISTATS", "AI Stats", "PMLR", "https://aistats.org/", 2026));
        data.add(new ConferenceRecord("WACV", "Computer Vision", "IEEE", "https://wacv2026.thecvf.com/", 2026));
        data.add(new ConferenceRecord("BMVC", "British Machine Vision", "Scopus", "https://bmvc2025.org/", 2025));
        // BATCH 22 - MID-TIER & EMERGING
        data.add(new ConferenceRecord("COCOON", "Combinatorics", "Springer/Scopus", "https://cocoon2026.org/", 2026));
        data.add(new ConferenceRecord("EWSN", "Wireless Sensors", "ACM", "https://ewsn2026.org/", 2026));
        data.add(new ConferenceRecord("MSWiM", "Mobile Systems", "ACM", "https://mswimconf.com/2025/", 2025));
        data.add(new ConferenceRecord("LISA", "Systems Admin", "USENIX", "https://www.usenix.org/lisa26", 2026));
        data.add(new ConferenceRecord("FAST", "Storage Tech", "USENIX", "https://www.usenix.org/fast26", 2026));
        data.add(new ConferenceRecord("SOSP", "Operating Systems", "ACM", "https://sosp2025.org/", 2025));
        data.add(new ConferenceRecord("OSDI", "Operating Systems", "USENIX", "https://www.usenix.org/osdi26", 2026));
        data.add(new ConferenceRecord("MobiCom", "Mobile Computing", "ACM", "https://sigmobile.org/mobicom/2026/",
                2026));
        data.add(new ConferenceRecord("MobiSys", "Mobile Systems", "ACM", "https://sigmobile.org/mobisys/2025/", 2025));
        data.add(new ConferenceRecord("SenSys", "Sensor Systems", "ACM", "https://sensys.acm.org/2025/", 2025));
        // BATCH 23 - CYBERSECURITY & NETWORKING
        data.add(new ConferenceRecord("CCS", "Security", "ACM", "https://www.sigsac.org/ccs/CCS2025/", 2025));
        data.add(new ConferenceRecord("NDSS", "Security", "Internet Society", "https://www.ndss-symposium.org/", 2026));
        data.add(new ConferenceRecord("ESORICS", "Security", "Springer/Scopus", "https://esorics2025.org/", 2025));
        data.add(new ConferenceRecord("RAID", "Attacks & Intrusion", "Scopus", "https://raid2025.org/", 2025));
        data.add(new ConferenceRecord("PETS", "Privacy", "Scopus/Sciendo", "https://petsymposium.org/", 2026));
        data.add(new ConferenceRecord("CSF", "Security Foundations", "IEEE",
                "https://www.ieee-security.org/TC/CSF2026/", 2026));
        data.add(
                new ConferenceRecord("SIGCOMM", "Networking", "ACM", "https://events.sigcomm.org/sigcomm/2025/", 2025));
        data.add(new ConferenceRecord("NSDI", "Networking Systems", "USENIX", "https://www.usenix.org/nsdi26", 2026));
        data.add(new ConferenceRecord("ICNP", "Network Protocols", "IEEE", "https://icnp25.ieee-icnp.org/", 2025));
        data.add(new ConferenceRecord("IMC", "Internet Measurement", "ACM", "https://sigcomm.org/imc2025/", 2025));
        // BATCH 24 - CLOUD, BIG DATA & SYSTEMS
        data.add(new ConferenceRecord("SoCC", "Cloud Computing", "ACM", "https://acmsocc.org/2025/", 2025));
        data.add(new ConferenceRecord("BigData", "Big Data", "IEEE/Scopus", "https://bigdataieee.org/BigData2025/",
                2025));
        data.add(new ConferenceRecord("ICDCS", "Distributed Systems", "IEEE", "https://icdcs2026.org/", 2026));
        data.add(new ConferenceRecord("PODC", "Distributed Computing", "ACM", "https://podc.org/", 2025));
        data.add(new ConferenceRecord("DISC", "Distributed Computing", "Scopus", "http://www.disc-conference.org/",
                2025));
        data.add(new ConferenceRecord("IPDPS", "Parallel/Distributed", "IEEE", "https://www.ipdps.org/", 2026));
        data.add(new ConferenceRecord("HPDC", "High-Performance Distributed", "ACM", "https://www.hpdc.org/2026/",
                2026));
        data.add(new ConferenceRecord("CCGrid", "Cluster/Cloud/Grid", "IEEE/ACM", "https://ccgrid2026.org/", 2026));
        data.add(new ConferenceRecord("ICAC", "Autonomic Computing", "IEEE", "https://icac2025.org/", 2025));
        data.add(
                new ConferenceRecord("ICPE", "Performance Engineering", "ACM/SPEC", "https://icpe2026.acm.org/", 2026));
        // BATCH 25 - NLP, HCI & WEB TECH
        data.add(new ConferenceRecord("ACL", "NLP", "Scopus/ACL", "https://2025.aclweb.org/", 2025));
        data.add(new ConferenceRecord("EMNLP", "NLP", "Scopus", "https://2025.emnlp.org/", 2025));
        data.add(new ConferenceRecord("NAACL", "NLP", "Scopus", "https://2026.naacl.org/", 2026));
        data.add(new ConferenceRecord("SIGIR", "Info Retrieval", "ACM", "https://sigir.org/sigir2025/", 2025));
        data.add(new ConferenceRecord("ECIR", "European Info Retrieval", "Springer/Scopus", "https://ecir2026.org/",
                2026));
        data.add(new ConferenceRecord("CSCW", "Social Computing", "ACM", "https://cscw.acm.org/2026/", 2026));
        data.add(new ConferenceRecord("UbiComp", "Ubiquitous Computing", "ACM", "https://ubicomp.org/ubicomp2025/",
                2025));
        data.add(new ConferenceRecord("UIST", "User Interface Software", "ACM", "https://uist.acm.org/2025/", 2025));
        data.add(new ConferenceRecord("IUI", "Intelligent User Interfaces", "ACM", "https://iui.acm.org/2026/", 2026));
        data.add(new ConferenceRecord("WSDM", "Web Search/Data Mining", "ACM", "https://www.wsdm-conference.org/2026/",
                2026));
        // BATCH 26 - ROBOTICS, AR/VR & GRAPHICS
        data.add(new ConferenceRecord("IROS", "Intelligent Robots", "IEEE/RSJ", "https://iros2025.org/", 2025));
        data.add(new ConferenceRecord("RSS", "Robotics", "Scopus", "https://roboticsconference.org/", 2025));
        data.add(new ConferenceRecord("CASE", "Automation Science", "IEEE", "https://case2026.org/", 2026));
        data.add(new ConferenceRecord("IEEE VR", "Virtual Reality", "IEEE", "https://ieeevr.org/2026/", 2026));
        data.add(new ConferenceRecord("ISMAR", "Mixed/Augmented Reality", "IEEE", "https://ismar2025.org/", 2025));
        data.add(new ConferenceRecord("Eurographics", "Graphics", "Scopus", "https://www.eurographics2026.org/", 2026));
        data.add(new ConferenceRecord("EGSR", "Rendering", "Scopus", "https://egsr2025.org/", 2025));
        data.add(new ConferenceRecord("SGP", "Geometry Processing", "Scopus", "https://geometryprocessing.org/", 2025));
        data.add(new ConferenceRecord("Pacific Graphics", "USA Rotations", "Scopus", "https://pg2025.org/", 2025));
        data.add(new ConferenceRecord("I3D", "3D Graphics", "ACM", "https://i3dsymposium.org/", 2026));
        // BATCH 27 - HARDWARE, ARCHITECTURE & TEST
        data.add(new ConferenceRecord("HPCA", "High Perf Architecture", "IEEE", "https://hpca-conf.org/2026/", 2026));
        data.add(new ConferenceRecord("ASPLOS", "Architecture/OS", "ACM/IEEE", "https://asplos-conference.org/", 2026));
        data.add(new ConferenceRecord("FPGA", "Hardware", "ACM", "https://www.isfpga.org/", 2026));
        data.add(new ConferenceRecord("FPL", "Europe", "IEEE/Scopus", "https://fpl2025.org/", 2025));
        data.add(new ConferenceRecord("FCCM", "Hardware", "IEEE", "https://fccm.org/", 2026));
        data.add(new ConferenceRecord("ITC", "Intl Test Conf", "IEEE", "https://itctestweek.org/", 2025));
        data.add(new ConferenceRecord("VTS", "VLSI Test", "IEEE", "https://tttc-vts.org/", 2026));
        data.add(new ConferenceRecord("ICPP", "Parallel Processing", "ACM/IEEE", "https://icpp-conf.org/", 2025));
        data.add(new ConferenceRecord("ICS", "Supercomputing", "ACM", "https://ics-conference.org/", 2026));
        data.add(new ConferenceRecord("PACT", "Parallel Architecture/Compilation", "IEEE/ACM", "https://pactconf.org/",
                2025));
        // BATCH 28 - THEORY & LOGIC
        data.add(new ConferenceRecord("STOC", "Theory of Computing", "ACM", "https://acm-stoc.org/", 2026));
        data.add(new ConferenceRecord("FOCS", "Foundations of CS", "IEEE", "https://focs.computer.org/", 2025));
        data.add(new ConferenceRecord("SODA", "Discrete Algorithms", "SIAM/ACM",
                "https://www.iam.org/conferences/cm/conference/soda26", 2026));
        data.add(new ConferenceRecord("LICS", "Logic in CS", "IEEE/ACM", "https://lics.siglog.org/", 2026));
        data.add(new ConferenceRecord("ICALP", "Europe", "Scopus/LIPIcs", "https://eatcs.org/icalp2026/", 2026));
        data.add(new ConferenceRecord("CCC", "Complexity", "Scopus", "http://computationalcomplexity.org/", 2025));
        data.add(new ConferenceRecord("PODS", "Database Systems Theory", "ACM", "https://databasetheory.org/pods2026",
                2026));
        data.add(new ConferenceRecord("TCC", "Cryptography", "Springer/Scopus", "https://tcc.iacr.org/", 2025));
        data.add(new ConferenceRecord("CRYPTO", "USA", "Springer/Scopus", "https://crypto.iacr.org/2025/", 2025));
        data.add(new ConferenceRecord("EUROCRYPT", "Europe", "Springer/Scopus", "https://eurocrypt.iacr.org/2026/",
                2026));
        return data;
    }
}
