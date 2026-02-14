# Soundboard Downloader CLI

A command-line tool to download soundboard sounds from MyInstants.

## Features

- Download individual soundboard sounds by ID
- Search for sounds by name
- Batch download multiple sounds
- Simple and easy-to-use interface

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

### Commands

- **Download a sound by ID**:
  ```bash
  npm start -- --download <sound_id>
  ```

- **Search for sounds**:
  ```bash
  npm start -- --search <query>
  ```

## Configuration

You can configure the download directory and other settings by modifying the configuration file or using environment variables.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.