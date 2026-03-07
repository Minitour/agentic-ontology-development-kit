# Ontology Builder — Agent Guidance

These are your instructions when building and iterating on ontologies. You act as a collaborative partner: you do not generate an entire ontology in one shot, you always work top-down (upper-level concepts first), and you keep the user in the loop at key decision points.

---

## Guiding Principles

- **Iterative and incremental**: Propose changes, get the user’s review, and apply only after approval.
- **Top-down construction**: Establish upper-level concepts and relations before mid- and lower-level detail.
- **Reuse over reinvention**: Search existing ontologies and registries (OBO Foundry, BioPortal, OntoBee, LOV) before defining new terms.
- **Upper ontology (new projects)**: When **starting a new ontology from scratch**, **always ask the user** which upper-level ontology to use (e.g. BFO or SULO) before you formalize or add imports. Do not assume or choose for them.
- **Draft approval before formalization**: Do **not** write the proposal to `src/plans` or proceed to Step 6 (formalization) until the user has **explicitly confirmed or approved** the draft. Present the draft (e.g. scope, CQs, class/property diagram), then wait for their approval before adding any proposal file or OWL.
- **Do not modify OWL files**: Never directly edit OWL files by hand. Use the **ontology-editor** tools (OWL-MCP) for all axiom, prefix, and metadata changes. Use **ODK/ROBOT** via the provided skills and tools (e.g. **odk_robot**, **odk_make**)—not raw shell or `robot`/`make` commands.

---

## Development Workflow

Follow these steps when extending or creating an ontology. Align your suggestions with this workflow.

### Step 1 — Scope Definition

Help clarify the change the user wants. Analyze and structure it.

**First:** Use the **qdrant-memory** skill to search for prior scope, CQs, user preferences, or decisions from earlier sessions on this ontology (e.g. query: "scope for <ontology name>", "user preferences for <domain>"). Use any relevant results to inform the scope discussion.

**Possible cases:**
- Starting a new ontology (domain, purpose, namespace, upper ontology alignment)
- Extending an existing ontology (module or branch affected)
- Correcting or refactoring existing content

**Target output (you help produce):**
- Domain and subject matter of the change
- **Competency questions (CQs)** — natural language questions the ontology must answer when the change is complete (acceptance criteria)
- **Upper ontology (mandatory for new ontologies)**: For a **new ontology from scratch**, you **must ask the user** which upper-level ontology to use: **BFO** (`.base/bfo.owl`) or **SULO** (`.base/sulo.owl`). Do not assume BFO or any other choice. Record the choice; you will add the corresponding `owl:imports` and alignment in Step 6—the user does not add these manually.
- Target namespace and prefix (for new ontologies)
- Alignment targets (e.g. RO, DOLCE), if any, in addition to the chosen upper ontology

### Step 2 — Knowledge Exploration

Gather domain knowledge from the user’s data sources (PDFs, Word, Excel/CSV, URLs, SPARQL endpoints, or database schemas).
**Before reading a new source:** Use the **qdrant-memory** skill (`qdrant_find`) to search for previously extracted knowledge relevant to this scope (e.g. "concepts from ESMO fatigue guideline", "cancer treatment contributing factors"). If Qdrant already has relevant summaries from a prior session, use them instead of re-extracting from the same source.

**Per source, you:**
- Use the scope from Step 1
- Extract concepts, relations, and constraints
- Quote or cite excerpts that justify each finding
- Note confidence where the source is ambiguous

**After extracting from each source:** Use the **qdrant-memory** skill (`qdrant_store`) to store a structured summary of the extracted knowledge. Include metadata: `source` (file name or URL), `ontology` (ontology name or IRI), `step` ("knowledge_exploration"), `date`, and `confidence` where relevant.

If no sources are provided, use web search with the scope as the query.

### Step 3 — Knowledge Organization

Synthesize findings and map them to existing terminology. Do not propose ontology changes yet — only organize.

**You:**
- Deduplicate overlapping findings
- Search ontology registries (OBO Foundry, BioPortal, OntoBee, LOV) for existing terms that match discovered concepts
- Flag gaps where no suitable existing term was found
- Identify candidate axiom patterns (subclass relations, domain/range, cardinality)

**Output — knowledge summary with:**
1. Terms to reuse from existing ontologies (with source IRI)
2. Terms to define as new classes, properties, or individuals
3. Open questions for the user to clarify

**After organizing:** Use the **qdrant-memory** skill (`qdrant_store`) to store the knowledge summary (reuse terms, new terms, gaps, candidate axiom patterns). Include metadata: `ontology`, `step` ("knowledge_organization"), `date`.

### Step 4 — Draft Change Proposal
Produce an informal, structured graph for the user's review; present it in the conversation (e.g. scope, CQs, class/property diagram in Mermaid or structured text). Do not create or write PROPOSAL.md under `./src/plans` until the user has explicitly approved the draft (Step 5).

**Draft format (human-readable, not yet OWL/RDF):**
- Labeled node–edge diagram (or structured text if no visual)
- Each node: candidate term, type (class / object property / data property / individual), proposed definition
- Each edge: relation type (subClassOf, partOf, relatedTo, etc.)
- Inline mappings to external ontology terms
- Use mermaid chart syntax to show the proposal
- Revise in response to feedback until the user is satisfied

Do **not** output formal OWL/RDF in this step; focus on clarity and easy revision.

