/**
 * PR Codename GitHub Action
 *
 * This GitHub Action generates deterministic, human-readable codenames from
 * pull request numbers. It uses a curated list of words to create friendly
 * hashes that can be used as deployment environment names, feature branch
 * identifiers, or other readable references.
 *
 * Requirements:
 * - Maintain TypeScript compatibility with Node.js v24 native TS support
 * - Use @actions/core for GitHub Actions input/output handling
 * - Use @actions/github for GitHub API integration when needed
 * - Use the 'codenames' package for deterministic codename generation
 * - Follow existing error handling patterns with setFailed()
 * - Keep the implementation lightweight and focused on the core functionality
 * - Ensure the action works with GitHub's runner environment
 *
 * SPDX-FileCopyrightText: 2025-present Kriasoft
 * SPDX-License-Identifier: MIT
 */

import { getInput, setOutput, setFailed } from "@actions/core";
import { context, getOctokit } from "@actions/github";
import { codename, themes, type Theme } from "codenames/all";

/**
 * Retrieves the PR number from various GitHub Action contexts.
 *
 * This function attempts to determine the PR number through multiple methods in priority order,
 * ensuring compatibility with different GitHub Action trigger events (pull_request, push, etc.).
 *
 * Requirements:
 * - Must return a valid PR number (positive integer) or null if none found
 * - Must handle various GitHub Action event types (pull_request, pull_request_target, push, etc.)
 * - Must validate and parse string inputs to ensure integer return type
 * - Should minimize API calls by checking local context first
 * - Must handle API failures gracefully without throwing errors
 *
 * Detection methods (in priority order):
 * 1. Explicit "number" input parameter - for manual override
 * 2. Pull request event payload (context.payload.pull_request.number) - for PR events
 * 3. Issue context (context.issue.number) - works for PR-triggered workflows
 * 4. GitHub API lookup by commit SHA - fallback for push events on PR branches
 *
 * @returns {Promise<number | null>} The number if found, null otherwise
 *
 * @example
 * // In a pull_request event: returns PR number from payload
 * // In a push event to PR branch: uses API to find associated PR
 * // With number input "123": returns 123
 * // In a workflow_dispatch without context: returns null
 */
async function getNumber(): Promise<number | null> {
  // Method 1: Explicit input parameter
  const explicitNumber = getInput("number");
  if (explicitNumber !== "") {
    const parsed = parseInt(explicitNumber, 10);
    if (isNaN(parsed) || parsed < 0) {
      console.log(`Invalid number input: "${explicitNumber}"`);
      return null;
    }
    return parsed;
  }

  // Method 2: Direct from PR events
  if (context.payload.pull_request?.number) {
    return context.payload.pull_request.number;
  }

  // Method 3: From issue context (works for PRs too)
  if (context.issue.number) {
    return context.issue.number;
  }

  // Method 4: API fallback using commit SHA
  const token = getInput("token") || process.env.GITHUB_TOKEN;
  if (!token) {
    console.log("No GITHUB_TOKEN provided for API fallback");
    return null;
  }

  const github = getOctokit(token);
  const sha = context.sha;

  try {
    // Try to find PR associated with current commit
    const { data: pulls } =
      await github.rest.repos.listPullRequestsAssociatedWithCommit({
        owner: context.repo.owner,
        repo: context.repo.repo,
        commit_sha: sha,
      });

    if (pulls.length > 0) {
      return pulls[0].number;
    }

    // Fallback: Search through open PRs by head SHA
    const { data: openPulls } = await github.rest.pulls.list({
      owner: context.repo.owner,
      repo: context.repo.repo,
      state: "open",
    });

    const matchingPR = openPulls.find((pr) => pr.head.sha === sha);
    return matchingPR?.number || null;
  } catch (error) {
    console.log("API fallback failed:", error);
    return null;
  }
}

try {
  const number = await getNumber();

  if (number === null) {
    setFailed("Could not determine number from context or API");
    process.exit(1);
  }

  const themeInput = getInput("theme") || "cities-20";

  if (!themes.includes(themeInput as Theme)) {
    setFailed(
      `Invalid theme "${themeInput}". Available themes: ${themes.join(", ")}`,
    );
    process.exit(1);
  }

  const name = codename(number, themeInput as Theme);
  const template = getInput("template");

  setOutput("codename", name);
  setOutput("number", number.toString());

  if (template) {
    const formatted = template
      .replace(/\{codename\}/g, name)
      .replace(/\{number\}/g, number.toString());
    setOutput("formatted", formatted);
  }
} catch (err) {
  setFailed((err as Error).message);
}
