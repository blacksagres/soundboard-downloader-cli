import { describe, test, expect, beforeAll } from "vitest";
import { getSoundNodes } from "../my-instants.service";

describe("my-instants service", () => {
  let results: Awaited<ReturnType<typeof getSoundNodes>>;
  let testSound: { label: string; download_url: string } | undefined;

  beforeAll(async () => {
    // Use a longer timeout for the initial fetch
    results = await getSoundNodes("wilhelm scream");
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
    
    // Use the first sound instead of random for consistency
    const firstSound = results[0];
    
    const mp3Result = await fetch(firstSound.download_url, {
      // Add headers that might help with CI environments
      headers: {
        'User-Agent': 'soundboard-downloader-cli-test'
      }
    });

    expect(mp3Result.ok).toBe(true);
    expect(mp3Result.headers.get('content-type')).toContain('audio');
  }, 10000); // 10 second timeout for this test
});
