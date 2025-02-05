import { getConfig, tryToNumber } from '../lib/config.js';

describe('tryToNumber', () => {
  it('should return the number if it is a string', () => {
    expect(tryToNumber('123')).toEqual(123);
  });

  it('should return undefined if it is not a string', () => {
    expect(tryToNumber(123)).toBeUndefined();
    expect(tryToNumber()).toBeUndefined();
    const env = {};
    expect(tryToNumber(env.SOME_VAR)).toBeUndefined();
    expect(tryToNumber(null)).toBeUndefined();
  });

  it('should return undefined if it is not a number', () => {
    expect(tryToNumber('abc')).toBeUndefined();
  });
});

describe('getConfig', () => {
  const context = {
    env: {
      WEB_EXT_API_KEY: 'test-api-key',
      WEB_EXT_API_SECRET: 'test-api-secret',
      WEB_EXT_CHANNEL: 'unlisted',
      WEB_EXT_SOURCE_DIR: 'src',
      WEB_EXT_ARTIFACTS_DIR: 'build',
      WEB_EXT_APPROVAL_TIMEOUT: '300000',
      WEB_EXT_VALIDATION_TIMEOUT: '60000',
      WEB_EXT_AMO_BASE_URL: 'https://addons.mozilla.org/api/v4/',
    },
  };

  it('should populate values from ENV', () => {
    const pluginConfig = {};
    const config = getConfig(pluginConfig, context);

    expect(config).toEqual({
      apiKey: 'test-api-key',
      apiSecret: 'test-api-secret',
      channel: 'unlisted',
      sourceDir: 'src',
      artifactsDir: 'build',
      approvalTimeout: 300000,
      validationTimeout: 60000,
      amoBaseUrl: 'https://addons.mozilla.org/api/v4/',
    });
  });

  it('should override ENV values with pluginConfig', () => {
    const pluginConfig = {
      channel: 'listed',
      sourceDir: 'dist',
      artifactsDir: 'artifacts',
      approvalTimeout: 500000,
      validationTimeout: 120000,
      amoBaseUrl: 'https://addons.mozilla.org/api/v5/',
    };
    const config = getConfig(pluginConfig, context);

    expect(config).toEqual({
      apiKey: 'test-api-key',
      apiSecret: 'test-api-secret',
      channel: 'listed',
      sourceDir: 'dist',
      artifactsDir: 'artifacts',
      approvalTimeout: 500000,
      validationTimeout: 120000,
      amoBaseUrl: 'https://addons.mozilla.org/api/v5/',
    });
  });

  it('should populate default values', () => {
    const config = getConfig({}, { env: {} });

    expect(config).toEqual({
      apiKey: undefined,
      apiSecret: undefined,
      channel: 'listed',
      sourceDir: 'dist',
      artifactsDir: 'artifacts',
      approvalTimeout: undefined,
      validationTimeout: undefined,
      amoBaseUrl: 'https://addons.mozilla.org/api/v5/',
    });
  });

  it('should accept 0 as timeout value', () => {
    const pluginConfig = {
      approvalTimeout: 0,
      validationTimeout: 0,
    };
    const config = getConfig(pluginConfig, context);

    expect(config).toEqual({
      apiKey: 'test-api-key',
      apiSecret: 'test-api-secret',
      channel: 'unlisted',
      sourceDir: 'src',
      artifactsDir: 'build',
      approvalTimeout: 0,
      validationTimeout: 0,
      amoBaseUrl: 'https://addons.mozilla.org/api/v4/',
    });
  });
});
