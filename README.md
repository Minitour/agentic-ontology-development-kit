# Agentic Ontology Development Kit

Build or edit ontologies with AI assistance in Cursor or Claude Code. You install the required tools, put your ontology files in the right place, and tell the agent what you want. The agent handles scope, proposals, formalization, upper-ontology alignment (BFO or SULO), and checks.

## What you need to do

1. **Install prerequisites** (below).
2. **Run `capa install`** once in the project root after cloning.
3. **Put existing OWL files in `src/`** (e.g. `src/ontology/my-ontology.owl`) if you are editing an existing ontology. For a new one, you can start from scratch or add an ODK config and ask the agent to seed the project.
4. **Chat with the agent**—describe your goal, answer when it asks which upper ontology to use (BFO or SULO), and approve proposals. It will edit the ontology, add imports, and run checks for you.

## Prerequisites

Install these before starting:


| Requirement             | Purpose                                                                                                                                          |
| ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Docker**              | Used by the agent to run ROBOT, owltools, and other ontology tools. [Install Docker](https://docs.docker.com/get-docker/).                       |
| **Node.js** (v16+)      | Used to run project scripts. [Install Node.js](https://nodejs.org/).                                                                             |
| **Python 3** and **uv** | Used to run the ontology-editor and optional memory service. Install [uv](https://docs.astral.sh/uv/) so that `uvx` is on your PATH.             |
| **capa**                | Syncs the agent’s skills and tools from this project. [CAPA](https://capa.infragate.ai/). After cloning, run `capa install` in the project root. |


## Where to put your ontology files

- **Existing ontology**: Put your OWL file(s) in `**src/`**, for example `src/ontology/my-ontology.owl`. The agent will work with whatever you put there.
- **New ontology (OBO/BFO style)**: You can add an ODK config YAML and ask the agent to seed the project, or create an empty OWL file in `src/ontology/` and describe what you want. The agent will ask whether to use BFO and will add imports and alignment.
- **New or existing ontology (SULO)**: Same as above—put OWL in `src/` (e.g. `src/ontology/`). When the agent asks which upper ontology to use, choose SULO; it will add SULO imports and alignment.

Upper ontologies (BFO and SULO) live in `.base/` for reference. You do not add them to your ontology yourself; the agent does that when you choose one.

## Project layout (reference)

```
ontology-builder/
├── capabilities.yaml   # Agent skills and tools (managed by capa)
├── INIT.md             # Agent instructions (for the agent, not you)
├── src/                # Put your ontology files here
│   └── ontology/       # e.g. src/ontology/my-ontology.owl
├── .base/              # BFO and SULO (reference only)
└── skills/             # Agent skills
```

## Optional: long-term memory

The agent can store and recall knowledge (e.g. competency questions, scope) in a local Qdrant instance. It is preconfigured in this project; you only need to set the path to your project’s `.qdrant` folder if you use a custom setup (e.g. via `capa install -e` and a `.env` file).

## References

- [INIT.md](INIT.md) — Agent workflow (for the agent).
- [src/README.md](src/README.md) — Notes on the `src/` layout.

