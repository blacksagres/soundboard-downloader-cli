# @purpleproser/soundboard-downloader-cli

[![npm version](https://img.shields.io/npm/v/@purpleproser/soundboard-downloader-cli?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/@purpleproser/soundboard-downloader-cli)
[![npm downloads](https://img.shields.io/npm/dm/@purpleproser/soundboard-downloader-cli?style=for-the-badge&logo=npm&logoColor=white&color=CB3837)](https://www.npmjs.com/package/@purpleproser/soundboard-downloader-cli)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![Socket Badge](https://badge.socket.dev/npm/package/@purpleproser/soundboard-downloader-cli/1.6.2)](https://badge.socket.dev/npm/package/@purpleproser/soundboard-downloader-cli/1.6.2)

A Node.js command-line tool to download soundboard sounds from [MyInstants](https://myinstants.com).

**📦️ npm package**: [`@purpleproser/soundboard-downloader-cli`](https://www.npmjs.com/package/@purpleproser/soundboard-downloader-cli)

## Features

- 🔍 Search for sounds by name using interactive prompts
- 🎵 Preview sounds by playing them in your browser
- 📁 Downloads are saved directly in your current working directory
- ✨ Simple and easy-to-use interactive interface

## Tech Stack

- **prompts** - Lightweight interactive CLI prompts
- **jsdom** - HTML parsing and DOM manipulation
- **ora** - Elegant terminal spinners
- **opener** - Opens URLs in the user's browser to allow previewing the sound

## Prerequisites

- Node.js 16.x or higher

## Installation

### Local Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/blacksagres/soundboard-downloader-cli.git
   ```

2. Navigate to the project directory:

   ```bash
   cd soundboard-downloader-cli
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

### Global Installation

Install globally to use the `soundboard-downloader` command anywhere:

```bash
npm install -g @purpleproser/soundboard-downloader-cli
```

Or from the project directory:

```bash
npm link
```

**Note**: This package uses the `@purpleproser` npm scope (my npm username) while the GitHub repository remains under `blacksagres`. Make sure to include the `@purpleproser/` prefix when installing!

**For Developers**: If you fork this project and want to publish your own version, either:

1. Use a different package name, or
2. Create your own npm scope and update the package name, or
3. Add `"publishConfig": { "access": "public" }` to your package.json

## Usage

### Development Mode

Run directly with ts-node (no build required):

```bash
npm start
```

### Production Build

Build the TypeScript project:

```bash
npm run build
```

Then run the compiled JavaScript:

```bash
node dist/main.js
```

### Global Command

If installed globally:

```bash
soundboard-downloader
```

### Interactive Workflow

The CLI will guide you through an interactive process:

1. **Search**: You'll be prompted to enter what sound effects you're looking for
2. **Select**: Choose from the list of matching sounds
3. **Action**: Decide whether to play the sound in your browser or download it to your **current working directory**

### Example Workflow

```bash
$ npm start

? What sound effects are you looking for? wilhelm scream
✔ Loading result...
? Which one to download? (Use arrow keys)
  > Wilhelm Scream - Original
    Wilhelm Scream - Remastered
    Wilhelm Scream - Short Version
? Selected: Wilhelm Scream - Original
? (Use arrow keys)
  > Download
    Play
    Show download URL (you can pipe this to other commands)
```

## Development

### Available Scripts

- `npm start` - Run in development mode with ts-node
- `npm run build` - Compile TypeScript to JavaScript
- `npm test` - Run tests (not yet implemented)

### Download Location

Downloaded sounds are saved directly in your current working directory. For example:

```bash
# If you run from /home/user/projects/
cd /home/user/projects/
soundboard-downloader
# Downloads will be saved to: /home/user/projects/wilhelm-scream.mp3
```

**Tip**: Create a dedicated directory for your downloads:

```bash
mkdir my-sounds && cd my-sounds
soundboard-downloader
# All downloads will appear in the my-sounds directory
```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Compliance with MyInstants Terms of Use

This tool is designed to comply with [MyInstants Terms of Use](https://www.myinstants.com/en/terms_of_use.html).

### Compliance Features

✅ **Personal Use Only**
This tool is for personal, non-commercial use only. Commercial use violates MyInstants' terms.

✅ **Official Functionality**
Uses MyInstants' official download buttons and links, exactly as a manual user would.

✅ **No Circumvention**
Does not bypass any access controls, paywalls, or copyright protections.

✅ **Rate Limiting**
Includes 1-second delays between API requests to avoid being flagged as automated scraping.

### User Responsibilities

When using this tool, you agree to:

- **Non-commercial use only** - No business or commercial applications
- **Respect rate limits** - Do not make excessive automated requests
- **Honor copyright** - Respect MyInstants' terms and copyright protections
- **Accept revocable access** - MyInstants may change their terms or block access at any time

### Important Notice

MyInstants grants access to their website under a revocable license. While this tool is designed to comply with their current terms, it may stop working if:
- MyInstants changes their website structure
- MyInstants updates their terms of service
- MyInstants decides to block automated tools

Always check the [current MyInstants Terms of Use](https://www.myinstants.com/en/terms_of_use.html) for the latest requirements.

## Legal Disclaimer

**Important Notice About Copyright and Usage:**

This tool is an automation layer that simulates what a real user would do manually on the MyInstants website. It uses the official download functionality provided by MyInstants and does not bypass any restrictions or access protected content.

**User Responsibility:**

- You are solely responsible for ensuring that your use of downloaded content complies with all applicable laws and MyInstants' Terms of Service
- This application is not responsible for any copyright infringement that may occur through the use of downloaded audio files
- Many sound effects may be copyrighted - check the specific rights and licenses for each sound before using it

**Experimental Nature:**
This project is a simple experiment with Node.js and CLI development. It is provided "as is" without warranty of any kind. The developers are not affiliated with MyInstants and cannot guarantee the continued functionality of this tool.

## License

This project is licensed under the MIT License.
