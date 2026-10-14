// ==========================================================================
// OPERATION PANCHNAMA: CASE BRIEFING & FORENSIC EVIDENCE DATABASE
// Directorate of Enforcement (RPZO / PJZO) - Section 17 PMLA Search Simulation
// ==========================================================================

export const CASE_METADATA = {
    ecir: "ECIR/RPZO/09/2026",
    authorizationNo: "SW/PMLA/RPZO/2026/104",
    dateOfSearch: "14 October 2026 | 06:15 HRS IST",
    targetPremises: "Villa No. 7, 'Sovereign Palms', VIP Road, Raipur (C.G.)",
    suspectName: "Vikramaditya Singhania (Managing Director, Mahadev Infra-Mineral & FinTech Pvt. Ltd.)",
    predicateOffense: "FIR No. 112/2026, EOW/ACB Raipur u/s 120-B, 420, 467, 468, 471 IPC & Sec 7, 13(2) PC Act, 1988",
    estimatedPoC: 540.00, // in Crores
    panchWitnesses: [
        "1. Shri R.K. Verma (Chief Manager, State Bank of India, Main Branch, Raipur)",
        "2. Smt. Sunita Nair (Executive Engineer, CPWD, Raipur Division)"
    ]
};

export const CAMERA_ZONES = {
    overview: {
        name: "Tactical Overview",
        pos: { x: 0, y: 5.2, z: 7.4 },
        target: { x: 0, y: 1.1, z: -1.5 }
    },
    desk: {
        name: "Executive Desk",
        pos: { x: 0.2, y: 2.3, z: -0.6 },
        target: { x: 0, y: 1.05, z: -3.2 }
    },
    vault: {
        name: "North Wall & Safe",
        pos: { x: 2.8, y: 2.2, z: -1.8 },
        target: { x: 3.1, y: 1.8, z: -5.4 }
    },
    lounge: {
        name: "West Credenza",
        pos: { x: -2.4, y: 2.1, z: 0.4 },
        target: { x: -5.2, y: 1.1, z: -0.8 }
    },
    server: {
        name: "East Server Alcove",
        pos: { x: 2.4, y: 2.1, z: 0.8 },
        target: { x: 5.2, y: 1.3, z: -0.2 }
    }
};

