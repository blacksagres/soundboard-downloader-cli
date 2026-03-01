# API Mocking System

This directory contains the API mocking system for the soundboard downloader CLI.

## Overview

The mocking system allows you to switch between real API calls to myinstants.com and mock data for testing purposes. This is particularly useful for:

- Running tests in CI environments (GitHub Actions, etc.)
- Avoiding rate limiting issues
- Having predictable test data
- Faster test execution
- Offline development

## Files

- `api-config.ts` - Configuration system for switching between real and mock API
- `my-instants.api.ts` - Main API layer with conditional mock support
- `my-instants.api.mock.ts` - Mock implementation with predictable test data

## Usage

### In Tests

```typescript
import { setApiMode } from "./api/api-config";
import { getPaginatedResults, getAllResults } from "./service/my-instants.service";

// Switch to mock mode before running tests
beforeAll(() => {
  setApiMode("mock");
});

// Now all API calls will use mock data
test("pagination works", async () => {
  const results = await getPaginatedResults("test", 1);
  // results will contain predictable mock data
});
```

### In Development

```typescript
import { setApiMode, getApiMode, isMockMode } from "./api/api-config";

// Check current mode
console.log(`Current mode: ${getApiMode()}`); // 'real' or 'mock'
console.log(`Using mock: ${isMockMode()}`); // true or false

// Switch modes
setApiMode("mock"); // Use mock data
setApiMode("real"); // Use real API
```

## Mock Data Structure

The mock API provides predictable test data:

- **14 total sounds** in the mock database
- **6 sounds per page** for pagination
- **Valid download URLs** for all sounds
- **Consistent labels** (Wilhelm Scream, THX Deep Note, Test Sound 1-12)

### Example Mock Results

**Pagination (Page 1):**
```json
[
  {"label": "Wilhelm Scream", "download_url": "https://.../test-sound.mp3"},
  {"label": "THX Deep Note", "download_url": "https://.../test-sound.mp3"},
  {"label": "Test Sound 1", "download_url": "https://.../test-sound.mp3"},
  {"label": "Test Sound 2", "download_url": "https://.../test-sound.mp3"},
  {"label": "Test Sound 3", "download_url": "https://.../test-sound.mp3"},
  {"label": "Test Sound 4", "download_url": "https://.../test-sound.mp3"}
]
```

**Fetch All:**
- Returns all 14 sounds sorted alphabetically
- Same structure as pagination results

## CI Integration

The mock API is automatically used in CI environments. In your GitHub Actions workflow:

```yaml
- name: Run tests
  run: npm test
  env:
    NODE_ENV: test
```

The test file automatically detects CI environments and uses mock data.

## Benefits

1. **Reliability**: Tests don't depend on external API availability
2. **Speed**: Mock responses are instantaneous
3. **Predictability**: Always get the same test data
4. **No Rate Limiting**: Avoid GitHub Actions IP blocking
5. **Offline Testing**: Can run tests without internet connection

## Implementation Details

The mock system works by:

1. **Intercepting API calls**: Each function in `my-instants.api.ts` checks `isMockMode()`
2. **Returning mock data**: If in mock mode, calls the corresponding mock function
3. **Maintaining interface**: Mock functions have the same signature as real functions
4. **HTML templates**: Mock functions return HTML strings that match the real site structure

The mock HTML templates include the necessary DOM structure that the service layer expects to parse.

## Adding More Mock Data

To add more test sounds, edit the `mockSounds` array in `my-instants.api.mock.ts`:

```typescript
const mockSounds = [
  ...existingSounds,
  {
    label: "New Test Sound",
    detail_url: "/en/instant/new-test-sound/"
  }
];
```

The system will automatically handle pagination based on the array length.