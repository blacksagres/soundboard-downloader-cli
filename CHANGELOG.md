# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.1] - 2024-02-14

### Fixed

- Fixed download location to use current working directory instead of project's temp folder
- Removed unnecessary temp/ folder creation logic
- Fixed scoped package publishing configuration with `publishConfig.access: public`
- Removed unused `@types/node` dependency

### Changed

- Updated README with clear download location examples and usage instructions
- Simplified file download logic in main.ts
- Improved documentation about npm scope vs GitHub username

### Added

- CHANGELOG.md for tracking project changes
- Comprehensive release management guide

## [1.0.0] - 2024-02-14

### Added

- Initial release with core functionality
- MyInstants API integration for sound search
- Interactive CLI with @inquirer/prompts
- Sound download functionality with progress indicators
- Browser playback option using open package
- TypeScript source code with full type definitions

### Features

- Search sounds by name
- Preview sounds in browser
- Download sounds to local machine
- Interactive command-line interface

[Unreleased]: https://github.com/blacksagres/soundboard-downloader-cli/compare/v1.0.1...HEAD
[1.0.1]: https://github.com/blacksagres/soundboard-downloader-cli/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/blacksagres/soundboard-downloader-cli/releases/tag/v1.0.0
