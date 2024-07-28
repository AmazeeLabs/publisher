import * as core from '@actions/core';

import { notifyPublisher } from './lib.js';

core.info('Notifying Publisher');
await notifyPublisher('started');
