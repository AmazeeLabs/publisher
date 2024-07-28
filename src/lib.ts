import * as core from '@actions/core';

type Inputs = {
  successEnvVarName: string;
  callbackUrl: string;
  cacheKey: string;
  cachePaths: Array<string>;
  envVars: Record<string, string>;
  githubToken: string;
};

function getInputs(): Inputs {
  try {
    return {
      successEnvVarName: core.getInput('success_env_var_name'),
      callbackUrl: core.getInput('callback_url'),
      cacheKey: core.getInput('cache_key'),
      cachePaths: core
        .getInput('cache_paths')
        .split('\n')
        .map((path) => path.trim())
        .filter(Boolean),
      envVars: JSON.parse(core.getInput('env_vars')),
      githubToken: core.getInput('github_token'),
    };
  } catch (error) {
    core.setFailed(`Failed to get inputs: ${error}`);
    process.exit(1);
  }
}

export const inputs = getInputs();

export const notifyPublisher = async (status: string): Promise<void> => {
  try {
    await fetch(inputs.callbackUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        status,
      }),
    });
  } catch (error) {
    core.warning(`Failed to notify Publisher: ${error}`);
  }
};
