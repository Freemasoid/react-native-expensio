const { getDefaultConfig } = require("expo/metro-config");

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Fix for Victory Native module resolution issue
// See: https://github.com/FormidableLabs/victory-native-xl/issues/579
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
