# Amazee Labs Publisher action

To be used in combination with
[`@amazeelabs/publisher`](https://github.com/AmazeeLabs/silverback-mono/tree/development/packages/npm/%40amazeelabs/publisher).

The action does:

- In `pre` hook:
  - Notifies Publisher API about the start of the build
- In the main step:
  - Sets environment variables for the next steps
  - Restores cache
- In `post` hook:
  - Updates cache
  - Notifies Publisher API about the end of the build

Example workflow:

```yml
name: FE Build

# Must contain "[env: {env}]" in the name
run-name: 'FE Build [env: ${{ inputs.env }}]'

on:
  workflow_dispatch:
    inputs:
      env:
        description: 'Environment ID'
        required: true
      env_vars:
        description: 'Env vars to pass to Publisher action'
        required: true
      callback_url:
        description: 'Callback to pass to Publisher action'
        required: true

concurrency:
  group: fe-build-${{ inputs.env }}

jobs:
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      # Checkout, prepare, etc.

      - name: Publisher
        uses: AmazeeLabs/publisher@SHA
        with:
          success_env_var_name: BUILD_IS_SUCCESSFUL
          callback_url: ${{ inputs.callback_url }}
          cache_paths: |
            apps/website/.cache
            apps/website/public
          cache_key: fe-build-cache-${{ inputs.env }}
          env_vars: ${{ inputs.env_vars }}

      - name: Build & deploy
        run: do_stuff && echo "BUILD_IS_SUCCESSFUL=1" >> $GITHUB_ENV
```
