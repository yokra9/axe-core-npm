import * as fs from 'fs';
import * as path from 'path';
import * as colors from 'colors';
import { AxeResults } from 'axe-core';

export const saveOutcome = (
  outcome: AxeResults | AxeResults[],
  fileName?: string,
  dir?: string
): string => {
  if (typeof fileName !== 'string') {
    fileName = 'axe-results-' + Date.now() + '.json';
  }
  /* istanbul ignore if */
  if (typeof dir !== 'string') {
    dir = process.cwd();
  } else if (!path.isAbsolute(dir)) {
    dir = path.join(process.cwd(), dir);
  }

  const filePath = path.join(dir, fileName);

  /* istanbul ignore else */
  if (!fs.existsSync(filePath)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, JSON.stringify(outcome, null, 2), 'utf-8');
  return filePath;
};

export const parseUrl = (url: string): string => {
  if (!/[a-z]+:\/\//.test(url)) {
    return 'http://' + url;
  }
  return url;
};

export const parseBrowser = (browser?: string): string | Error => {
  if (!browser) {
    return 'chrome-headless';
  }

  const l = browser.length;
  switch (browser.toLowerCase()) {
    case 'ff':
    case 'firefox'.substr(0, l):
    case 'gecko'.substr(0, l):
    case 'marionette'.substr(0, l):
      return 'firefox';

    case 'chrome'.substr(0, l):
      return 'chrome';

    case 'ie':
    case 'explorer'.substr(0, l):
    case 'internetexplorer'.substr(0, l):
    case 'internet_explorer'.substr(0, l):
    case 'internet-explorer'.substr(0, l):
      return 'ie';

    case 'safari'.substr(0, l):
      return 'safari';

    case 'edge'.substr(0, l):
    case 'microsoftedge'.substr(0, l):
      return 'MicrosoftEdge';

    default:
      throw new Error('Unknown browser ' + browser);
  }
};

export const getAxeSource = (axePath?: string) => {
  // Abort if axePath should exist, and it isn't
  if (axePath && !fs.existsSync(axePath)) {
    return;
    // Look for axe in current working directory
  } else if (!axePath) {
    axePath = path.join(process.cwd(), 'axe.js');
  }

  if (!fs.existsSync(axePath)) {
    // Look for axe in CDW ./node_modules
    axePath = path.join(process.cwd(), 'node_modules', 'axe-core', 'axe.js');
  }
  /* istanbul ignore if */
  if (!fs.existsSync(axePath)) {
    // if all else fails, use the locally installed axe
    /* istanbul ignore next */
    axePath = path.join(__dirname, 'node_modules', 'axe-core', 'axe.js');
  }

  return fs.readFileSync(axePath, { encoding: 'utf-8' });
};

export const getAxeVersion = (source: string): string => {
  const match = source.match(/\.version\s*=\s'([^']+)'/);
  return match ? match[1] : 'unknown version';
};

export const splitList = (val: string): string[] => {
  return val.split(/[,;]/).map(str => str.trim());
};

export const selectorToString = (
  selectors: string[],
  separator?: string
): string => {
  separator = separator || ' ';
  return selectors
    .reduce((prev, curr) => prev.concat(curr as never), [])
    .join(separator);
};

export const reporter = (
  noReporter: boolean,
  silentMode: boolean
): (() => void) => {
  if (!noReporter || silentMode) {
    return () => {};
  } else {
    return (...args: string[]) => {
      console.log(...args);
    };
  }
};

export const link = colors.underline.blue;
export const error = colors.red.bold;
export const bold = colors.bold;
export const green = colors.green;
export const italics = colors.italic;
