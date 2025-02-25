export const tryToNumber = (n) => {
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
      typeof pluginConfig.approvalTimeout !== 'undefined'
        ? pluginConfig.approvalTimeout
        : tryToNumber(context.env.WEB_EXT_APPROVAL_TIMEOUT),
    validationTimeout:
      typeof pluginConfig.validationTimeout !== 'undefined'
        ? pluginConfig.validationTimeout
        : tryToNumber(context.env.WEB_EXT_VALIDATION_TIMEOUT),
    amoBaseUrl:
      pluginConfig.amoBaseUrl ||
      context.env.WEB_EXT_AMO_BASE_URL ||
      'https://addons.mozilla.org/api/v5/',
  };
};
