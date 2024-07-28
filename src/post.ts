import * as cache from '@actions/cache';
import * as core from '@actions/core';
import { Octokit } from '@octokit/rest';

import { inputs, notifyPublisher } from './lib.js';

const isSuccess = inputs.successEnvVarName in process.env;

if (isSuccess) {
  core.info('Deleting previous cache');
  try {
    const octokit = new Octokit({ auth: inputs.githubToken });
    const [owner, repo] = process.env.GITHUB_REPOSITORY!.split('/');
    await octokit.actions.deleteActionsCacheByKey({
      key: inputs.cacheKey,
      owner,
      repo,
    });
  } catch (error) {
    core.setFailed(`Failed to save cache: ${error}`);
    core.error(
      'Probably you need to give both "read" and "write" permissions to the "GITHUB_TOKEN". The easiest way to do this is to update Actions settings of the repository.',
    );
    await notifyPublisher('failure');
    process.exit(1);
  }

  core.info('Saving cache');
  try {
    const savedKey = await cache.saveCache(inputs.cachePaths, inputs.cacheKey);
    if (!savedKey) {
      core.warning('Cache not saved');
    }
  } catch (error) {
    core.warning(`Failed to save cache: ${error}`);
  }
}

core.info('Notifying Publisher');
await notifyPublisher(isSuccess ? 'success' : 'failure');
