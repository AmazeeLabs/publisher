import * as cache from '@actions/cache';
import * as core from '@actions/core';

import { inputs } from './lib.js';

core.info('Setting environment variables');
try {
  for (const key in inputs.envVars) {
    core.exportVariable(key, inputs.envVars[key]);
  }
} catch (error) {
  core.setFailed(`Failed to set environment variables: ${error}`);
  process.exit(1);
}

core.info('Restoring cache');
try {
  const restoredKey = await cache.restoreCache(
    inputs.cachePaths,
    inputs.cacheKey,
  );
  if (!restoredKey) {
    core.warning('Cache not found');
  }
} catch (error) {
  core.warning(`Failed to restore cache: ${error}`);
}
