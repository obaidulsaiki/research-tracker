package com.example.backend.service;

import com.example.backend.dto.JournalMetadataDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.backend.repository.JournalMetadataRepo;
import com.example.backend.entity.JournalMetadata;
import java.util.Optional;

@Service
public class JournalService {

        private final JournalMetadataRepo journalRepo;

        @Autowired
        public JournalService(JournalMetadataRepo journalRepo) {
                this.journalRepo = journalRepo;
                // Seed database with highly vetted values if empty or needed
                seedDatabase();
        }

        private void seedDatabase() {
                // CURATED JOURNAL DATABASE - Seeds the Persistent Cache with High-Priority
                // BATCH 1 - TOP TIER GENERAL CS & SYSTEMS
                addJournal("IEEE Communications Surveys & Tutorials", "IEEE Xplore", "34.40", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=9739");
                addJournal("ACM Computing Surveys", "ACM DL", "23.80", "Q1", "https://dl.acm.org/journal/csur");
                addJournal("Nature Machine Intelligence", "Nature", "18.80", "Q1",
                                "https://www.nature.com/natmachintell/");
                addJournal("IEEE Transactions on Pattern Analysis and Machine Intelligence", "IEEE", "18.90", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=34");
                addJournal("Information Fusion", "Elsevier", "14.70", "Q1",
                                "https://www.sciencedirect.com/journal/information-fusion");
                addJournal("Science Robotics", "AAAS", "22.80", "Q1", "https://www.science.org/journal/scirobotics");
                addJournal("Computer Science Review", "Elsevier", "12.70", "Q1",
                                "https://www.sciencedirect.com/journal/computer-science-review");
                addJournal("Communications of the ACM", "ACM", "11.10", "Q1", "https://cacm.acm.org/");
                addJournal("Medical Image Analysis", "Elsevier", "10.70", "Q1",
                                "https://www.sciencedirect.com/journal/medical-image-analysis");
                addJournal("IEEE Internet of Things Journal", "IEEE", "8.20", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6488907");
                addJournal("Expert Systems with Applications", "Elsevier", "7.50", "Q1",
                                "https://www.sciencedirect.com/journal/expert-systems-with-applications");
                addJournal("IEEE Transactions on Software Engineering", "IEEE CS", "7.40", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=32");
                addJournal("Journal of Big Data", "Springer", "10.80", "Q1",
                                "https://journalofbigdata.springeropen.com/");
                addJournal("Future Gen. Computer Systems", "Elsevier", "6.20", "Q1",
                                "https://www.sciencedirect.com/journal/future-generation-computer-systems");
                addJournal("Applied Soft Computing", "Elsevier", "7.20", "Q1",
                                "https://www.sciencedirect.com/journal/applied-soft-computing");
                addJournal("Knowledge-Based Systems", "Elsevier", "7.20", "Q1",
                                "https://www.sciencedirect.com/journal/knowledge-based-systems");
                addJournal("IEEE Transactions on Multimedia", "IEEE", "6.30", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6046");
                addJournal("Bioinformatics", "Oxford", "4.40", "Q1", "https://academic.oup.com/bioinformatics");
                addJournal("IEEE Access", "IEEE", "3.40", "Q2",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6287639");
                addJournal("Scientific Reports", "Nature Portfolio", "3.80", "Q1", "https://www.nature.com/srep/");
                addJournal("Journal of Systems and Software", "Elsevier", "3.50", "Q1",
                                "https://www.sciencedirect.com/journal/journal-of-systems-and-software");
                addJournal("Computing (Springer)", "Springer", "2.40", "Q2", "https://link.springer.com/journal/607");
                addJournal("SN Computer Science", "Springer Nature", "2.20", "Q2",
                                "https://www.springer.com/journal/42979");
                addJournal("Discover Computing", "Springer Nature", "2.10", "Q2",
                                "https://www.springer.com/journal/44196");
                addJournal("PeerJ Computer Science", "PeerJ", "2.40", "Q2", "https://peerj.com/computer-science/");
                addJournal("Journal of Neuroscience Methods", "Elsevier", "2.30", "Q3",
                                "https://www.sciencedirect.com/journal/journal-of-neuroscience-methods");
                addJournal("Data In Brief", "Elsevier", "1.20", "Q3",
                                "https://www.sciencedirect.com/journal/data-in-brief");
                addJournal("Biomedical Materials & Devices", "Springer Nature", "3.20", "Q2",
                                "https://link.springer.com/journal/44227");
                addJournal("Heliyon", "Cell Press", "3.40", "Q1", "https://www.cell.com/heliyon/home");
                addJournal("Information Systems Frontiers", "Springer Nature", "5.20", "Q1",
                                "https://link.springer.com/journal/13278");
                addJournal("Journal of Computer Science", "Science Pubs", "1.00", "Q4", "https://thescipub.com/jcs");
                addJournal("Open Cell Signaling", "PeerJ", "1.00", "Q4", "https://peerj.com/journals/cell-signaling/");

                // BATCH 2 - ADVANCED COMPUTING & SPECIALIZED AI
                addJournal("Journal of the ACM (JACM)", "ACM Digital Library", "3.50", "Q1",
                                "https://dl.acm.org/journal/jacm");
                addJournal("IEEE Transactions on Computers", "IEEE Xplore", "3.70", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=12");
                addJournal("AI Open", "Elsevier", "10.50", "Q1", "https://www.sciencedirect.com/journal/ai-open");
                addJournal("IEEE Transactions on Cybernetics", "IEEE", "9.40", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6221036");
                addJournal("Journal of Machine Learning Research", "JMLR.org", "6.20", "Q1", "https://www.jmlr.org/");
                addJournal("ACM Transactions on Software Engineering and Methodology", "ACM", "5.20", "Q1",
                                "https://dl.acm.org/journal/tosem");
                addJournal("IEEE Transactions on Industrial Informatics", "IEEE", "10.10", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=9424");
                addJournal("Computer Communications", "Elsevier", "5.70", "Q1",
                                "https://www.sciencedirect.com/journal/computer-communications");
                addJournal("Journal of Network and Computer Applications", "Elsevier", "8.70", "Q1",
                                "https://www.sciencedirect.com/journal/journal-of-network-and-computer-applications");
                addJournal("Robotics and Computer-Integrated Manufacturing", "Elsevier", "10.40", "Q1",
                                "https://www.sciencedirect.com/journal/robotics-and-computer-integrated-manufacturing");
                addJournal("IEEE Transactions on Mobile Computing", "IEEE", "7.70", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7755");
                addJournal("Computers & Education", "Elsevier", "10.30", "Q1",
                                "https://www.sciencedirect.com/journal/computers-and-education");
                addJournal("IEEE Transactions on Affective Computing", "IEEE", "9.60", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=5165369");
                addJournal("ACM Transactions on Information Systems", "ACM", "5.40", "Q1",
                                "https://dl.acm.org/journal/tois");
                addJournal("Swarm and Evolutionary Computation", "Elsevier", "8.20", "Q1",
                                "https://www.sciencedirect.com/journal/swarm-and-evolutionary-computation");
                addJournal("Government Information Quarterly", "Elsevier", "10.00", "Q1",
                                "https://www.sciencedirect.com/journal/government-information-quarterly");
                addJournal("IEEE Transactions on Services Computing", "IEEE", "5.50", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=4629386");
                addJournal("Big Data and Cognitive Computing", "MDPI", "4.20", "Q2",
                                "https://www.mdpi.com/journal/bdcc");
                addJournal("Software: Practice and Experience", "Wiley", "2.10", "Q2",
                                "https://onlinelibrary.wiley.com/journal/1097024x");
                addJournal("Empirical Software Engineering", "Springer", "3.20", "Q1",
                                "https://link.springer.com/journal/10664");
                addJournal("Theoretical Computer Science", "Elsevier", "1.00", "Q3",
                                "https://www.sciencedirect.com/journal/theoretical-computer-science");
                addJournal("SIAM Journal on Computing", "SIAM", "2.10", "Q2", "https://www.siam.org/journals/sicomp");
                addJournal("Computer Graphics Forum", "Wiley", "2.50", "Q2",
                                "https://onlinelibrary.wiley.com/journal/14678659");
                addJournal("Multimedia Tools and Applications", "Springer", "3.00", "Q2",
                                "https://link.springer.com/journal/11042");
                addJournal("Journal of Cloud Computing", "Springer", "4.61", "Q2",
                                "https://journalofcloudcomputing.springeropen.com/");
                addJournal("Computing in Science and Engineering", "IEEE", "1.80", "Q3",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=5992");
                addJournal("Journal of Parallel and Distributed Computing", "Elsevier", "3.40", "Q2",
                                "https://www.sciencedirect.com/journal/journal-of-parallel-and-distributed-computing");
                addJournal("International Journal of Control", "Taylor and Francis", "1.60", "Q3",
                                "https://www.tandfonline.com/journals/tcon20");
                addJournal("Theory of Computing Systems", "Springer", "1.10", "Q4",
                                "https://link.springer.com/journal/224");

                // BATCH 3 - LINGUISTICS & SPEECH
                addJournal("Transactions of the Association for Computational Linguistics", "MIT Press", "6.90", "Q1",
                                "https://transacl.org/");
                addJournal("Computational Linguistics", "MIT Press", "5.30", "Q1", "https://direct.mit.edu/coli");
                addJournal("IEEE/ACM Transactions on Audio, Speech, and Language Processing", "IEEE Xplore", "5.10",
                                "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6570655");
                addJournal("Computer Speech & Language", "Elsevier", "4.30", "Q1",
                                "https://www.sciencedirect.com/journal/computer-speech-and-language");
                addJournal("ACM Transactions on Asian and Low-Resource Language Information Processing",
                                "ACM Digital Library", "2.10", "Q2",
                                "https://dl.acm.org/journal/tallip");
                addJournal("Speech Communication", "Elsevier", "3.20", "Q2",
                                "https://www.sciencedirect.com/journal/speech-communication");
                addJournal("Language Resources and Evaluation", "Springer", "2.10", "Q2",
                                "https://link.springer.com/journal/10579");
                addJournal("Machine Translation", "Springer", "2.40", "Q2", "https://link.springer.com/journal/10590");
                addJournal("Journal of Quantitative Linguistics", "Taylor and Francis Online", "1.30", "Q2",
                                "https://www.tandfonline.com/journals/njql20");

                // BATCH 4 - NLP & APPLIED ARTIFICIAL INTELLIGENCE
                addJournal("Natural Language Processing Journal", "Elsevier", "7.10", "Q1",
                                "https://www.sciencedirect.com/journal/natural-language-processing-journal");
                addJournal("Information Sciences", "Elsevier", "8.10", "Q1",
                                "https://www.sciencedirect.com/journal/information-sciences");
                addJournal("ACM Transactions on Intelligent Systems and Technology", "ACM Digital Library", "5.40",
                                "Q1",
                                "https://dl.acm.org/journal/tissp");
                addJournal("IEEE Intelligent Systems", "IEEE Xplore", "5.60", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=9670");
                addJournal("Journal of Artificial Intelligence Res.", "AI Access", "4.50", "Q1", "https://jair.org/");
                addJournal("Language, Speech, and Hearing Services", "ASHA", "2.90", "Q1",
                                "https://pubs.asha.org/journal/lshss");
                addJournal("International Journal of Speech-Language Pathology", "Taylor and Francis", "1.90", "Q1",
                                "https://www.tandfonline.com/journals/yjsl20");
                addJournal("Language and Speech", "SAGE", "1.10", "Q2", "https://journals.sagepub.com/home/las");
                addJournal("Journal of Memory and Language", "Elsevier", "3.00", "Q1",
                                "https://www.sciencedirect.com/journal/journal-of-memory-and-language");
                addJournal("Computer Assisted Language Learning", "Taylor & Francis", "6.60", "Q1",
                                "https://www.tandfonline.com/journals/ncal20");
                addJournal("ReCALL", "Cambridge University Press", "5.70", "Q1",
                                "https://www.cambridge.org/core/journals/recall");
                addJournal("System", "Elsevier", "5.60", "Q1", "https://www.sciencedirect.com/journal/system");
                addJournal("Language Teaching", "Cambridge University Press", "5.10", "Q1",
                                "https://www.cambridge.org/core/journals/language-teaching");
                addJournal("Applied Linguistics", "Oxford Academic", "4.20", "Q1", "https://academic.oup.com/applij");
                addJournal("Journal of Second Language Writing", "Elsevier", "4.50", "Q1",
                                "https://www.sciencedirect.com/journal/journal-of-second-language-writing");
                addJournal("International Journal of Lexicography", "Oxford Academic", "1.30", "Q2",
                                "https://academic.oup.com/ijl");
                addJournal("Linguistic Inquiry", "MIT Press", "1.60", "Q2", "https://direct.mit.edu/ling");
                addJournal("Journal of Pragmatics", "Elsevier", "1.70", "Q2",
                                "https://www.sciencedirect.com/journal/journal-of-pragmatics");
                addJournal("Corpus Linguistics and Linguistic Theory", "De Gruyter", "1.70", "Q2",
                                "https://www.degruyter.com/journal/key/cllt/html");

                // BATCH 5 - AI IN MEDICINE & HEALTH
                addJournal("The Lancet Digital Health", "Elsevier", "24.10", "Q1",
                                "https://www.thelancet.com/journals/landig/home");
                addJournal("npj Digital Medicine", "Nature", "15.30", "Q1", "https://www.nature.com/npjdigitalmed/");
                addJournal("Artificial Intelligence in Medicine", "Elsevier", "10.40", "Q1",
                                "https://www.sciencedirect.com/journal/artificial-intelligence-in-medicine");
                addJournal("IEEE Transactions on Medical Imaging", "IEEE Xplore", "11.30", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=42");
                addJournal("JAMA Network Open (AI Focus)", "AMA", "13.80", "Q1",
                                "https://jamanetwork.com/journals/jamanetworkopen");
                addJournal("Journal of Medical Internet Research", "JMIR Publications", "7.10", "Q1",
                                "https://www.jmir.org/");
                addJournal("Journal of the American Medical Informatics Association", "Oxford", "7.10", "Q1",
                                "https://academic.oup.com/jamia");
                addJournal("IEEE Journal of Biomedical & Health", "IEEE", "7.70", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=6221020");
                addJournal("Frontiers in Artificial Intelligence", "Frontiers", "4.70", "Q1",
                                "https://www.frontiersin.org/journals/artificial-intelligence");
                addJournal("JMIR AI (New Flagship)", "JMIR Pubs", "2.00", "Q2", "https://ai.jmir.org/");
                addJournal("Patterns (Cell Press)", "Cell Press", "6.50", "Q1", "https://www.cell.com/patterns/home");
                addJournal("Intelligence-Based Medicine", "Elsevier", "4.20", "Q2",
                                "https://www.sciencedirect.com/journal/intelligence-based-medicine");
                addJournal("International Journal of Medical Informatics", "Elsevier", "3.70", "Q2",
                                "https://www.sciencedirect.com/journal/international-journal-of-medical-informatics");
                addJournal("Frontiers in Digital Health", "Frontiers", "3.80", "Q1",
                                "https://www.frontiersin.org/journals/digital-health");
                addJournal("Smart Health", "Elsevier", "4.10", "Q2",
                                "https://www.sciencedirect.com/journal/smart-health");
                addJournal("Computers in Biology and Medicine", "Elsevier", "7.70", "Q1",
                                "https://www.sciencedirect.com/journal/computers-in-biology-and-medicine");
                addJournal("Computer Methods and Programs in Biomedicine", "Elsevier", "5.10", "Q1",
                                "https://www.sciencedirect.com/journal/computer-methods-and-programs-in-biomedicine");
                addJournal("Lancet Neurology (AI/Tech)", "Elsevier", "45.50", "Q1",
                                "https://www.thelancet.com/journals/laneur/home");
                addJournal("Radiology: Artificial Intelligence", "RSNA", "10.20", "Q1",
                                "https://pubs.rsna.org/journal/radiologyai");
                addJournal("JACC: Advances (AI in Cardiology)", "Elsevier", "6.80", "Q1",
                                "https://www.jacc.org/journal/advances");
                addJournal("Digital Health", "SAGE", "3.90", "Q2", "https://journals.sagepub.com/home/dhj");
                addJournal("Pathology Informatics", "Elsevier", "3.10", "Q2", "https://www.jpathinformatics.org/");
                addJournal("Deep Learning in Medical Physics", "Wiley", "4.50", "Q2",
                                "https://onlinelibrary.wiley.com/journal/26927071");
                addJournal("AI in Precision Oncology", "Liebert", "5.30", "Q1",
                                "https://www.liebertpub.com/loi/aipo");
                addJournal("Cardiovascular Digital Health Journal", "Elsevier", "2.80", "Q2",
                                "https://www.cvdhj.org/");
                addJournal("BMC Medical Informatics and Decision Making", "BioMed Central", "3.50", "Q2",
                                "https://bmcmedinformdecismak.biomedcentral.com/");
                addJournal("Diagnostic and Interventional Imaging", "Elsevier", "3.90", "Q2",
                                "https://www.sciencedirect.com/journal/diagnostic-and-interventional-imaging");
                addJournal("Computational & Structural Biotech", "Elsevier", "6.10", "Q1",
                                "https://www.sciencedirect.com/journal/computational-and-structural-biotechnology-journal");
                addJournal("IEEE Transactions on NanoBioscience", "IEEE", "3.90", "Q2",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7728");
                addJournal("PLOS Digital Health", "PLOS", "3.20", "Q2", "https://journals.plos.org/digitalhealth/");
                addJournal("Health Informatics Journal", "SAGE", "2.80", "Q2", "https://journals.sagepub.com/home/jhi");
                addJournal("Computers, Materials and Continua", "Tech Science Press", "3.10", "Q2",
                                "https://www.techscience.com/journal/cmc");
                addJournal("Journal of Biomedical Informatics", "Elsevier", "4.50", "Q1",
                                "https://www.sciencedirect.com/journal/journal-of-biomedical-informatics");
                addJournal("Applied Sciences (Section: Med AI)", "MDPI", "2.70", "Q2",
                                "https://www.mdpi.com/journal/applsci");
                addJournal("Diagnostics (Medical AI section)", "MDPI", "3.60", "Q2",
                                "https://www.mdpi.com/journal/diagnostics");
                addJournal("Healthcare (MDPI)", "MDPI", "2.80", "Q2", "https://www.mdpi.com/journal/healthcare");
                addJournal("Journal of Imaging", "MDPI", "2.10", "Q3", "https://www.mdpi.com/journal/jimaging");

                // BATCH 6 - CYBERSECURITY, ROBOTICS, HCI & ENGINEERING
                addJournal("IEEE Transactions on Information Forensics and Security", "IEEE", "6.80", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=10206");
                addJournal("Journal of Cybersecurity", "Oxford", "3.50", "Q1",
                                "https://academic.oup.com/cybersecurity");
                addJournal("IEEE Security & Privacy", "IEEE", "3.20", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8013");
                addJournal("ACM Transactions on Privacy and Security", "ACM", "3.00", "Q1",
                                "https://dl.acm.org/journal/tops");
                addJournal("Computers & Security", "Elsevier", "4.80", "Q1",
                                "https://www.sciencedirect.com/journal/computers-and-security");
                addJournal("IEEE Transactions on Dependable and Secure Computing", "IEEE", "7.30", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8858");
                addJournal("IET Information Security", "Wiley/IET", "1.80", "Q2",
                                "https://ietresearch.onlinelibrary.wiley.com/journal/17518717");
                addJournal("Journal of Cryptology", "Springer", "1.60", "Q2", "https://link.springer.com/journal/145");
                addJournal("International Journal of Information Security", "Springer", "2.50", "Q1",
                                "https://link.springer.com/journal/10207");
                addJournal("Ad Hoc Networks", "Elsevier", "4.80", "Q1",
                                "https://www.sciencedirect.com/journal/ad-hoc-networks");
                addJournal("Soft Robotics", "Liebert", "6.40", "Q1",
                                "https://www.liebertpub.com/loi/soro");
                addJournal("IEEE Transactions on Robotics", "IEEE", "10.50", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=8860");
                addJournal("The International Journal of Robotics Research", "SAGE", "7.50", "Q1",
                                "https://journals.sagepub.com/home/ijr");
                addJournal("IEEE Robotics and Automation Letters", "IEEE", "5.20", "Q1",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=7083534");
                addJournal("Journal of Field Robotics", "Wiley", "5.60", "Q1",
                                "https://onlinelibrary.wiley.com/journal/15564967");
                addJournal("Autonomous Robots", "Springer", "3.90", "Q2", "https://link.springer.com/journal/10514");
                addJournal("Bioinspiration & Biomimetics", "IOP", "3.10", "Q2",
                                "https://iopscience.iop.org/journal/1748-3190");
                addJournal("IEEE Transactions on Haptics", "IEEE", "2.50", "Q2",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=4543165");
                addJournal("Intelligent Service Robotics", "Springer", "2.40", "Q2",
                                "https://link.springer.com/journal/11370");
                addJournal("Int. Journal of Human-Computer Studies", "Elsevier", "5.30", "Q1",
                                "https://www.sciencedirect.com/journal/international-journal-of-human-computer-studies");
                addJournal("ACM Transactions on Computer-Human Interaction", "ACM", "4.80", "Q1",
                                "https://dl.acm.org/journal/tochi");
                addJournal("Human-Computer Interaction (Journal)", "T&F", "6.50", "Q1",
                                "https://www.tandfonline.com/journals/hhci20");
                addJournal("Interacting with Computers", "Oxford", "1.40", "Q3", "https://academic.oup.com/iwc");
                addJournal("Behaviour & Information Technology", "T&F", "3.70", "Q2",
                                "https://www.tandfonline.com/journals/tbit20");
                addJournal("Journal of Multimodal User Interfaces", "Springer", "2.20", "Q2",
                                "https://link.springer.com/journal/12193");
                addJournal("Virtual Reality (Springer)", "Springer", "4.20", "Q1",
                                "https://link.springer.com/journal/10055");
                addJournal("Universal Access in the Information Society", "Springer", "2.40", "Q2",
                                "https://link.springer.com/journal/10209");
                addJournal("User Modeling and User-Adapted Interaction", "Springer", "4.50", "Q1",
                                "https://link.springer.com/journal/11257");
                addJournal("Engineering (Elsevier)", "Elsevier", "11.60", "Q1",
                                "https://www.sciencedirect.com/journal/engineering");
                addJournal("Advanced Engineering Informatics", "Elsevier", "9.90", "Q1",
                                "https://www.sciencedirect.com/journal/advanced-engineering-informatics");
                addJournal("Automation in Construction", "Elsevier", "11.50", "Q1",
                                "https://www.sciencedirect.com/journal/automation-in-construction");
                addJournal("Journal of Strategic Information Systems", "Elsevier", "11.80", "Q1",
                                "https://www.sciencedirect.com/journal/journal-of-strategic-information-systems");
                addJournal("Sustainable Cities and Society", "Elsevier", "11.70", "Q1",
                                "https://www.sciencedirect.com/journal/sustainable-cities-and-society");
                addJournal("Computer-Aided Civil and Infrastructure Engineering", "Wiley", "9.10", "Q1",
                                "https://onlinelibrary.wiley.com/journal/14678667");
                addJournal("IEEE Systems Journal", "IEEE", "4.00", "Q2",
                                "https://ieeexplore.ieee.org/xpl/RecentIssue.jsp?punumber=4267003");
                addJournal("Reliability Engineering and System Safety", "Elsevier", "8.10", "Q1",
                                "https://www.sciencedirect.com/journal/reliability-engineering-and-system-safety");
                addJournal("Technovation", "Elsevier", "10.90", "Q1",
                                "https://www.sciencedirect.com/journal/technovation");
                addJournal("Journal of Engineering Education", "Wiley", "3.50", "Q1",
                                "https://onlinelibrary.wiley.com/journal/21689830");

                // Regional / Conference Publishers fallback
                addJournal("ICCIT", "IEEE Xplore", "0.00", "CONFERENCE",
                                "https://ieeexplore.ieee.org/xpl/conhome/1000346/all-proceedings");
                addJournal("ICECTE", "IEEE Xplore", "0.00", "CONFERENCE",
                                "https://ieeexplore.ieee.org/xpl/conhome/1000346/all-proceedings");
                addJournal("ICEFRONT", "IEEE Xplore", "0.00", "CONFERENCE",
                                "https://ieeexplore.ieee.org/xpl/conhome/1000346/all-proceedings");
                addJournal("PECCII", "IEEE", "0.00", "CONFERENCE",
                                "https://ieeexplore.ieee.org/");
                addJournal("QPAIN", "IEEE", "0.00", "CONFERENCE",
                                "https://qpain.org/");
        }

        private void addJournal(String name, String publisher, String ifFactor, String quartile, String url) {
                // Default to 2024 for initial seed data (Assuming current/last complete year)
                addJournal(name, publisher, ifFactor, quartile, url, 2024, true);
        }

        private void addJournal(String name, String publisher, String ifFactor, String quartile, String url, int year,
                        boolean force) {
                // Try to find specific year entry first
                Optional<JournalMetadata> existing = journalRepo.findByNameAndYear(name, year);

                if (!existing.isPresent()) {
                        journalRepo.save(JournalMetadata.builder()
                                        .name(name)
                                        .publisher(publisher)
                                        .impactFactor(ifFactor)
                                        .quartile(quartile)
                                        .url(url)
                                        .year(year)
                                        .lastUpdated(java.time.LocalDateTime.now())
                                        .build());
                } else if (force) {
                        JournalMetadata m = existing.get();
                        // Update if the values changed
                        m.setPublisher(publisher);
                        m.setImpactFactor(ifFactor);
                        m.setQuartile(quartile);
                        m.setUrl(url);
                        m.setLastUpdated(java.time.LocalDateTime.now());
                        journalRepo.save(m);
                }
        }

        public Optional<JournalMetadataDTO> lookup(String name) {
                if (name == null || name.isBlank())
                        return Optional.empty();

                String search = name.trim();
                System.out.println("JOURNAL LOOKUP: Request for '" + search + "' (Local DB Only)");

                // Check Database (Curated Seed Data) - Get LATEST year
                Optional<JournalMetadata> cached = journalRepo.findTopByNameOrderByYearDesc(search);
                if (cached.isPresent()) {
                        JournalMetadata m = cached.get();
                        System.out.println("JOURNAL LOOKUP: Found in database: " + m.getName() + " (IF: "
                                        + m.getImpactFactor() + ")");
                        return Optional.of(JournalMetadataDTO.builder()
                                        .name(m.getName())
                                        .publisher(m.getPublisher())
                                        .impactFactor(m.getImpactFactor())
                                        .quartile(m.getQuartile())
                                        .url(m.getUrl())
                                        .build());
                }

                System.out.println("JOURNAL LOOKUP: No local match found for '" + search + "'");
                return Optional.empty();
        }

}
