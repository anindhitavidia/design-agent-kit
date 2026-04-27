# Changelog

All notable changes to design-agent-kit will be documented here.

This project follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and [Semantic Versioning](https://semver.org/).

## [Unreleased]

### Added

- Marketplace `design-agent-kit` with two plugins
- `design-kit` core plugin: 8 agents, 6 skills, 10 commands, 5 JSON Schemas, init scaffolding, session-start hook
- `design-kit-react-nextjs` stack profile: 8 skills, 4 commands implementing the prototype/handoff-prep contract
- Tier-based artifact validation (R/G/F) with JSON Schemas for all 5 artifact types
- `/design-kit:init` interactive setup that scaffolds config and context files
- `design-sprint-runner` skill orchestrating the full 4-stage pipeline
- Vitest test suite: 29 tests covering schemas, init scaffolding, and e2e artifact contract
- GitHub Actions CI for marketplace validation and tests on PR