export const EVIDENCE_ITEMS = [
    {
        id: "ev_laptop",
        code: "RUD-01",
        title: "Unlocked Apple MacBook Pro M3 Max (Tally & Telegram Web Active)",
        category: "Digital Forensics / Sec 63 BSA",
        zone: "desk",
        pocValueCr: 68.50,
        requiresConcealedDiscovery: false,
        shortHint: "Active Encrypted Session + Parallel Tally Server",
        description: `Upon approaching the mahogany executive desk, you find the suspect's primary MacBook Pro awake and unlocked. An active Telegram Web session titled "Dubai-Raipur Hawala Settlement Desk" is running with a 5-minute auto-delete timer enabled. Simultaneously, a local encrypted container ('VERACRYPT_VOL_09.hc') is mounted, running Tally Prime with 14 shell company books.`,
        forensicReadout: `OS: macOS 15.2 | RAM State: VOLATILE KEYS PRESENT IN MEMORY
Active Process: VeraCrypt Mounted Volume (/Volumes/BLACK_LEDGER)
Network: Active WebSocket to 185.220.101.44 (Disappearing Chat Active)
Risk: Closing lid or powering down will purge RAM encryption keys!`,
        decisions: [
            {
                id: "A",
                label: "Immediately enable Faraday/Network Isolation, capture live RAM dump + active screen photos witnessed by Panchas, image mounted logical volume via Write-Blocker, and generate SHA-256 hash in Panchnama + Sec 63 BSA Certificate.",
                isOptimal: true,
                legalityDelta: +12,
                pocSecuredCr: 68.50,
                ruling: "EXEMPLARY FORENSIC PROTOCOL (Sec 17(1)(f) PMLA r/w Sec 63 Bharatiya Sakshya Adhiniyam, 2023). Capturing volatile RAM before shutdown preserved the VeraCrypt master key and prevented remote Telegram wipe. Hash values recorded in the Panchnama make the digital clone unimpeachable before the Special PMLA Court."
            },
            {
                id: "B",
                label: "Shut down the MacBook immediately to stop any network data tampering, seal it in a tamper-evident bag, and send it to CFSL for lab extraction next week.",
                isOptimal: false,
                legalityDelta: -15,
                pocSecuredCr: 12.00,
                ruling: "CRITICAL FORENSIC ERROR! Powering down purged the volatile RAM containing the VeraCrypt mount keys. Because FileVault + VeraCrypt 256-bit AES were enabled, the hidden volume is now cryptographically inaccessible. Only ₹12 Cr of cached surface emails could be recovered."
            },
            {
                id: "C",
                label: "Browse through all folders manually on the live connected laptop and email the Tally backup files to your official ED email ID for quick analysis.",
                isOptimal: false,
                legalityDelta: -25,
                pocSecuredCr: 0.00,
                ruling: "FATAL ADMISSIBILITY DEFECT! Modifying file access timestamps on a live unisolated device without a Write-Blocker or SHA-256 hash chain destroys electronic record integrity under Sec 63 BSA. Furthermore, the remote syndicate operator detected your activity and remotely wiped the Telegram session."
            }
        ]
    },
    {
        id: "ev_painting",
        code: "RUD-02",
        title: "Biometric Wall Safe Concealed Behind 'Bastar Tribal Bronze' Canvas",
        category: "Concealed Vault / Sec 17(1)(c) PMLA",
        zone: "vault",
        pocValueCr: 112.00,
        requiresConcealedDiscovery: true,
        shortHint: "Suspicious Wall Frame & UV Fingerprint Residue",
        description: `Using forensic inspection (or UV trace scanning), you noticed heavy brass hinges and fresh smudge marks along the right edge of the large oil painting on the North Wall. Swinging the canvas open reveals a recessed Godrej Matrix Biometric + Dual-Key Safe. Suspect Vikramaditya claims he "forgot the combination and lost the key 2 years ago."`,
        forensicReadout: `SAFE MODEL: Godrej Matrix High-Security Class-II
UV Scan: Fresh latent sebaceous fingerprints on keypad digits [1, 4, 7, 9] (less than 12 hrs old)
Keyhole: Matches brass key recovered from desk pen-holder`,
        decisions: [
            {
                id: "A",
                label: "Confront the suspect with the UV latent print scan & desk key in presence of both Panchas, demand opening under Sec 17(1)(d), and warn that upon refusal you are empowered under Sec 17(1)(c) to break open the lock under video recording.",
                isOptimal: true,
                legalityDelta: +12,
                pocSecuredCr: 112.00,
                ruling: "TEXTBOOK STATUTORY COMPLIANCE (Sec 17(1)(c) & (d) PMLA). Confronted with the statutory warning and Panch witnesses, the suspect unlocked the safe. Inside: ₹4.20 Cr in unaccounted ₹500 bundles, 8.5 kg of 24K Swiss Gold Bullion (Valcambi bars), and ₹98 Cr of Dubai Marina property allotment deeds!"
            },
            {
                id: "B",
                label: "Immediately smash the biometric lock with a crowbar without asking the suspect or calling the Panchas into the study room, to save time.",
                isOptimal: false,
                legalityDelta: -20,
                pocSecuredCr: 55.00,
                ruling: "PROCEDURAL VIOLATION! Section 17(1)(c) authorizes breaking open a safe ONLY 'where the keys thereof are not available' or after refusal to open on demand. Failing to keep Panchas present during the opening allows defense counsel to allege planting of bullion during trial."
            },
            {
                id: "C",
                label: "Leave the safe unopened and merely paste a paper 'Prohibitory Order' sticker on the painting, planning to return next month.",
                isOptimal: false,
                legalityDelta: -15,
                pocSecuredCr: 0.00,
                ruling: "GRAVE OPERATIONAL LAPSE! A paper seal on an unverified wall safe without inventorying or securing the contents under Sec 17(1A) invites nocturnal tampering through the rear wall cavity."
            }
        ]
    },
    {
        id: "ev_ledger",
        code: "RUD-03",
        title: "Hollowed Law Lexicon Containing 'Kachha' Hawala & Angadia Diary",
        category: "Incriminating Documents / Sec 22 PMLA",
        zone: "lounge",
        pocValueCr: 84.00,
        requiresConcealedDiscovery: false,
        shortHint: "Handwritten Coded Cash Ledger + Torn ₹10 Token Notes",
        description: `Inside the West Mahogany Credenza, a thick leather-bound volume titled 'Corporate Tax Compendium' is hollowed out. Inside lies a maroon spiral notebook written in Vikramaditya's handwriting, containing coded entries ("Kaki = Raipur Coal Syndicate", "Bhaijaan = Dubai USDT Desk") alongside 18 half-torn ₹10 currency notes with serial numbers matching WhatsApp delivery receipts.`,
        forensicReadout: `DOCUMENT TYPE: Handwritten 'Kachha' Ledger (Pages 1 to 94)
Corroboration: Serial No. 44B-892104 on torn ₹10 note matches Angadia token photo on suspect's phone
Total Quantified Unaccounted Cash Routed: ₹84.00 Crore`,
        decisions: [
            {
                id: "A",
                label: "Have both Panchas and the suspect sign every written page of the diary, seize the torn token notes, invoke the statutory presumption of truth & handwriting under Section 22(1) PMLA, and confront the suspect u/s 50(2)/(3) immediately.",
                isOptimal: true,
                legalityDelta: +10,
                pocSecuredCr: 84.00,
                ruling: "STRONG EVIDENTIARY LOCK (Section 22 PMLA). Unlike regular tax raids where loose sheets are attacked as 'dumb documents' (CBI vs. V.C. Shukla), here you linked the diary pages to physical Angadia token notes and digital bank/crypto trails, activating the Sec 22 statutory presumption against the suspect!"
            },
            {
                id: "B",
                label: "Seize the diary without page-numbering or taking Panch signatures on the inner pages, and record it simply as 'One Maroon Notebook' in the Panchnama.",
                isOptimal: false,
                legalityDelta: -18,
                pocSecuredCr: 25.00,
                ruling: "WEAK PANCHNAMA DOCUMENTATION! Recording 'One Maroon Notebook' without page-by-page attestation by Panchas and the occupant allows the defense to claim before the Adjudicating Authority that incriminating entries were interpolated post-seizure."
            },
            {
                id: "C",
                label: "Ignore the handwritten diary because handwritten 'kachha' notes have no evidentiary value unless typed and notarized.",
                isOptimal: false,
                legalityDelta: -25,
                pocSecuredCr: 0.00,
                ruling: "INCORRECT LEGAL UNDERSTANDING! Under Section 2(1)(t) & Section 22 of PMLA, 'records' include any handwritten book or ledger found in the possession or control of the person searched, carrying a statutory presumption of authenticity."
            }
        ]
    },
    {
        id: "ev_crypto",
        code: "RUD-04",
        title: "Titanium Seed-Phrase Plate & Ledger Nano X Hardware Wallet",
        category: "Virtual Digital Assets (VDA) / Sec 2(1)(u) PMLA",
        zone: "desk",
        pocValueCr: 125.50,
        requiresConcealedDiscovery: true,
        shortHint: "False Drawer Bottom: Ledger Nano X + 24-Word BIP39 Plate",
        description: `Inspecting the underside of the executive desk's right drawer reveals a magnetic false bottom. Concealed inside is a Ledger Nano X hardware wallet and a stamped 'Cryptosteel' titanium plate containing a 24-word BIP39 recovery mnemonic. Blockchain explorer check shows the wallet holds 14,950,000 USDT (Tether) and 112 BTC (~₹125.50 Crore) received from Mule Layer-3 accounts.`,
        forensicReadout: `WALLET TYPE: Ledger Nano X (Firmware 2.2.3) + BIP39 24-Word Titanium Backup
Blockchain Balance: 14.95M USDT (TRC-20) + 112.4 BTC = ₹125.50 Crore
ALERT: Because the 24-word seed phrase is known to the suspect's offshore partner in Dubai, merely seizing the USB hardware stick will NOT prevent them from draining the funds remotely within minutes!`,
        decisions: [
            {
                id: "A",
                label: "Do NOT merely bag the USB stick! Immediately transfer the ₹125.50 Cr USDT/BTC to the Official ED Controlled Custodial Cold Wallet under video panchnama witnessed by Panchas, record TXID hashes in Panchnama, and serve Sec 17(1A) Freeze Order to VDA exchanges.",
                isOptimal: true,
                legalityDelta: +15,
                pocSecuredCr: 125.50,
                ruling: "BRILLIANT CYBER-FORENSIC SEIZURE! You recognized that a hardware wallet is only a signing key and anyone with the 24-word seed phrase in Dubai could sweep the funds while the USB sits in an evidence Malkhana. Moving the VDA to the Official ED Government Cold Wallet with full TXID audit trail in the Panchnama secured ₹125.50 Crore of Proceeds of Crime!"
            },
            {
                id: "B",
                label: "Place the Ledger Nano X and the titanium seed plate into a sealed envelope, deposit it in the ED Malkhana, and wait for the PAO stage to move the crypto.",
                isOptimal: false,
                legalityDelta: -20,
                pocSecuredCr: 0.00,
                ruling: "CATASTROPHIC VDA LOSS! Forty minutes after you sealed the physical device in the envelope, the suspect's Dubai associate used a duplicate copy of the 24-word seed phrase to sweep all 14.95M USDT and 112 BTC into Tornado Cash / Monero mixers. The physical USB in your Malkhana now holds ₹0!"
            },
            {
                id: "C",
                label: "Photograph the 24-word seed phrase on your personal smartphone and leave the hardware wallet on the desk.",
                isOptimal: false,
                legalityDelta: -30,
                pocSecuredCr: 0.00,
                ruling: "SEVERE CHAIN-OF-CUSTODY BREACH! Storing raw private keys on an officer's personal device violates SOP for Virtual Digital Assets and compromises the evidentiary integrity of the seizure."
            }
        ]
    },
    {
        id: "ev_shells",
        code: "RUD-05",
        title: "24 Pre-Signed Blank Cheque Books, Corporate Seals & 'Geeta Nagar' Shell Dossier",
        category: "Benami & Layering / Sec 3 PMLA",
        zone: "lounge",
        pocValueCr: 92.00,
        requiresConcealedDiscovery: false,
        shortHint: "24 Mule Company Rubber Stamps + Pre-Signed Cheques + KYC Sim Cards",
        description: `In the lower cabinet of the West Credenza, you discover a Samsonite briefcase containing 24 rubber stamps of different 'Trading & Consultancy' Pvt. Ltd. companies, 24 cheque books where every leaf is pre-signed by low-income dummy directors (peons/drivers), and 24 active SIM cards taped to Aadhaar cards—all registered to a single 10x10 ft room at 'Plot 14, Geeta Nagar, Raipur'.`,
        forensicReadout: `ENTITY CLUSTER: 24 Shell Companies ("Geeta Nagar Address Cluster")
Bank Accounts: Axis, HDFC, ICICI & IDBI Current Accounts with ₹92.00 Cr credit balance
Dummy Directors: Signed blank cheques + original SIMs held exclusively by Suspect Vikramaditya`,
        decisions: [
            {
                id: "A",
                label: "Seize all 24 cheque books, stamps & SIMs under Panchnama, immediately issue Section 17(1A) Freezing Orders to the Nodal Officers of the respective banks to freeze the ₹92 Cr balances, and cross-index the accounts on the MHA Samanvaya portal.",
                isOptimal: true,
                legalityDelta: +12,
                pocSecuredCr: 92.00,
                ruling: "MASTERCLASS IN SYNDICATE DISMANTLING! Recovering the pre-signed cheque books, corporate seals, and OTP SIM cards from the prime accused's bedroom/study destroys the 'independent business entity' defense and proves exclusive Beneficial Ownership under Sec 3 PMLA. Immediate Sec 17(1A) debit-freeze locked ₹92.00 Crore before RTGS flight!"
            },
            {
                id: "B",
                label: "Leave the cheque books and stamps because the companies are separate legal entities not explicitly named in the residential search warrant.",
                isOptimal: false,
                legalityDelta: -20,
                pocSecuredCr: 0.00,
                ruling: "FUNDAMENTAL LEGAL MISCONCEPTION! Section 17 PMLA empowers seizure of ANY record or property found in the searched premises that is relevant to proceedings under the Act. By leaving them behind, the syndicate cleared ₹92 Cr via RTGS within two hours of your departure."
            },
            {
                id: "C",
                label: "Seize the rubber stamps only, and wait 15 days to write letters to the banks asking for account statements.",
                isOptimal: false,
                legalityDelta: -12,
                pocSecuredCr: 18.00,
                ruling: "DELAYED FREEZING ACTION! Without an immediate Sec 17(1A) Freezing Order served electronically to Bank Nodal Officers during the search, ₹74 Cr of the ₹92 Cr liquid balance was layered out via net-banking before your letters reached the branches."
            }
        ]
    },
    {
        id: "ev_burner",
        code: "RUD-06",
        title: "Submerged Burner Phones & Shredded 'Hawala Instruction Slips' in Server Alcove",
        category: "Destruction of Evidence / Sec 50 Confrontation",
        zone: "server",
        pocValueCr: 58.00,
        requiresConcealedDiscovery: false,
        shortHint: "2 iPhones Dropped in Water Pitcher + Cross-Cut Paper Bin",
        description: `In the East Server Alcove, right as the ED team rang the doorbell at 06:15 HRS, the suspect attempted to destroy evidence: two iPhone 15 Pro devices were dropped into a glass water carafe, and three pages of SWIFT wire instructions to a Mauritius Global Business Company (GBC-1) were fed into a strip-cut shredder bin.`,
        forensicReadout: `DEVICE STATUS: 2x iPhone 15 Pro (IP68 Water Resistant - STILL POWERED ON!)
Cellular State: Connected to Airtel 5G Tower | Incoming Remote-Wipe Push Pending
Shredder Bin: 36 strip-cut ribbons of Mauritius Bank 'FinCorp Ltd' Wire Transfer (USD 7.0M / ₹58 Cr)`,
        decisions: [
            {
                id: "A",
                label: "Immediately extract the IP68 iPhones from water, place them inside Faraday RF Shielding Pouches to block incoming 'Find My' remote-wipe packets, reconstruct & seal the shredded Mauritius wire slips on a transparent sheet signed by Panchas, and record Sec 17 statement.",
                isOptimal: true,
                legalityDelta: +10,
                pocSecuredCr: 58.00,
                ruling: "SHARP TACTICAL REFLEX! Modern iPhones are IP68 water-resistant; the water pitcher was a panic move, and a remote 'Erase iPhone' command was waiting to trigger. Placing them immediately in Faraday pouches saved the WhatsApp & Signal SQLite databases (`msgstore.db`), and the reconstructed Mauritius SWIFT instructions proved direct cross-border layering of ₹58 Crore!"
            },
            {
                id: "B",
                label: "Take the phones out, dry them on the table, and turn off Airplane mode so you can check the latest WhatsApp messages live.",
                isOptimal: false,
                legalityDelta: -22,
                pocSecuredCr: 10.00,
                ruling: "REMOTE WIPE TRIGGERED! The moment the iPhones re-established 5G handshake outside a Faraday bag, an Apple MDM / Find-My remote wipe packet sent by the syndicate's IT handler factory-reset both phones in front of your eyes!"
            },
            {
                id: "C",
                label: "Discard the shredded paper strips as unusable trash and log the phones as 'water-damaged beyond repair'.",
                isOptimal: false,
                legalityDelta: -20,
                pocSecuredCr: 0.00,
                ruling: "EVIDENCE ABANDONMENT! Strip-cut shredded documents are routinely reconstructed in PMLA searches and constitute primary evidence of mens rea (attempt to cause disappearance of evidence u/s 238 BNS / 201 IPC)."
            }
        ]
    }
];

