/**
 * SPDX-FileCopyrightText: 2025-present Kriasoft
 * SPDX-License-Identifier: MIT
 */

import js from "@eslint/js";
import ts from "typescript-eslint";

/**
 * ESLint configuration.
 *
 * @link {https://eslint.org/docs/latest/use/configure/}
 * @link {https://typescript-eslint.io/getting-started}
 */
export default ts.config(
  js.configs.recommended,
  ts.configs.recommended,
  {
    ignores: ["dist/**"],
  },
  {
    files: ["**/*.test.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
);
