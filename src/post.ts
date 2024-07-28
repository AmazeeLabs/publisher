import * as cache from '@actions/cache';
import * as core from '@actions/core';

import { clearCache, config, notifyPublisher } from './lib.js';

const isSuccess = config.successEnvVarName in process.env;

if (isSuccess && config.cache) {
  core.info('Deleting previous cache');
  await clearCache();

  core.info('Saving cache');
  try {
    const savedKey = await cache.saveCache(
      config.cache.paths,
      config.cache.key,
    );
    if (!savedKey) {
      core.warning('Cache not saved');
    }
  } catch (error) {
    core.warning(`Failed to save cache: ${error}`);
  }
}

core.info('Notifying Publisher');
await notifyPublisher({ status: isSuccess ? 'success' : 'failure' });
