import { jest } from '@jest/globals';
import SemanticReleaseError from '@semantic-release/error';
import path from 'path';

jest.unstable_mockModule('fs/promises', () => ({
  readFile: jest.fn(),
  writeFile: jest.fn(),
}));

const { readFile, writeFile } = await import('fs/promises');
const { prepare } = await import('../lib/prepare');

describe('prepare', () => {
  let context;
  let pluginConfig;

  beforeEach(() => {
    jest.resetModules();
    context = {
      env: {
        WEB_EXT_API_KEY: 'test-api-key',
        WEB_EXT_API_SECRET: 'test-api-secret',
      },
      logger: {
        log: jest.fn(),
      },
      nextRelease: {
        version: '1.0.1',
      },
    };
    pluginConfig = {};
  });

  it('should throw an error if manifest file cannot be read', async () => {
    readFile.mockRejectedValue(new Error('File not found'));

    await expect(prepare({}, context)).rejects.toThrow(SemanticReleaseError);
  });

  it('should throw an error if no release version is found', async () => {
    context.nextRelease = null;

    await expect(prepare(pluginConfig, context)).rejects.toThrow(SemanticReleaseError);
    expect(readFile).toHaveBeenCalledWith(path.join('dist', 'manifest.json'), 'utf8');
  });

  it('should log if release version is the same as manifest version', async () => {
    readFile.mockResolvedValue(JSON.stringify({ version: '1.0.1' }));

    await prepare(pluginConfig, context);

    expect(context.logger.log).toHaveBeenCalledWith(
      'Release version is the same as the manifest version',
    );
  });

  it('should update the manifest version if different from release version', async () => {
    readFile.mockResolvedValue(JSON.stringify({ version: '1.0.0' }));
    writeFile.mockResolvedValue();

    await prepare(pluginConfig, context);

    expect(writeFile).toHaveBeenCalledWith(
      path.join('dist', 'manifest.json'),
      JSON.stringify({ version: '1.0.1' }, null, 2),
      { encoding: 'utf8' },
    );
  });
});
