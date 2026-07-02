import * as migration_20260625_084643 from './20260625_084643';
import * as migration_20260702_000000 from './20260702_000000';
import * as migration_20260702_000001 from './20260702_000001';
import * as migration_20260702_000002 from './20260702_000002';

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
  {
    up: migration_20260702_000001.up,
    down: migration_20260702_000001.down,
    name: '20260702_000001'
  },
  {
    up: migration_20260702_000002.up,
    down: migration_20260702_000002.down,
    name: '20260702_000002'
  },
];
