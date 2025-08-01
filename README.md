# PR Codename GitHub Action

A GitHub Action that turns boring PR numbers into memorable codenames like "tokyo" or "elephant". Because saying "Can you check the london branch?" sounds way better than "Can you check PR #1247?"

Built on top of the [codenames](https://github.com/kriasoft/codenames) library, this action generates deterministic, human-readable names from numbers. Same number in = same name out, every time.

## Why This Exists

You know that moment when someone mentions "PR #1247" in Slack and you have zero idea which one they're talking about? This fixes that. Instead of forgetting numbers, you'll remember names like "tokyo" or "elephant" - because human brains are weird like that.

## Quick Start

```yaml
name: Generate PR Codename
on:
  pull_request:
    types: [opened, synchronize]

jobs:
  codename:
    runs-on: ubuntu-latest
    steps:
      - uses: kriasoft/pr-codename@v1
        id: codename

      - name: Comment with codename
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: `🏷️ **Codename:** ${{ steps.codename.outputs.codename }}`
            })
```

Now your PRs get friendly names automatically. Your teammates will thank you (probably).

## Configuration

### Inputs

| Input      | Description                                                   | Required | Default                |
| ---------- | ------------------------------------------------------------- | -------- | ---------------------- |
| `number`   | Number to convert (auto-detects PR number)                    | No       | Auto-detected          |
| `theme`    | Word theme to use (see available themes below)                | No       | `cities-20`            |
| `template` | Output template with `{codename}` and `{number}` placeholders | No       | -                      |
| `token`    | GitHub token for API access (for push events)                 | No       | `GITHUB_TOKEN` env var |

### Outputs

| Output      | Description                                 | Example                     |
| ----------- | ------------------------------------------- | --------------------------- |
| `codename`  | The generated codename                      | `tokyo`                     |
| `number`    | The input number used                       | `1247`                      |
| `formatted` | Template result (when template is provided) | `https://tokyo.preview.com` |

### Available Themes

Pick your flavor of memorable names:

- [**Animals**](https://github.com/kriasoft/codenames/blob/main/words/animals.txt): [`animals-10`](https://github.com/kriasoft/codenames/blob/main/words/animals-10.ts), [`animals-20`](https://github.com/kriasoft/codenames/blob/main/words/animals-20.ts), [`animals-30`](https://github.com/kriasoft/codenames/blob/main/words/animals-30.ts), [`animals-50`](https://github.com/kriasoft/codenames/blob/main/words/animals-50.ts), [`animals-100`](https://github.com/kriasoft/codenames/blob/main/words/animals-100.ts)
- [**Cities**](https://github.com/kriasoft/codenames/blob/main/words/cities.txt): [`cities-10`](https://github.com/kriasoft/codenames/blob/main/words/cities-10.ts), [`cities-20`](https://github.com/kriasoft/codenames/blob/main/words/cities-20.ts), [`cities-30`](https://github.com/kriasoft/codenames/blob/main/words/cities-30.ts), [`cities-50`](https://github.com/kriasoft/codenames/blob/main/words/cities-50.ts), [`cities-100`](https://github.com/kriasoft/codenames/blob/main/words/cities-100.ts)
- [**Colors**](https://github.com/kriasoft/codenames/blob/main/words/colors.txt): [`colors-10`](https://github.com/kriasoft/codenames/blob/main/words/colors-10.ts), [`colors-20`](https://github.com/kriasoft/codenames/blob/main/words/colors-20.ts), [`colors-30`](https://github.com/kriasoft/codenames/blob/main/words/colors-30.ts), [`colors-50`](https://github.com/kriasoft/codenames/blob/main/words/colors-50.ts), [`colors-100`](https://github.com/kriasoft/codenames/blob/main/words/colors-100.ts)
- [**Food**](https://github.com/kriasoft/codenames/blob/main/words/food.txt): [`food-10`](https://github.com/kriasoft/codenames/blob/main/words/food-10.ts), [`food-20`](https://github.com/kriasoft/codenames/blob/main/words/food-20.ts), [`food-30`](https://github.com/kriasoft/codenames/blob/main/words/food-30.ts), [`food-50`](https://github.com/kriasoft/codenames/blob/main/words/food-50.ts), [`food-100`](https://github.com/kriasoft/codenames/blob/main/words/food-100.ts)
- [**Nature**](<(https://github.com/kriasoft/codenames/blob/main/words/nature.txt)>): [`nature-10`](https://github.com/kriasoft/codenames/blob/main/words/nature-10.ts), [`nature-20`](https://github.com/kriasoft/codenames/blob/main/words/nature-20.ts), [`nature-30`](https://github.com/kriasoft/codenames/blob/main/words/nature-30.ts), [`nature-50`](https://github.com/kriasoft/codenames/blob/main/words/nature-50.ts), [`nature-100`](https://github.com/kriasoft/codenames/blob/main/words/nature-100.ts)
- **Plus**: [`adjectives`](https://github.com/kriasoft/codenames/blob/main/words/adjectives.txt), [`clothing`](https://github.com/kriasoft/codenames/blob/main/words/clothing.txt), [`countries`](https://github.com/kriasoft/codenames/blob/main/words/countries.txt), [`elements`](https://github.com/kriasoft/codenames/blob/main/words/elements.txt), [`emotions`](https://github.com/kriasoft/codenames/blob/main/words/emotions.txt), [`gems`](https://github.com/kriasoft/codenames/blob/main/words/gems.txt), [`snacks`](https://github.com/kriasoft/codenames/blob/main/words/snacks.txt)

The number indicates how many words are in that theme (more words = less chance of repeats, but potentially less memorable names).

## Real-World Examples

### Preview Deployments

Stop squinting at URLs with random hashes:

```yaml
- uses: kriasoft/pr-codename@v1
  id: codename
  with:
    theme: cities-30
    template: "https://{codename}.preview.myapp.com"

- name: Deploy preview
  run: |
    echo "🚀 Deploying to ${{ steps.codename.outputs.formatted }}"
    # Deploy your app here
```

### Container Names

Because `app-1247` is forgettable but `app-elephant` sticks:

```yaml
- uses: kriasoft/pr-codename@v1
  id: codename
  with:
    theme: animals-50

- name: Build and tag container
  run: |
    docker build -t myapp:${{ steps.codename.outputs.codename }} .
    echo "📦 Built container: myapp:${{ steps.codename.outputs.codename }}"
```

### Slack Notifications

Make your notifications actually readable:

```yaml
- uses: kriasoft/pr-codename@v1
  id: codename

- name: Notify team
  run: |
    curl -X POST -H 'Content-type: application/json' \
      --data '{"text":"🎉 The **${{ steps.codename.outputs.codename }}** branch is ready for review!\nPR: ${{ github.event.pull_request.html_url }}"}' \
      ${{ secrets.SLACK_WEBHOOK_URL }}
```

### Feature Branch Identification

Great for long-running feature work:

```yaml
- uses: kriasoft/pr-codename@v1
  id: codename
  with:
    number: ${{ github.event.issue.number }}
    theme: gems-20

- name: Update issue with codename
  uses: actions/github-script@v7
  with:
    script: |
      const { data: issue } = await github.rest.issues.get({
        owner: context.repo.owner,
        repo: context.repo.repo,
        issue_number: context.issue.number
      });

      if (!issue.body.includes('Codename:')) {
        await github.rest.issues.update({
          owner: context.repo.owner,
          repo: context.repo.repo,
          issue_number: context.issue.number,
          body: issue.body + `\n\n**Codename:** ${{ steps.codename.outputs.codename }}`
        });
      }
```

## Advanced Usage

### Custom Numbers

Not just for PRs - works with any number:

```yaml
- uses: kriasoft/pr-codename@v1
  with:
    number: ${{ github.run_number }}
    theme: nature-100
  id: build-name

- run: echo "Build codename: ${{ steps.build-name.outputs.codename }}"
```

### Multiple Themes in One Workflow

```yaml
- name: Generate environment codenames
  run: |
    # Different themes for different purposes
    PREVIEW=$(echo '${{ steps.codename-cities.outputs.codename }}')
    STAGING=$(echo '${{ steps.codename-animals.outputs.codename }}')
    echo "Preview: https://$PREVIEW.preview.com"
    echo "Staging: https://$STAGING.staging.com"
```

## How It Works

The magic happens in the [codenames library](https://github.com/kriasoft/codenames). It uses a deterministic hash function that:

1. Takes your number (like PR #1247)
2. Runs it through a consistent algorithm
3. Maps it to a word from the chosen theme
4. Always gives you the same result for the same input

No randomness, no database, no external calls. Just pure, predictable naming.

## GitHub Token Setup

For push events and other non-PR contexts, the action needs GitHub API access to find the associated PR. Add these permissions to your workflow:

```yaml
jobs:
  codename:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      pull-requests: read # Required for API fallback
    steps:
      - uses: kriasoft/pr-codename@v1
        with:
          token: ${{ secrets.GITHUB_TOKEN }} # Explicit token
```

Or use the environment variable approach:

```yaml
- uses: kriasoft/pr-codename@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # Environment variable
```

The action will gracefully handle missing tokens by falling back to manual number input.

## Common Issues

**Q: Why am I getting "Could not determine number"?**  
A: The action tries to auto-detect PR numbers, but if you're not in a PR context, pass the `number` input manually or ensure proper GitHub token permissions.

**Q: Can I use custom word lists?**  
A: Not directly in this action, but you can fork the [codenames library](https://github.com/kriasoft/codenames) and add your own themes.

**Q: Are the names actually unique?**  
A: Within a theme's word count, yes. But with `animals-10`, you'll get repeats after 10 different numbers. Use larger themes for bigger projects.

## Contributing

Found a bug? Want a feature? The code is pretty straightforward:

- [`index.ts`](./index.ts) - Main action logic
- [`action.yml`](./action.yml) - GitHub Action metadata
- Built on [codenames](https://github.com/kriasoft/codenames)

PRs welcome! (And yes, they'll get codenames too.)

## License

MIT - Use it however you want. Build cool things.

---

_Made with ☕ by [Konstantin Tarkus](https://github.com/koistya) and contributors._
