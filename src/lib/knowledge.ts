/**
 * RAIOS v4 — Foundational Company Knowledge
 * Every agent loads this. This is the context Lokesh gives all agents.
 * Ported from the SDK version's knowledge-base/company.ts
 */

export const COMPANY_PROFILE = `
# Recube360 — Company Profile

## The Group
Recube360 is the umbrella holding three operating companies:

1. **Greenlit** — Managed marketplace for event infrastructure. Aggregates demand across 500+ events/year, packages it by spec, routes to manufacturers/operators. The operating-and-financing layer at moments of high human concentration.

2. **Cupable** — Reusable cup manufacturing and logistics. 70% market share in Indian concert packaging. Vertically integrated: owns manufacturing + operations.

3. **Climate Dropped** — Instagram content engine (@climatedropped). Daily climate/sustainability news. Faceless AI-assisted production. Building toward 10K followers and YouTube expansion.

## Founder
**Lokesh Sambhwani** — CEO, 29, Mumbai (Santacruz West)
- Non-technical founder. Marketing background (Zomato-adjacent, early Beardo).
- Led 500+ people as president of Rotaract at HR College.
- Believes in Delta 4 theory: people buy from people. Decisions rest on dopamine, money/fame, and relationships.
- Operating style: Direct, process-oriented, zero tolerance for fluff.
- Email: lokesh@recube360.org | Phone: +91 9769759092

**Co-founders:**
- Nishith Jardosh — PhD, ex-McKinsey, CFA. Strategy and financial modeling.
- Rahul Batra — CMO, ex-Zomato, Beardo. Brand and marketing.
- Purav Desai — CTO, solar/renewables. Technical operations.

## Team Structure (15 people across 5 departments)
- Operations (4): Event logistics, fleet scheduling, vendor coordination, compliance
- Content (2): Climate Dropped production, social media, analytics
- Sales & Account Management (2): Lead gen, proposals, deal management, retention
- Accounts & Finance (2): Invoicing, GST, collections, MIS, investor reporting
- Brands & Partnerships (1): Partnership sourcing, ESG positioning, sponsorship activation
- Founders (4): Strategy, fundraising, key accounts, hiring

## Financial Targets (FY27)
- Revenue: INR 100 Cr
- Blended margins: 38%
- Valuation: INR 450 Cr
`;

export const STRATEGY = `
# Strategic Framework

## Core Thesis
Greenlit aggregates demand across 500+ events annually into contractual pipelines. Takes aggregate demand to manufacturers and operators, creates supply that doesn't exist, captures managed margin on deployment.

Not asset ownership. Not brokerage. Demand aggregation with contractual leverage.

## The Moat
Cross-vertical demand intelligence — the demand map. By 2026, we process signals from 500+ events across hospitality, entertainment, sports, corporate. Micro-trends, timing patterns, seasonality, specs, budget cycles. This dataset is invisible to competitors and manufacturers.

## Current Priorities (May 2026)
1. **EV Mobility** — Crack first 5 BRSR corporate contracts. Scope 3 compliance is the wedge.
2. **Climate Dropped + YouTube** — Prove content engine, build to 10K IG followers, launch YouTube.
3. **SA Expansion** — Secure CWC 2027 venue contracts. Boland Park won. SMSA/FNB and Wanderers in pipeline.
4. **BESS** — Package demand pipeline for 75+ unit manufacturer orders.
5. **Investor Relations** — FY26 update cycle, monthly founder briefings.
`;

export const SERVICES = `
# Service Lines

## 1. EV Mobility (Demand Router)
BRSR compliance forces 250 companies to show Scope 3 emissions. They have budget but zero capex appetite for EV fleets. We route demand.
- Nexon EV: INR 2,199 vendor / INR 3,499 sale (8hr) — 37-47% margin
- MG ZS EV: INR 3,500 vendor / INR 4,999 sale — 30-43% margin
- Monthly: INR 64,999-1,14,999 (18-28% margin)

## 2. BESS (Battery Energy Storage) — Financier + Demand Router
Large events need backup power. Margins 15-25%. SA context: SMSA/FNB R1.6M/mo bill, 20 solar cos failed, no export, right-size to load.

## 3. Cupable (Reusable Packaging) — Vertically Integrated
70% market share. Margins 40-50%. SA pricing: R1.5-2.5 ZAR per cup (max R2.5).

## 4. Water Management — Bundled Service
Filtration stations, consumption tracking. Margins 25-35%.

## 5. Waste Management — Financier + Demand Router
Segregation at source, route to processors. SMSA: currently NO segregation. Margins 20-30%.
`;

export const MARKETS = `
# Market Intelligence

## India Market
- BRSR mandate for top 1000 listed companies (SEBI)
- GST: 18% services, e-invoicing >INR 5Cr turnover
- GeM portal for government procurement
- Key segments: BRSR corporates, hotels (IHCL, ITC), events (NESCO), sports venues

## South Africa Market
- CWC 2027 driving venue upgrades across 8+ venues
- Boland Park WON (proof point)
- SMSA/FNB: 20 event days/yr, R1.6M/mo electricity, start power+waste
- Wanderers: R91K/mo bill, solar unhappy, cups open, waste open
- Municipal energy policy blocks feed-in/export
`;

export const VOICE = `
# Voice Standards

## Lokesh's Email Voice
- Warm intros — never jump to pitch
- Use first names. Never "Dear Sir/Madam"
- Hook in first sentence — a number, an irony, a specific reference
- Short paragraphs. Max 3-4 sentences each
- Always include phone: +91 9769759092
- Banned: "leveraging synergies", "best-in-class", "holistic approach", "touch base", "circle back"

## Climate Dropped Voice
- Urgent, conversational, data-first
- Anti-corporate but not preachy
- Every script opens with a number or stark fact
- Every script has an opinion, not just a summary

## Outreach Rules
- NEVER use info@ emails. Find verified personal SPOCs.
- Deep-research before writing
- Irony/number hooks for cold outreach
`;

export const PRICING = `
# Pricing & Margins Reference

## EV Mobility
| Vehicle | Vendor Cost | Sale Price (8hr) | Margin |
|---------|------------|-----------------|--------|
| Nexon EV | INR 2,199 | INR 3,499 | 37-47% |
| MG ZS EV | INR 3,500 | INR 4,999 | 30-43% |
| Hycross | INR 4,500 | INR 5,999 | 25-33% |

## Deal Classification
- WIN: >25% blended margin
- BREAKEVEN: 15-25% margin
- LOSS: <15% margin (only accept if strategic)
`;

export const BEHAVIORAL_CONTRACT = `
## Behavioral Standards (All RAIOS Agents)

1. **Verify facts.** Never hallucinate company names, people, numbers, or regulatory deadlines. If uncertain, say so explicitly.

2. **State confidence levels.** Every factual claim must be tagged:
   - HIGH: Verified from knowledge base or reliable source
   - MODERATE: Inferred from patterns, likely correct
   - LOW: Best guess, needs verification

3. **No internal jargon in output.** Everything you produce must be client-ready or team-ready.

4. **Complete deliverables.** Never produce partial work.

5. **Proactive escalation.** If you discover information another team needs, flag it: "CROSS-TEAM: [Sales] should know that..."
`;

export function buildFullKnowledge(): string {
  return [COMPANY_PROFILE, STRATEGY, SERVICES, MARKETS, VOICE, PRICING].join("\n\n---\n\n");
}
