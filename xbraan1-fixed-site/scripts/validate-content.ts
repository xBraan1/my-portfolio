import { contentProblems } from './lib/content-checks';

const problems = contentProblems();
if (problems.length) {
  console.error(`Content check failed (${problems.length}):\n- ${problems.join('\n- ')}`);
  process.exit(1);
}
console.log('Content check passed.');