export const SUSPECT_CONFRONTATION_QUESTIONS = [
    {
        id: "q1",
        question: "Confrontation on Section 50(2) & (3) PMLA: Vikramaditya Singhania's lawyer claims at the doorstep that 'Suspect has a right to silence and cannot be compelled to sign the Panchnama or state passwords.' How do you rule on record?",
        options: [
            {
                text: "Inform counsel that per Supreme Court Constitution Bench in Vijay Madanlal Choudhary vs. Union of India (2022), a person summoned/examined u/s 50 PMLA is bound to state the truth, proceedings are judicial in nature u/s 50(4), and refusal renders him liable for penalty u/s 63 PMLA & non-cooperation adverse inference.",
                isCorrect: true,
                bonusLegality: +10,
                explanation: "Spot-on citation of Vijay Madanlal Choudhary (2022 SCC OnLine SC 929). While physical coercion is strictly prohibited, statutory examination u/s 50(2)/(3) carries a legal obligation to state the truth and produce records."
            },
            {
                text: "Agree with the lawyer and skip recording any preliminary explanation of the seized assets during the search.",
                isCorrect: false,
                bonusLegality: -10,
                explanation: "Failing to record the occupant's contemporaneous explanation of recovered cash, bullion, and digital devices during the search gives the accused 6 months to fabricate an afterthought defense."
            }
        ]
    }
];
