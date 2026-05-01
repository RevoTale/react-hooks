# Overview
React hooks package built with Bun, tsdown, TypeScript 6, Biome, and Taskfile.

# Base Policy Links (Load First)
- https://github.com/RevoTale/agent-docs/blob/main/doc.md
- https://github.com/RevoTale/agent-docs/blob/main/modules/common/doc.md
- https://github.com/RevoTale/agent-docs/blob/main/modules/taskfile/doc.md
- https://github.com/RevoTale/agent-docs/blob/main/modules/typescript/doc.md
- https://github.com/RevoTale/agent-docs/blob/main/modules/bun/doc.md
- https://github.com/RevoTale/agent-docs/blob/main/modules/react/doc.md
- https://github.com/RevoTale/agent-docs/blob/main/awesome/index.md
- https://github.com/RevoTale/agent-docs/blob/main/awesome/react.md

# Local Details
- Preserve compatibility with the original `l-you/react-hooks` root exports unless a change is intentional and documented.
- Use Bun for dependency management and tests.
- Use tsdown for package bundling.
- Use Biome for linting and formatting; do not add ESLint or Prettier.
- Run `task validate`, `task test`, and `task build` before release changes.