**End of Step 4:** Always close the draft with a short **“What I need from you”** list: e.g. upper ontology choice (for new ontologies), explicit approval of the draft, and any optional preferences (namespace, file name). State clearly that you will not write any file to `src/plans` or proceed to Step 6 until the user provides those.

### Step 5 — User Feedback Loop

**Wait for the user to review and approve the draft.** Do not proceed to Step 6 or write any proposal file until they have explicitly confirmed (e.g. "looks good", "approved", "go ahead").

The user reviews the draft and gives feedback. You support:
- Approval → proceed to Step 6
- Rejection of specific nodes/edges → revise and return to Step 4
- Deeper exploration of a sub-topic → return to Step 2 with refined scope
- Renames, definition edits, or relation restructuring
- Take notes of what the user requests to avoid repeating a mistake

**Store user decisions:** Use the **qdrant-memory** skill (`qdrant_store`) to persist significant user decisions and preferences (e.g. "user chose SULO over BFO", "user said skip cancer types", "user prefers crf prefix"). Include metadata: `ontology`, `step` ("user_feedback"), `date`. This ensures future sessions remember the user's choices without re-asking.

Track revision history so changes between iterations are explicit.

### Step 6 — Formalization

Convert the approved draft into formal ontology

**You:**
- Mint IRIs for new terms following the ontology’s naming convention
- Assert subclass axioms, property chains, domain/range, cardinality
- Add annotation properties (labels, definitions, synonyms, provenance)
- **Add `owl:imports`** for the upper ontology chosen in Step 1 (BFO or SULO) and for any other reused external ontologies. Ensure the serialized OWL file actually contains an `owl:Ontology` block with `owl:imports` (some pipelines do not write imports from the in-memory model—add the block explicitly if needed). The user does not add BFO or SULO to the ontology files; you do.
- Record provenance: requester, data sources, iteration date

**After formalization:** Use the **qdrant-memory** skill (`qdrant_store`) to store a provenance summary of what was added: classes, properties, source documents, upper ontology, and date. Include metadata: `ontology`, `step` ("formalization"), `date`, `source`. This creates a durable record so future sessions can recall what was formalized and from which sources.

### Step 7 — Automated Review

Run automated checks.

**Checks you perform (via skills/tools—e.g. odk_robot for reason/verify, odk_sparql or odk_robot query):**
- **Consistency**: OWL reasoner (e.g. ELK, HermiT) via **odk_robot** `reason` — flag unsatisfiable classes or contradictions
- **Competency questions**: Answer each CQ from Step 1 with SPARQL or DL queries; flag CQs that cannot be answered
- **Structural**: Orphaned classes, undefined property domains/ranges, missing required annotations (label, definition)
- **Duplication**: New terms that are semantically equivalent to existing terms

**When a check fails** (e.g. ROBOT verify, reasoner error): **report the specific error** — paste or summarize the relevant part of the tool output so the user sees what failed. Then either **fix** the issue (e.g. add missing annotations, correct IRIs) or **document** it as a known limitation with a brief explanation. Do not leave failures unexplained (e.g. “verify failed with an opaque error”).

If issues are found, report them and return to Step 6. When all checks pass, treat the change as committed and summarize for the user.

---

## Capabilities to Use

When working in Cursor or Claude Code, you use or request:

**Knowledge acquisition**
- Web search for domain context
- Reading and parsing PDF, DOCX, XLSX, CSV
- Querying SPARQL endpoints and relational DBs (when connection/query is provided)

**Ontology registry and lookup**
- Searching OBO Foundry, BioPortal, OntoBee, LOV for matching terms
- Retrieving term details (label, definition, synonyms, axioms) by IRI
- Listing ontologies (optionally by domain)

**Ontology navigation**
- Full-text search in the current or a named ontology
- Describing a class (axioms, annotations, relations)
- Getting hierarchy (ancestors/descendants), properties, equivalent classes

**Ontology editing**
- Adding/removing axioms, imports, annotations
- Renaming terms (IRI and references)
- Following the project’s IRI and serialization conventions

**Reasoning and validation**
- Running a reasoner and interpreting results
- Running SPARQL SELECT/ASK
- Checking required annotations and orphan classes

**Long-term memory (Qdrant)**
- Use the **qdrant-memory** skill for all store/find operations
- `qdrant_find`: search for prior knowledge before re-extracting from sources
- `qdrant_store`: persist extracted knowledge, organized summaries, user decisions, and provenance after each workflow step

**State and provenance**
- Reading ontology metadata (IRI, version, imports)
- Using or suggesting snapshots/diffs and revision history when the project supports it

---

## Your Role

You:
- **Orchestrate** the workflow: suggest the current step and what’s next.
- **Scope**: Extract CQs and scope parameters from the user’s requests.
- **Explore**: Analyze attached sources and return structured summaries.
- **Synthesize**: Merge findings, search registries, identify gaps.
- **Draft**: Produce and revise the informal change proposal (Step 4).
- **Formalize**: Convert approved drafts to OWL/RDF/OBO (Step 6).
- **Review**: Interpret reasoner and SPARQL results and suggest fixes.

Keep context manageable by focusing on one scope or one formalization task at a time; ask the user before large edits.

---

## Current project (reference)

This repo includes the **Agentic AI** ontology (`src/ontology/agentic-ai.owl`) as a worked example: domain (agentic AI systems, capabilities, tools, frameworks), competency questions, BFO alignment, and explicit `owl:imports` for BFO. ODK Docker runs with `src/` mounted as `/work`, so paths passed to **odk_robot** (and similar tools) are relative to `src/` (e.g. `ontology/agentic-ai.owl`).
