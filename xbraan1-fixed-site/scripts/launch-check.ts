import { launchGaps } from './lib/content-checks';

const gaps = launchGaps();
if (gaps.length === 0) console.log('All owner details are filled in.');
else {
  console.log('Details still to be supplied by the owner (hidden from the site until then):');
  for (const g of gaps) console.log(`  - ${g}`);
}
if (process.argv.includes('--strict') && gaps.some((g) => !g.includes('optional') && !g.startsWith('features.'))) process.exit(1);
