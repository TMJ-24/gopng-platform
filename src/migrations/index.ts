import * as migration_20260625_084643 from './20260625_084643';
import * as migration_20260702_000000 from './20260702_000000';
import * as migration_20260702_000001 from './20260702_000001';
import * as migration_20260702_000002 from './20260702_000002';
import * as migration_20260702_000003 from './20260702_000003';
import * as migration_20260703_000000_templates_category_values from './20260703_000000_templates_category_values';
import * as migration_20260703_000001_seed_templates from './20260703_000001_seed_templates';
import * as migration_20260703_000002_pages_layout_blocks from './20260703_000002_pages_layout_blocks';
import * as migration_20260703_000003_sites_navigation_children from './20260703_000003_sites_navigation_children';

export const migrations = [
  {
    up: migration_20260625_084643.up,
    down: migration_20260625_084643.down,
    name: '20260625_084643',
  },
  {
    up: migration_20260702_000000.up,
    down: migration_20260702_000000.down,
    name: '20260702_000000',
  },
  {
    up: migration_20260702_000001.up,
    down: migration_20260702_000001.down,
    name: '20260702_000001',
  },
  {
    up: migration_20260702_000002.up,
    down: migration_20260702_000002.down,
    name: '20260702_000002',
  },
  {
    up: migration_20260702_000003.up,
    down: migration_20260702_000003.down,
    name: '20260702_000003',
  },
  {
    up: migration_20260703_000000_templates_category_values.up,
    down: migration_20260703_000000_templates_category_values.down,
    name: '20260703_000000_templates_category_values',
  },
  {
    up: migration_20260703_000001_seed_templates.up,
    down: migration_20260703_000001_seed_templates.down,
    name: '20260703_000001_seed_templates',
  },
  {
    up: migration_20260703_000002_pages_layout_blocks.up,
    down: migration_20260703_000002_pages_layout_blocks.down,
    name: '20260703_000002_pages_layout_blocks',
  },
  {
    up: migration_20260703_000003_sites_navigation_children.up,
    down: migration_20260703_000003_sites_navigation_children.down,
    name: '20260703_000003_sites_navigation_children'
  },
];
