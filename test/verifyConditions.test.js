import { jest } from '@jest/globals';
import webExt from 'web-ext';
import { verifyConditions } from '../lib/verifyConditions';
import AggregateError from 'aggregate-error';
import SemanticReleaseError from '@semantic-release/error';

describe('verifyConditions', () => {
  let context;

  beforeEach(() => {
    context = {
      env: {
        WEB_EXT_API_KEY: 'test-api-key',
        WEB_EXT_API_SECRET: 'test-api-secret',
      },
      logger: {
        log: jest.fn(),
      },
    };
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an error if WEB_EXT_API_KEY is not defined', async () => {
    delete context.env.WEB_EXT_API_KEY;

    await expect(verifyConditions({}, context)).rejects.toThrow(AggregateError);
  });

  it('should throw an error if WEB_EXT_API_SECRET is not defined', async () => {
    delete context.env.WEB_EXT_API_SECRET;

    await expect(verifyConditions({}, context)).rejects.toThrow(AggregateError);
  });

  it('should log default values if not provided in pluginConfig', async () => {
    await expect(verifyConditions({}, context)).rejects.toThrow(SemanticReleaseError);

    expect(context.logger.log).toHaveBeenCalledWith('channel not defined, using default: listed');
    expect(context.logger.log).toHaveBeenCalledWith('sourceDir not defined, using default: dist');
    expect(context.logger.log).toHaveBeenCalledWith(
      'artifactsDir not defined, using default: artifacts',
    );
  });

  it('should call webExt.cmd.lint with the correct sourceDir', async () => {
    webExt.cmd.lint = jest.fn();

    await verifyConditions({ sourceDir: 'test/extension' }, context);

    expect(webExt.cmd.lint).toHaveBeenCalledWith(
      { sourceDir: 'test/extension' },
      { shouldExitProgram: false },
    );
  });
});
