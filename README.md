# Soundboard Downloader CLI

A command-line tool to download soundboard sounds from MyInstants. Built with TypeScript and Node.js.

## Features

- 🔍 Search for sounds by name using interactive prompts
- 🎵 Preview sounds by playing them in your browser
- ⬇️ Download individual sounds to your local machine
- ✨ Simple and easy-to-use interactive interface

## Tech Stack

- **TypeScript** - Type-safe development
- **Node.js** - Runtime environment
- **Inquirer** - Interactive CLI prompts
- **jsdom** - HTML parsing and DOM manipulation
- **ora** - Elegant terminal spinners
- **open** - Opens URLs in the user's browser

## Prerequisites

- Node.js 16.x or higher
- npm (comes with Node.js)

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
npm install -g soundboard-downloader-cli
```

Or from the project directory:

```bash
npm link
```

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
3. **Action**: Decide whether to play the sound in your browser or download it to your `./temp/` directory

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
```

## Development

### Project Structure

```
src/
├── main.ts                          # Entry point
├── api/
│   └── my-instants.api.ts          # API layer for MyInstants
├── components/                      # CLI components
└── service/
    └── my-instants.service.ts      # Business logic
```

### Available Scripts

- `npm start` - Run in development mode with ts-node
- `npm run build` - Compile TypeScript to JavaScript
- `npm test` - Run tests (not yet implemented)

### Download Location

Downloaded sounds are saved to the `./temp/` directory in the project root.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

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
