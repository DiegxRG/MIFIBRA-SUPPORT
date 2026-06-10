import { setupWorker } from 'msw/browser';
import { authHandlers } from './handlers/authHandlers';
import { whitelistHandlers } from './handlers/whitelistHandlers';
import { blacklistHandlers } from './handlers/blacklistHandlers';

export const worker = setupWorker(...authHandlers, ...whitelistHandlers, ...blacklistHandlers);
