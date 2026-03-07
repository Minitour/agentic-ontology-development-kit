# Source (`src/`)

This folder is the **canonical location for your ontology project**. All ontology-related source files and generated ODK output live here.

## Contents

- **ODK config (e.g. `*-odk.yaml`)** — Defines the ontology (id, title, namespace, repository). Used by the ODK seed workflow to generate the full repo layout.
- **`ontology/`** — After seeding, the ODK-generated directory: Makefile, edit files (OWL/OBO), imports, patterns, and pipeline. All edits and builds are done under `src/ontology/`.

## Workflow

1. **New ontology**: Add a config YAML (e.g. `myont-odk.yaml`) here, then run the ODK seed skill; it will create `src/ontology/` and populate it.
2. **Existing ontology**: Work inside `src/ontology/` — edit terms via tools/skills (do not hand-edit OWL files), run Make targets for tests, release, and imports.

Do not modify OWL files directly; use the ontology-editor and ODK skills to add or change axioms and annotations.
