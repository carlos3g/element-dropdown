import path from 'path';
import { dangerReassure } from 'reassure';

// `__dirname` is CommonJS-only; this file is loaded as ESM (via the
// `import` syntax above + danger@13's loader). Resolve relative to
// the repo cwd instead — danger always runs from the repo root.
dangerReassure({
  inputFilePath: path.resolve('./.reassure/output.md'),
});
