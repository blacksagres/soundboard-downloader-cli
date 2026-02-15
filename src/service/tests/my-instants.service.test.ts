import { describe, test, expect } from "vitest";
import { getSoundNodes } from "../my-instants.service";

describe("searching for sounds returns valid objects", async () => {
  const results = await getSoundNodes("wilhelm scream");

  expect(results).not.empty;

  const randomIndex = Math.floor(Math.random() * results.length);

  const anyOfThem = results[randomIndex];

  test("the download url points to valid .mp3 file", async () => {
    if (!anyOfThem) {
      throw new ReferenceError("Somehow... The random sample object is nil.");
    }

    const mp3Result = await fetch(anyOfThem.download_url);

    expect(mp3Result.ok).toBe(true);
  });
});
