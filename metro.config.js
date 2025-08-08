const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Rive 파일 지원 추가
config.resolver.assetExts.push('riv');

module.exports = config; 