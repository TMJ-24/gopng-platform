import * as migration_20260625_084643 from './20260625_084643';
import * as migration_20260702_000000 from './20260702_000000';

export const migrations = [
  {
    up: migration_20260625_084643.up,
    down: migration_20260625_084643.down,
    name: '20260625_084643'
  },
  {
    up: migration_20260702_000000.up,
    down: migration_20260702_000000.down,
    name: '20260702_000000'
  },
];
