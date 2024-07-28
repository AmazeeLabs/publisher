import * as cache from '@actions/cache';
import * as core from '@actions/core';

import { config, fail } from './lib.js';

if (config.publisherPayload.environmentVariables) {
  core.info('Setting environment variables');
  try {
    for (const [key, value] of Object.entries(
      config.publisherPayload.environmentVariables,
    )) {
      core.exportVariable(key, value);
    }
  } catch (error) {
    await fail(`Failed to set environment variables: ${error}`);
  }
}

if (config.cache && !config.publisherPayload.clearCache) {
  core.info('Restoring cache');
  try {
    const restoredKey = await cache.restoreCache(
      config.cache.paths,
      config.cache.key,
    );
    if (!restoredKey) {
      core.info('Cache not found');
    }
  } catch (error) {
    core.warning(`Failed to restore cache: ${error}`);
  }
}
