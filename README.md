# hackery-practice

A mono-repo of independent practice projects across multiple languages and build tools.

## Structure

```
hackery-practice/
├── scala/          # Scala projects — built with SBT
├── java/           # Java projects  — built with Maven (pom.xml)
├── python/         # Python projects — managed with uv
├── typescript/     # TypeScript/Node/React projects — npm/yarn
└── sql/            # SQL exercises
```

## Projects

### Scala (`scala/`)
| Project | Description |
|---------|-------------|
| [wordle](scala/wordle) | Wordle game implementation |
| [dawkins-weasel](scala/dawkins-weasel) | Dawkins Weasel evolutionary algorithm |

**Build:** `cd scala && sbt compile` / `sbt test`

### TypeScript (`typescript/`)
| Project | Description |
|---------|-------------|
| [minesweeper](typescript/minesweeper) | Full-stack Minesweeper (Node backend + React frontend) |

**Build:** `cd typescript/minesweeper && npm install`

### SQL (`sql/`)
| Project | Description |
|---------|-------------|
| [pokemon](sql/pokemon) | Pokémon data science SQL queries using H2 |

### Java (`java/`)
> No projects yet. Add sub-modules to `java/pom.xml`.

**Build:** `cd java && mvn compile`

### Python (`python/`)
> No projects yet. Add workspace members to `python/pyproject.toml`.

**Build:** `cd python && uv sync`

## Adding a New Project

| Language | Steps |
|----------|-------|
| **Scala** | Create `scala/<name>/src/main/scala/`, add `lazy val <name> = project.in(file("<name>"))` to `scala/build.sbt` |
| **Java** | Create `java/<name>/` with its own `pom.xml`, add `<module><name></module>` to `java/pom.xml` |
| **Python** | `cd python && uv init <name>`, add `"<name>"` to `[tool.uv.workspace] members` in `python/pyproject.toml` |
| **TypeScript** | Create `typescript/<name>/`, add `package.json` |
| **SQL** | Create `sql/<name>/` with `.sql` files |

