// import { VerifyConditionsContext } from 'semantic-release';

//amoBaseUrl,
//apiKey,
//apiProxy,
//apiSecret,
//artifactsDir,
//ignoreFiles = [],
//sourceDir,
//timeout,
//approvalTimeout,
//channel,
//amoMetadata,
//uploadSourceCode,
//webextVersion

// export type PluginConfig = {
//   channel?: 'listed' | 'unlisted';
//   sourceDir?: string;
//   artifactsDir?: string;
//   approvalTimeout?: number;
//   validationTimeout?: number;
// };

// export type Config = {
//   apiKey: string;
//   apiSecret: string;
//   channel: 'listed' | 'unlisted';
//   sourceDir: string;
//   artifactsDir: string;
//   approvalTimeout?: number;
//   validationTimeout?: number;
// };

const tryToNumber = (n) => {
  if (typeof n === 'string' && !isNaN(parseInt(n))) {
    return parseInt(n);
  }
};

export const getConfig = (pluginConfig, context) => {
  return {
    apiKey: context.env.WEB_EXT_API_KEY,
    apiSecret: context.env.WEB_EXT_API_SECRET,
    channel: pluginConfig.channel || context.env.WEB_EXT_CHANNEL || 'listed',
    sourceDir: pluginConfig.sourceDir || context.env.WEB_EXT_SOURCE_DIR || 'dist',
    artifactsDir: pluginConfig.artifactsDir || context.env.WEB_EXT_ARTIFACTS_DIR || 'artifacts',
    approvalTimeout:
      pluginConfig.approvalTimeout || tryToNumber(context.env.WEB_EXT_APPROVAL_TIMEOUT),
    validationTimeout:
      pluginConfig.validationTimeout || tryToNumber(context.env.WEB_EXT_VALIDATION_TIMEOUT),
    amoBaseUrl:
      pluginConfig.amoBaseUrl ||
      context.env.WEB_EXT_AMO_BASE_URL ||
      'https://addons.mozilla.org/api/v5/',
  };
};
