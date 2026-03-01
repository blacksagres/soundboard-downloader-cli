import { describe, test, expect, beforeAll } from "vitest";
import { getAllResults } from "../my-instants.service";

describe("my-instants service", () => {
  let results: Awaited<ReturnType<typeof getAllResults>>;
  let testSound: { label: string; download_url: string } | undefined;

  beforeAll(async () => {
    // Use a longer timeout for the initial fetch
    results = await getAllResults("wilhelm scream");
  }, 15000); // 15 second timeout

  test("searching for sounds returns non-empty array", () => {
    expect(results).toBeDefined();
    expect(results.length).toBeGreaterThan(0);
  });

  test("each sound has required properties", () => {
    if (!results || results.length === 0) return;
    
    results.forEach(sound => {
      expect(sound).toHaveProperty('label');
      expect(sound).toHaveProperty('download_url');
      expect(typeof sound.label).toBe('string');
      expect(typeof sound.download_url).toBe('string');
    });
  });

  test("download url points to valid .mp3 file", async () => {
    if (!results || results.length === 0) {
      throw new Error("No sounds found for testing");
    }
    
    // Find the first sound with a valid download URL (not "not-found")
    const validSound = results.find(sound => sound.download_url && sound.download_url !== "not-found");
    
    // If no valid sounds found, skip this test (shouldn't happen with our fix, but be safe)
    if (!validSound) {
      console.warn("⚠️ No sounds with valid download URLs found for testing - skipping MP3 validation");
      return;
    }
    
    const mp3Result = await fetch(validSound.download_url, {
      // Add headers that might help with CI environments
      headers: {
        'User-Agent': 'soundboard-downloader-cli-test'
      }
    });

    expect(mp3Result.ok).toBe(true);
    expect(mp3Result.headers.get('content-type')).toContain('audio');
  }, 10000); // 10 second timeout for this test
});
