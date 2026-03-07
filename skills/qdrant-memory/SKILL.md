---
name: qdrant-memory
description: Store and retrieve knowledge in Qdrant as long-term memory. Use whenever the user wants to persist findings, remember extracted concepts, recall prior work, or search by meaning across sessions—e.g. "remember this", "what did we find about X", storing competency questions, scope, or provenance. Prefer this skill over ad-hoc notes when information should be discoverable later by semantic search.
---

# Qdrant Long-Term Memory Skill

Use this skill when you need to **persist knowledge** extracted from data sources or **recall** previously stored information. Qdrant acts as a semantic memory layer: store natural-language summaries and metadata, then retrieve them later by semantic search (not exact keywords). This keeps the ontology builder workflow continuous across sessions.

## Purpose in the Ontology Builder Workflow

- **Step 2 (Knowledge Exploration)**: After extracting concepts, relations, and constraints from PDFs, Word, Excel, CSV, URLs, or SPARQL/DB sources, store structured summaries so they can be reused across sessions.
- **Step 3 (Knowledge Organization)**: Store findings about existing terms (OBO, BioPortal, OntoBee, LOV), gaps, and candidate axioms so the agent or user can recall them later.
- **Between sessions**: Retain scope (CQs, namespace, alignment targets), draft decisions, and provenance so the next session can continue without re-extracting from scratch.

This is **long-term memory** for the ontology builder: it complements the current conversation and file state.

## When to Use

- **Store**: After extracting or synthesizing knowledge from a data source — store a concise summary and any metadata (source path, type, confidence, ontology IRI, etc.).
- **Find**: When starting a task or continuing work — search for relevant prior knowledge (e.g. "pizza ontology domain concepts", "BFO alignment decisions", "terms from OBO Foundry for anatomy").

Reserve Qdrant for information that should persist across sessions and be discoverable by meaning—ephemeral or single-turn context belongs in the conversation, not in long-term memory.

## Tools Overview

| Tool | Purpose |
|------|--------|
| **qdrant_store** | Store a piece of information in Qdrant. Provide the main text in `information` and optional structured data in `metadata` (e.g. source, type, date). Use `collection_name` only if you need a different collection than the default. |
| **qdrant_find** | Retrieve relevant stored items by semantic search. Pass a natural-language `query` describing what you need; results are ranked by relevance. Use `collection_name` only if querying a non-default collection. |

## Usage Tips

1. **What to store**: Summaries of extracted concepts, relations, and constraints; competency questions and scope; mappings to existing terms; draft decisions and open questions; provenance (source file, excerpt, confidence).
2. **Metadata**: Use the `metadata` parameter (JSON object with string keys) for structured fields such as `source`, `type`, `ontology_iri`, `date`, `confidence` so you can interpret results later.
3. **Querying**: Use natural language for `qdrant_find` (e.g. "pizza toppings and subclasses", "alignment to BFO continuant", "terms from spreadsheet column X"). The server uses embeddings so similar meanings match.
4. **Collection**: If `COLLECTION_NAME` is set in the server config, you can omit `collection_name` for both tools. Use a separate collection name only when you want to partition memory (e.g. by project or domain).

## Configuration

The server is defined in `capabilities.yaml` (local mode). Set **QdrantLocalPath** to the **absolute path** to the project's `.qdrant` folder (e.g. `C:\Users\You\Projects\ontology-builder\.qdrant` or `/home/you/ontology-builder/.qdrant`) via `capa install` or in a `.env` file with `capa install -e`. Collection name is **main**.

After learning this skill, call `setup_tools` with this skill's id to activate these tools, then use `call_tool` to invoke them.
