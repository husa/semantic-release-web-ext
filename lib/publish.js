import { readFile } from 'fs/promises';
import path from 'path';
import { getConfig } from './config.js';
import webExt from 'web-ext';

export const publish = async (pluginConfig, context) => {
  const config = getConfig(pluginConfig, context);

  await webExt.cmd.sign({
    sourceDir: config.sourceDir,
    apiKey: config.apiKey,
    apiSecret: config.apiSecret,
    artifactsDir: config.artifactsDir,
    channel: config.channel,
    amoBaseUrl: config.amoBaseUrl,
    timeout: config.validationTimeout,
    approvalTimeout: config.approvalTimeout,
  });

  const manifest = JSON.parse(await readFile(path.join(config.sourceDir, 'manifest.json'), 'utf8'));
  const extensionId = manifest.browser_specific_settings?.gecko?.id;

  return {
    name: 'Mozilla Add-ons',
    url: `https://addons.mozilla.org/firefox/addon/${extensionId}`,
  };
};
