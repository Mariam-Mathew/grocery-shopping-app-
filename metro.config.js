const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;

const config = getDefaultConfig(projectRoot);

// Add support for expo-router and path aliases
config.resolver.alias = {
  "@": projectRoot,
};

config.resolver.nodeExts = ["js", "json", "ts", "tsx"];

// Exclude other projects from watch folders to prevent naming collisions
config.watchFolders = [projectRoot];

// Exclude problematic paths
config.resolver.blockList = [/.*\/Projects\/IdeenProjects\/.*/];

module.exports = config;
