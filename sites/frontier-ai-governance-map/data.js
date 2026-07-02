// =====================================================================
// FRONTIER AI GOVERNANCE MAP - DATA
// =====================================================================
// HOW TO ADD A NEW MECHANISM:
//   Add one object to GOVERNANCE_NODES below. Required fields:
//     id        unique kebab-case string
//     name      short display label
//     geography "US" | "China" | "UK" | "EU" | "International"
//     layer     "Legal" | "Institutional" | "Corporate" | "Voluntary"
//     actor     who runs it (free text label)
//     did       one line: what they did / what it is
//     power     "high" | "medium" | "low" | "none"   (real teeth, not whether it exists)
//     status    "active" | "stalled" | "proposed"
//     depends_on   array of other node ids this relies on / derives from
//     tension_with array of other node ids this conflicts with / undermines
//   Optional:
//     note      caveat about its real power (e.g. "self-reported, no verifier")
//
// GAPS / WINDOWS go in GOVERNANCE_GAPS at the bottom (missing mechanisms).
// =====================================================================

const GOVERNANCE_NODES = [

  // ---------------- UNITED STATES ----------------
  {
    id: "us-sb53", name: "SB 53 (California)", geography: "US", layer: "Legal",
    actor: "CA legislature",
    did: "Large frontier developers must publish a safety framework and define catastrophic-risk thresholds.",
    power: "low", status: "active",
    note: "Brundage: only requires publishing SOME policy, even 'garbage'. No external compliance check.",
    depends_on: ["metr-common-elements"], tension_with: ["us-eo14365"]
  },
  {
    id: "us-raise", name: "RAISE Act (New York)", geography: "US", layer: "Legal",
    actor: "NY legislature",
    did: "Requires frontier developers to publish a 'detailed' safety policy from 2026.",
    power: "low", status: "active",
    note: "Watered down by industry lobbying. 'Detailed garbage' still passes.",
    depends_on: ["metr-common-elements"], tension_with: ["us-eo14365"]
  },
  {
    id: "us-eo14365", name: "EO 14365 (Preemption)", geography: "US", layer: "Legal",
    actor: "White House / David Sacks",
    did: "Executive order aiming to preempt state-level frontier AI laws under federal authority.",
    power: "medium", status: "active",
    note: "Legality contested; could be reduced to a chilling effect in court. Accelerationist play.",
    depends_on: [], tension_with: ["us-sb53", "us-raise"]
  },
  {
    id: "us-caisi", name: "CAISI", geography: "US", layer: "Institutional",
    actor: "US Center for AI Standards & Innovation (ex-US AISI)",
    did: "US government model testing and standards body; counterpart to UK AISI.",
    power: "low", status: "active",
    note: "Access to models is voluntary; no legal testing mandate.",
    depends_on: [], tension_with: []
  },
  {
    id: "us-nist-rmf", name: "NIST AI RMF", geography: "US", layer: "Institutional",
    actor: "NIST",
    did: "Voluntary AI Risk Management Framework; reference for risk practices.",
    power: "low", status: "active",
    depends_on: [], tension_with: []
  },
  {
    id: "anthropic-rsp", name: "Anthropic RSP v2.2", geography: "US", layer: "Corporate",
    actor: "Anthropic",
    did: "Capability Thresholds + Required Safeguards (CBRN, AI R&D, cyber under investigation).",
    power: "medium", status: "active",
    note: "Self-enforced. No outside party verifies adherence.",
    depends_on: ["seoul-commitments"], tension_with: []
  },
  {
    id: "openai-pf", name: "OpenAI Preparedness Framework v2", geography: "US", layer: "Corporate",
    actor: "OpenAI",
    did: "Tracked Categories with High/Critical thresholds; bio, cyber, AI self-improvement.",
    power: "medium", status: "active",
    note: "Self-enforced.",
    depends_on: ["seoul-commitments"], tension_with: []
  },
  {
    id: "gdm-fsf", name: "DeepMind Frontier Safety Framework v3", geography: "US", layer: "Corporate",
    actor: "Google DeepMind",
    did: "Critical Capability Levels; uniquely includes misalignment + instrumental reasoning levels.",
    power: "medium", status: "active",
    note: "Self-enforced. Most explicit on loss-of-control among the labs.",
    depends_on: ["seoul-commitments"], tension_with: []
  },
  {
    id: "xai-rmf", name: "xAI Risk Management Framework", geography: "US", layer: "Corporate",
    actor: "xAI",
    did: "Quantitative thresholds (MASK honesty, bio query refusal rate).",
    power: "low", status: "active",
    note: "Brundage flags weak safety culture; unlikely to have robust protections.",
    depends_on: ["seoul-commitments"], tension_with: []
  },
  {
    id: "us-other-frameworks", name: "Amazon / Microsoft / Meta / NVIDIA frameworks", geography: "US", layer: "Corporate",
    actor: "Multiple US labs",
    did: "Frontier safety frameworks of varying specificity (12 companies total, per METR).",
    power: "low", status: "active",
    depends_on: ["seoul-commitments"], tension_with: []
  },

  // ---------------- CHINA ----------------
  {
    id: "cn-genai-measures", name: "Generative AI Measures (2023)", geography: "China", layer: "Legal",
    actor: "CAC",
    did: "Binding registration and content rules for public generative AI services.",
    power: "high", status: "active",
    note: "Enforced; content control is the core driver.",
    depends_on: [], tension_with: []
  },
  {
    id: "cn-algo-regs", name: "Algorithm Recommendation Regs", geography: "China", layer: "Legal",
    actor: "CAC",
    did: "Binding rules on recommendation algorithms and filing requirements.",
    power: "high", status: "active",
    depends_on: [], tension_with: []
  },
  {
    id: "cn-content-labeling", name: "AI Content Labeling Standards", geography: "China", layer: "Legal",
    actor: "TC260 / CAC",
    did: "Finalized labeling rules for AI-generated content, now in effect.",
    power: "medium", status: "active",
    depends_on: ["cn-framework20", "cn-tc260"], tension_with: []
  },
  {
    id: "cn-cac", name: "CAC", geography: "China", layer: "Institutional",
    actor: "Cyberspace Administration of China",
    did: "Most powerful AI/internet/data regulator; leads most AI-specific rules.",
    power: "high", status: "active",
    depends_on: [], tension_with: []
  },
  {
    id: "cn-tc260", name: "TC260", geography: "China", layer: "Institutional",
    actor: "National standards body",
    did: "Translates frameworks into binding technical standards (fast cycle).",
    power: "medium", status: "active",
    note: "Sheehan/Singer: China converts guidance to standards much faster than the US.",
    depends_on: [], tension_with: []
  },
  {
    id: "cn-cncert", name: "CNCERT-CC", geography: "China", layer: "Institutional",
    actor: "Computer emergency response center",
    did: "Co-issued Framework 2.0; handles security flaw response.",
    power: "medium", status: "active",
    depends_on: [], tension_with: []
  },
  {
    id: "cn-framework20", name: "AI Safety Governance Framework 2.0", geography: "China", layer: "Voluntary",
    actor: "CAC / TC260 / CNCERT-CC",
    did: "Nonbinding framework; adds CBRN, open-source, loss-of-control, labour risks. Loss of control placed FIRST in trustworthy-AI principles. Proposes 'circuit breakers' and 'one-click control'.",
    power: "medium", status: "active",
    note: "Nonbinding, but fast-tracked into TC260 standards. Primarily domestic-facing.",
    depends_on: [], tension_with: []
  },
  {
    id: "cn-global-init", name: "Global AI Governance Initiative", geography: "China", layer: "Voluntary",
    actor: "China (State Council / CAC)",
    did: "Diplomatic framework offering a 'Chinese approach' to global AI governance.",
    power: "low", status: "active",
    depends_on: [], tension_with: []
  },
  {
    id: "cn-redlines", name: "Scientists' Red Lines (IDAIS)", geography: "China", layer: "Voluntary",
    actor: "Yao Qizhi, Xue Lan + Western scientists",
    did: "Joint statement on AI red lines: no WMD design, no autonomous cyberattacks.",
    power: "low", status: "active",
    note: "Norm-setting, Track II. Evidence US-China safety alignment is possible.",
    depends_on: [], tension_with: []
  },

  // ---------------- UK ----------------
  {
    id: "uk-frontier-bill", name: "Frontier AI Bill", geography: "UK", layer: "Legal",
    actor: "UK Government",
    did: "Promised targeted frontier AI legislation. Repeatedly delayed; now unlikely beyond online-safety extension.",
    power: "none", status: "stalled",
    note: "Stead/Whittlestone: a missed opportunity. WINDOW.",
    depends_on: [], tension_with: []
  },
  {
    id: "uk-aisi", name: "UK AISI (AI Security Institute)", geography: "UK", layer: "Institutional",
    actor: "UK Government",
    did: "World-leading state frontier-eval body; stable funding, technical talent, trusted lab partnerships.",
    power: "medium", status: "active",
    note: "Soft power via credibility, not legal mandate. Access is voluntary.",
    depends_on: [], tension_with: []
  },
  {
    id: "uk-network-coord", name: "Network Coordinator role", geography: "UK", layer: "Institutional",
    actor: "UK AISI",
    did: "UK coordinates the International Network for Advanced AI Measurement, Evaluation and Science.",
    power: "low", status: "active",
    depends_on: ["intl-network"], tension_with: []
  },
  {
    id: "uk-summit", name: "AI Safety Summit (Bletchley 2023)", geography: "UK", layer: "Voluntary",
    actor: "UK Government",
    did: "First international AI safety summit; brought US and China to one table.",
    power: "low", status: "active",
    note: "Convening power. Seeded the International AI Safety Report and AISI network.",
    depends_on: [], tension_with: []
  },
  {
    id: "uk-us-mou", name: "UK-US AI MoU (Sept 2025)", geography: "UK", layer: "Voluntary",
    actor: "UK + US governments",
    did: "Memorandum on joint testing and standards via AISI-CAISI partnership.",
    power: "medium", status: "active",
    depends_on: ["uk-aisi", "us-caisi"], tension_with: []
  },

  // ---------------- EU ----------------
  {
    id: "eu-ai-act", name: "EU AI Act", geography: "EU", layer: "Legal",
    actor: "European Union",
    did: "Binding, risk-tiered AI regulation including GPAI rules on systemic-risk models.",
    power: "high", status: "active",
    note: "Brundage: enforcement vulnerable to US political pressure.",
    depends_on: [], tension_with: []
  },
  {
    id: "eu-gpai-cop", name: "GPAI Code of Practice", geography: "EU", layer: "Voluntary",
    actor: "EU AI Office + signatories",
    did: "Safety & Security chapter operationalizing systemic-risk tiers for GPAI.",
    power: "medium", status: "active",
    note: "Informed by METR's common-elements taxonomy.",
    depends_on: ["metr-common-elements"], tension_with: []
  },
  {
    id: "eu-ai-office", name: "EU AI Office", geography: "EU", layer: "Institutional",
    actor: "European Commission",
    did: "Enforces AI Act GPAI provisions; oversees Code of Practice.",
    power: "medium", status: "active",
    depends_on: [], tension_with: []
  },

  // ---------------- INTERNATIONAL ----------------
  {
    id: "intl-safety-report", name: "International AI Safety Report 2026", geography: "International", layer: "Institutional",
    actor: "100+ experts (EU/OECD/UN-nominated)",
    did: "Scientific consensus assessment of GPAI capabilities and risks. Informs but does not bind policy.",
    power: "low", status: "active",
    note: "Feeds national policy discussions; no enforcement power.",
    depends_on: [], tension_with: []
  },
  {
    id: "intl-network", name: "Int'l Network for AI Measurement, Eval & Science", geography: "International", layer: "Institutional",
    actor: "Member AI safety institutes (UK coordinates)",
    did: "Coordination mechanism across national eval institutes (formerly International AISI Network).",
    power: "low", status: "active",
    depends_on: ["uk-aisi"], tension_with: []
  },
  {
    id: "seoul-commitments", name: "Seoul Frontier AI Safety Commitments", geography: "International", layer: "Voluntary",
    actor: "16+ companies (2024 Seoul Summit)",
    did: "Companies committed to publish frontier safety policies. Triggered most corporate frameworks.",
    power: "low", status: "active",
    depends_on: [], tension_with: []
  },
  {
    id: "g7-hiroshima", name: "G7 Hiroshima AI Process", geography: "International", layer: "Voluntary",
    actor: "G7",
    did: "Reporting framework for advanced AI; early move toward standardized transparency.",
    power: "low", status: "active",
    depends_on: [], tension_with: []
  },
  {
    id: "singapore-consensus", name: "Singapore Consensus", geography: "International", layer: "Voluntary",
    actor: "Global research community",
    did: "Shared priorities for global AI safety research.",
    power: "low", status: "active",
    depends_on: [], tension_with: []
  },
  {
    id: "metr-common-elements", name: "METR Common Elements", geography: "International", layer: "Voluntary",
    actor: "METR",
    did: "Taxonomy of 9 shared elements across 12 frontier safety policies. De facto reference standard.",
    power: "low", status: "active",
    note: "Influence hub: shapes EU Code of Practice and US threshold language.",
    depends_on: [], tension_with: []
  }
];

