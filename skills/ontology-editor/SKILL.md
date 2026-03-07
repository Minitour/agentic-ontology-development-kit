---
name: ontology-editor
description: Read, edit, and manage OWL ontologies with OWL-MCP (axioms, prefixes, metadata). Use whenever the user wants to add or remove axioms, search axioms, add prefixes, inspect ontology metadata, or formalize an ontology in OWL—e.g. "add this axiom", "find axioms for class X", "add prefix". Align with Ontology Builder workflow (formalization step); use absolute paths for OWL files. Never edit OWL files by hand.
---

# Ontology Editor Skill

Use this skill when you need to **inspect or modify OWL ontology files** in this project. **Never edit OWL files directly**—use these tools for all axiom, prefix, and metadata changes. The tools are provided by the OWL-MCP server and operate on OWL files by **file path** or by **configured ontology name**.

## When to Use

- **Step 6 (Formalization)** in the Ontology Builder workflow: add axioms, prefixes, and annotations to an OWL file after the user has approved the draft.
- **Ontology navigation**: find axioms, get all axioms, or read ontology metadata for an existing file.
- **Ontology editing**: add/remove axioms in OWL functional syntax; add prefix mappings.
- **Setup**: load or register an ontology in the config so it can be used by name; list or inspect configured ontologies.

Align with the project's INSTRUCTIONS.md: work top-down, get user approval before large edits, and keep changes in formal OWL (functional syntax recommended).

## How the Server Works

- **File path**: Every tool that takes `owl_file_path` expects an **absolute path** to the OWL file (e.g. `C:\Users\...\ontology.owl` or `/path/to/ontology.owl`).
- **By name**: After an ontology is registered (e.g. via `load_and_register_ontology` or `register_ontology_in_config`), you can use the `*_by_name` tools with `ontology_name` instead of a path.
- **Syntax**: Axioms are strings in **OWL functional syntax** (e.g. `SubClassOf(:Dog :Animal)`, `Declaration(Class(:Cat))`). The server syncs in-memory state with disk; Protege will see changes if it has the same file open.

## Tools Overview

### Axioms (by file path)

| Tool | Purpose |
|------|--------|
| **add_axiom** | Add one axiom (e.g. `SubClassOf(:A :B)`). |
| **add_axioms** | Add multiple axioms in one call. |
| **remove_axiom** | Remove one axiom (exact string match). |
| **find_axioms** | Search axioms by pattern (substring or regex); optional labels, limit. |
| **get_all_axioms** | Return all axioms in the ontology; optional labels, limit. |

### Prefixes and metadata (by file path)

| Tool | Purpose |
|------|--------|
| **add_prefix** | Add a prefix mapping (e.g. `ex` → `http://example.org/`). |
| **ontology_metadata** | Get ontology metadata/annotations. |
| **get_labels_for_iri** | Get label(s) for a given IRI. |

### Axioms and prefixes by ontology name

Use these when the ontology is already in the config (by name):

- **add_axiom_by_name**, **remove_axiom_by_name**, **find_axioms_by_name**, **add_prefix_by_name**, **get_labels_for_iri_by_name** — same as above but take `ontology_name` instead of `owl_file_path`.

### Configuration

| Tool | Purpose |
|------|--------|
| **list_configured_ontologies** | List all configured ontologies (name, path, readonly, etc.). |
| **get_ontology_config** | Get config for one ontology by name. |
| **configure_ontology** | Add or update an ontology in config (name, path, readonly, serialization, etc.). |
| **remove_ontology_config** | Remove an ontology from config. |
| **register_ontology_in_config** | Register an already-loaded ontology (by path) in config. |
| **load_and_register_ontology** | Load an ontology (create if missing) and register it in one step. |

## Usage Tips

1. **First time on a file**: Call `load_and_register_ontology(owl_file_path, ...)` to open and register it, or pass the absolute path into `add_axiom` / `find_axioms` / etc. directly—absolute paths ensure the MCP server can resolve files regardless of working directory.
2. **Finding content**: Call `find_axioms(owl_file_path, pattern)` with a substring or regex; set `include_labels: true` for human-readable labels (OBO-style `#` comments).
3. **Adding axioms**: Use OWL functional syntax. Add one axiom per call with `add_axiom`, or batch with `add_axioms`. Ensure required prefixes exist (e.g. `owl`, `rdf`, `rdfs`, `xsd`); add custom ones with `add_prefix`.
4. **Project workflow**: After the user approves a draft (Step 5), use these tools to implement the change in the OWL file (Step 6), then suggest automated review (Step 7) as in INIT.md.
5. **Imports**: When adding an external ontology (e.g. BFO), add the import via the tool. If the serialized OWL file does not show an `owl:Ontology` block with `owl:imports`, the pipeline may not write imports to disk—add the `owl:Ontology` / `owl:imports` block explicitly in the file so reasoners and tools can resolve the dependency.

## Tool Requirements

This skill requires the following tools to be available (they are proxied from the `owl-mcp` MCP server):

- add_axiom, add_axioms, remove_axiom, find_axioms, get_all_axioms
- add_prefix, ontology_metadata, get_labels_for_iri
- add_axiom_by_name, remove_axiom_by_name, find_axioms_by_name, add_prefix_by_name, get_labels_for_iri_by_name
- list_configured_ontologies, get_ontology_config, configure_ontology, remove_ontology_config, register_ontology_in_config, load_and_register_ontology

After learning this skill, call `setup_tools` with this skill's id to activate these tools, then use `call_tool` to invoke them.
