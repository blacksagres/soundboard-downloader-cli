# Soundboard Downloader CLI

A command-line tool to download soundboard sounds from MyInstants.

## Features

- Search for sounds by name using interactive prompts
- Preview sounds by playing them in your browser
- Download individual sounds to your local machine
- Simple and easy-to-use interactive interface

## Installation

1. Clone this repository:

   ```bash
   git clone https://github.com/yourusername/soundboard-downloader-cli.git
   ```

2. Navigate to the project directory:

   ```bash
   cd soundboard-downloader-cli
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

## Usage

### Build the project

```bash
npm run build
```

### Run the CLI

```bash
npm start
```

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

## Configuration

You can configure the download directory and other settings by modifying the configuration file or using environment variables.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