// =====================================================================
// GAPS / WINDOWS - missing mechanisms (rendered in bottom band)
// =====================================================================
const GOVERNANCE_GAPS = [
  {
    id: "gap-external-audit", name: "No mandatory external auditing",
    did: "No jurisdiction requires independent third-party audits of frontier labs. Labs grade their own homework.",
    source: "Brundage; Int'l AI Safety Report"
  },
  {
    id: "gap-compliance-verification", name: "No compliance verification",
    did: "No one outside a company checks whether it actually follows its own published safety policy.",
    source: "Brundage"
  },
  {
    id: "gap-china-corporate", name: "Thin Chinese corporate layer",
    did: "Chinese frontier labs have no formal published frontier safety policies equivalent to Western RSPs.",
    source: "METR (12 are US/Western); Sheehan/Singer"
  },
  {
    id: "gap-intl-treaty", name: "No binding international agreement",
    did: "No treaty or binding cross-border regime on frontier AI. Only voluntary commitments and convening.",
    source: "O hEigeartaigh; Int'l AI Safety Report"
  },
  {
    id: "gap-recursive-improvement", name: "Recursive self-improvement uncovered",
    did: "No regime addresses the race to significant recursive self-improvement capability.",
    source: "Stead/Whittlestone (proposed UK voluntary code)"
  }
];
