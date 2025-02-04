import { getConfig } from './config';
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
};
