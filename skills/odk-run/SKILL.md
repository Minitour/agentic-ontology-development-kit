---
name: odk-run
description: Run custom Make targets or ODK tools that have no dedicated skill. Use when the user wants a one-off make target (other than test, prepare_release, refresh-imports, update_repo, odkversion) or to run Konclude, jena, relation-graph, jinjanate, OORT, souffle, dicer-cli, yq-mf, or sssom-cli. Do not use for robot, owltools, dosdp-tools, fastobo-validator, riot, sparql, runoak, or sssom—use those skills instead.
---

# ODK Run Skill

Use this skill when the user needs to run a command that is **not** covered by a dedicated ODK skill: either a **custom Make target** in the ontology dir, or one of the **other ODK tools** (Konclude, Apache Jena, relation-graph, jinjanate, ontology-release-runner, souffle, dicer-cli, yq-mf, sssom-cli). In this Ontology Builder repo the container mounts the project directory (workspace root or `projects/<slug>`) as `/work`; use paths relative to that root and `make -C ontology <target>` or `make -C src/<id> <target>` as appropriate. For ROBOT, owltools, dosdp-tools, fastobo-validator, riot, sparql, runoak, or sssom, use the corresponding odk-* skill.

## When to Use This Skill (by outcome)

- User wants a **one-off or custom Make target** that is not `test`, `prepare_release`, `refresh-imports`, etc. → use **odk_run** with `command`: `make -C ontology <target>` or `make -C src/<id> <target>` (paths relative to the mounted project root, e.g. `projects/<project_dir>/` or workspace root).
- User wants to run **Konclude**, **jena**, **relation-graph**, **jinjanate**, **OORT**, **souffle**, **dicer-cli**, **yq-mf**, or **sssom-cli** → use **odk_run** with `command` set to the full invocation (paths relative to the mounted project root).

## What the Tool Does and How It Works

**What it does**: Runs an **arbitrary single command** in the ODK environment. Use only for custom make or the tools listed above; for robot, owltools, dosdp-tools, riot, sparql, runoak, sssom, and fastobo-validator use the dedicated skills so the agent loads only what it needs.

**How it works**: Pass the **full command string** to **odk_run** via the `command` parameter. The container’s working directory is `/work` (the mounted project root, e.g. `projects/<project_dir>/` or a clone); use paths relative to that. Example: `make -C ontology custom-target` or `Konclude -i ontology/edit.owl -o ontology/out.owl`.

## When Not to Use This Skill

- **ROBOT** → use **odk-robot** and **odk_robot**.
- **owltools** → use **odk-owltools** and **odk_owltools**.
- **dosdp-tools** → use **odk-dosdp-tools** and **odk_dosdp_tools**.
- **fastobo-validator** → use **odk-fastobo-validator** and **odk_fastobo_validator**.
- **riot** → use **odk-riot** and **odk_riot**.
- **sparql** → use **odk-sparql** and **odk_sparql**.
- **runoak** → use **odk-runoak** and **odk_runoak**.
- **sssom** → use **odk-sssom** and **odk_sssom**.
- **Standard ODK Make targets** (test, prepare_release, refresh-imports, update_repo, odkversion) → use **odk-make** and **odk_make**.
- **Seeding a repo** → use **odk-seed** and **odk_seed**.

## Tool and Arguments

| Argument   | Type   | Required | Description |
|------------|--------|----------|-------------|
| **command** | string | yes     | Full command (no robot, no owltools/dosdp-tools/riot/sparql/runoak/sssom/fastobo-validator). E.g. `make -C ontology custom-target`, `Konclude -i edit.owl -o out.owl`. Paths relative to the mounted project root (e.g. `projects/<project_dir>/` or clone root). |

## Examples (calling the tool)

- Custom make: **odk_run** with `command`: `make -C ontology some-custom-target` (or `make -C src/<id> some-custom-target` for ODK repos that use `src/<id>/`)
- Konclude: **odk_run** with `command`: `Konclude -i edit.owl -o classified.owl` (adjust to actual Konclude CLI)
- Other tool: **odk_run** with `command`: `<tool> --help` then the full invocation the user needs

## Tool Requirement

This skill requires: **odk_run**

After learning this skill, call `setup_tools` with this skill's id to activate the tool, then use `call_tool` to invoke it.
