# Launch kit: GainRatio open source

**One line:** Open-source, local-first software that can prove what it loaded —
signed data, content-addressed bundles, and caches that re-check signatures.

**Who it is for**
- Small compliance teams who need sanctions screening without uploading names.
- Online stores paying per search query who want the catalog in the shopper's browser.
- Developers building offline or privacy-sensitive browser features.

**The front door:** `https://open-source.gainratio.com/` (live).
**The proof:** `https://aml-filter.com/trust/` and the `edgeproc-browser` README.

---

## The 30-day calendar

| Week | Ship | Say | Measure |
|---|---|---|---|
| 1 | Publish `/open-source/`; add it to the gainratio.com nav; submit the five AML-Filter URLs to Search Console | LinkedIn post #1; email 10 accountants | Impressions, clicks, first 3 replies |
| 2 | Chrome Web Store screenshot + submit ATC; publish `@gainratio/browser` 0.4.3 | Show HN draft; 10 formation-agent emails | Store review status; HN traffic |
| 3 | One tutorial: "Ship signed data to a browser and prove it arrived" | LinkedIn post #2; 2 developer communities | Tutorial reads, npm installs |
| 4 | First design-partner case study (even a 200-word quote) | Email the 5 warmest conversations; ask for one intro each | 5 conversations booked; 1 case study |

Do not count stars. Count **conversations, repeat users, and installs**.

---

## Show HN draft

**Title:** Show HN: Sanctions screening that runs in the browser, with a signed watchlist

**Body:**

I built AML-Filter because the small compliance teams I talked to had the same
two problems: the screening tools upload customer names to a server, and the
watchlist behind them is a black box.

The screening runs locally in the tab. The watchlist arrives as a signed,
content-addressed bundle: an Ed25519 pointer, SHA-256 chunks, and a monotonic
sequence so an old release cannot be replayed. The client pins the public key,
refuses a revoked signer, and keeps a copy for offline use. There is no account
and no upload of the names you enter.

The same runtime is a library (`@gainratio/browser`) and the producer side is
Python (`edge-proc`). The trust page has the verification steps:
https://aml-filter.com/trust/

I would value a hard look at the threat model and the offline path, especially
from anyone who has shipped signed updates to browsers. The code is MIT:
https://github.com/gainratio

---

## Cold email — accountant / bookkeeper

**Subject:** Sanctions checks without uploading client names

Hi {{name}},

Do you screen new clients against the OFAC/EU/UN lists? Most tools I see upload
the name to a server before they answer.

I built AML-Filter to do the check inside the browser instead: the watchlist is
signed, the names never leave the page, and there is no account. It is free
while I’m working with the first small firms.

Would 15 minutes be useful to see whether it fits how you onboard clients? If
not, no follow-up from me.

— Harish
https://aml-filter.com

---

## Cold email — formation agent / registered agent

**Subject:** A free sanctions check for the names you onboard

Hi {{name}},

You probably run OFAC/EU checks on every new entity. I’m looking for five small
firms to try a browser-based version: paste the name, get the match, and the
name never leaves your machine. The list is refreshed daily and signed.

No integration, no account, no upload. If it saves you a step, I’d like to hear
where it doesn’t.

— Harish
https://aml-filter.com

---

## Cold email — e-commerce / search developer

**Subject:** Search that runs in the shopper’s browser

Hi {{name}},

You’re paying per query for search that could run on the device. EdgeReco loads
a signed catalog into the shopper’s browser and searches it there; the catalog
is content-addressed and works offline after the first load.

I’m looking for one store to measure it honestly against your current search —
latency, conversion, and the bill. If the numbers don’t hold, I’ll say so.

— Harish
https://edge-reco.com

---

## LinkedIn post #1

Most “private” browser tools still upload the sensitive part.

AML-Filter screens names against sanctions lists inside the tab. The watchlist
is signed, the names never leave the page, and there is no account. It is open
source, MIT, and the trust page shows how to verify a load yourself.

I’m looking for five small compliance teams to try it and tell me where it
breaks. Free while I’m learning.

https://aml-filter.com

## LinkedIn post #2

A signed update is not the same as a verified one.

The browser runtime I open-sourced pins an Ed25519 key, refuses a revoked
signer, checks a monotonic sequence, and addresses every chunk by SHA-256. An
offline cache still re-authenticates the pointer before it returns a byte.

That is the difference between “we ship signatures” and “the client can prove
what it loaded.” The code and the threat model are public:
https://github.com/gainratio/edgeproc-browser

---

## Design-partner call script

1. What do you use today for this check/search? What does it cost, in money and
   in steps?
2. Walk me through the last time it was wrong or slow. What happened next?
3. If this worked, who else would need to approve it?
4. What would make you stop using it after a week?
5. Can I watch you do it once, and quote you if it helps?

Do not demo first. Ask first.

---

## Case-study template

- **Who:** role, size of team, what they screen/search.
- **Before:** the tool, the upload, the per-query cost, the manual step.
- **What changed:** one paragraph, no adjectives.
- **Proof:** a number they gave you (time per check, queries/month, cost), or
  “they use it weekly” if they will not share a number.
- **Quote:** one sentence, approved in writing.
- **Limits:** what it does not do yet.

---

## Metrics that matter

| Funnel | Metric | Target by day 30 |
|---|---|---|
| Reach | Search impressions for the five AML pages | 1,000 |
| Interest | `/open-source/` → product click-through | 15% |
| Trial | Unique screeners (no account) | 50 |
| Repeat | Visitors who screen on 2+ days | 10 |
| Conversation | Calls booked | 5 |
| Proof | Written case studies | 1 |
| Developer | `@gainratio/browser` installs | 25 |

Instrument with Cloudflare Web Analytics or a privacy-friendly counter; do not
add a third-party tag that contradicts the privacy claim.

---

## Guardrails

- No purchased lists, no scraped personal emails, no “just following up” more
  than once.
- Every claim in the email must be on the site and true today. If a number is
  unmeasured, say “I haven’t measured that yet.”
- One product per conversation. AML-Filter for compliance; EdgeReco for stores;
  do not pitch the astrology app to a compliance team.
- If someone says no, ask one question: “What would have made this worth a
  look?” Then stop.
