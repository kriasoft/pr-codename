/**
 * SPDX-FileCopyrightText: 2025-present Kriasoft
 * SPDX-License-Identifier: MIT
 */

import { test, describe } from "node:test";
import assert from "node:assert";
import type { Theme } from "codenames/all";

describe("PR Codename GitHub Action", () => {
  test("should generate codename from number 42", async () => {
    // Simple integration test - import the index and verify basic functionality
    const { codename, themes } = await import("codenames/all");

    // Test that the codename function works with valid themes
    const result = codename(42, "animals-20");
    assert.strictEqual(typeof result, "string");
    assert.ok(result.length > 0);

    // Verify themes array is properly exported
    assert.ok(Array.isArray(themes));
    assert.ok(themes.includes("animals-20"));
    assert.ok(themes.includes("cities-30"));
  });

  test("should have all expected theme categories", async () => {
    const { themes } = await import("codenames/all");

    const categories = [
      "adjectives",
      "animals",
      "cities",
      "clothing",
      "colors",
      "countries",
      "elements",
      "emotions",
      "food",
      "gems",
      "nature",
      "snacks",
    ];
    const sizes = ["10", "20", "30", "50", "100"];

    // Verify we have themes for each category and size
    for (const category of categories) {
      for (const size of sizes) {
        const themeName = `${category}-${size}`;
        assert.ok(
          themes.includes(themeName as Theme),
          `Missing theme: ${themeName}`,
        );
      }
    }
  });

  test("should generate consistent codenames", async () => {
    const { codename } = await import("codenames/all");

    // Same input should always produce same output
    const result1 = codename(123, "animals-20");
    const result2 = codename(123, "animals-20");
    assert.strictEqual(result1, result2);

    // Different inputs should produce different outputs
    const result3 = codename(456, "animals-20");
    assert.notStrictEqual(result1, result3);
  });

  test("should handle different theme types", async () => {
    const { codename } = await import("codenames/all");

    const testCases = [
      { theme: "animals-20", input: 42 },
      { theme: "cities-30", input: 42 },
      { theme: "colors-10", input: 42 },
      { theme: "food-50", input: 42 },
    ];

    for (const { theme, input } of testCases) {
      const result = codename(input, theme as Theme);
      assert.strictEqual(typeof result, "string");
      assert.ok(result.length > 0);
    }
  });

  test("should throw error for invalid theme", async () => {
    const { codename } = await import("codenames/all");

    assert.throws(() => {
      codename(42, "invalid-theme" as Theme);
    }, /Unknown theme/);
  });
});
