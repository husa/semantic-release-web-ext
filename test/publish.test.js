import { jest } from '@jest/globals';
import webExt from 'web-ext';

jest.unstable_mockModule('fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
}));
const { readFile } = await import('fs/promises');
const { publish } = await import('../lib/publish');

describe('publish', () => {
  let context;
  let pluginConfig;

  beforeEach(() => {
    webExt.cmd.sign = jest.fn();
    readFile.mockResolvedValue(
      JSON.stringify({ browser_specific_settings: { gecko: { id: 'test-id' } } }),
    );
    context = {
      env: {
        WEB_EXT_API_KEY: 'test-api-key',
        WEB_EXT_API_SECRET: 'test-api-secret',
      },
      logger: {
        log: jest.fn(),
      },
    };
    pluginConfig = {};
  });

  it('should call webExt.cmd.sign with the correct parameters', async () => {
    const config = {
      sourceDir: 'dist',
      apiKey: 'test-api-key',
      apiSecret: 'test-api-secret',
      artifactsDir: 'artifacts',
      channel: 'listed',
      amoBaseUrl: 'https://addons.mozilla.org',
      validationTimeout: 300000,
      approvalTimeout: 600000,
    };

    await publish(config, context);

    expect(webExt.cmd.sign).toHaveBeenCalledWith({
      sourceDir: config.sourceDir,
      apiKey: config.apiKey,
      apiSecret: config.apiSecret,
      artifactsDir: config.artifactsDir,
      channel: config.channel,
      amoBaseUrl: config.amoBaseUrl,
      timeout: config.validationTimeout,
      approvalTimeout: config.approvalTimeout,
    });
  });

  it('should handle errors thrown by webExt.cmd.sign', async () => {
    webExt.cmd.sign.mockImplementation(() => {
      throw new Error('sign error');
    });

    console.log = jest.fn();

    await expect(publish(pluginConfig, context)).rejects.toThrow('sign error');
  });

  it('should return link to extension', async () => {
    expect(await publish(pluginConfig, context)).toEqual({
      name: 'Mozilla Add-ons',
      url: 'https://addons.mozilla.org/firefox/addon/test-id',
    });
  });
});
