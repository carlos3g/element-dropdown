const path = require('path');
const escape = require('escape-string-regexp');
const { getDefaultConfig } = require('expo/metro-config');
const pak = require('../package.json');

const root = path.resolve(__dirname, '..');

// The library declares react and react-native as peers. On web, Metro rewrites
// `react-native` imports to `react-native-web`, so we also need to hoist
// `react-native-web` and `react-dom` here to avoid resolution drift.
const modules = [
  ...Object.keys({ ...pak.peerDependencies }),
  'react-native-web',
  'react-dom',
];

const config = getDefaultConfig(__dirname);

config.projectRoot = __dirname;
config.watchFolders = [root];

// Make sure only one version of each peer dep is loaded — block copies that
// resolve at the repo root so Metro always picks this app's copy.
config.resolver.blockList = new RegExp(
  modules
    .map((m) => `^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
    .join('|')
);

config.resolver.extraNodeModules = modules.reduce((acc, name) => {
  acc[name] = path.join(__dirname, 'node_modules', name);
  return acc;
}, {});

module.exports = config;
