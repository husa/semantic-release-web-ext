import SemanticReleaseError from '@semantic-release/error';
import AggregateError from 'aggregate-error';
import webExt from 'web-ext';
import { getConfig } from './config.js';

export const verifyConditions = async (pluginConfig, context) => {
  const errors = [];
  // check required environment variables
  if (!context.env.WEB_EXT_API_KEY) {
    errors.push(new SemanticReleaseError('WEB_EXT_API_KEY environment variable not defined'));
  }
  if (!context.env.WEB_EXT_API_SECRET) {
    errors.push(new SemanticReleaseError('WEB_EXT_API_SECRET environment variable not defined'));
  }

  // notify about default values
  if (!pluginConfig.channel && !context.env.WEB_EXT_CHANNEL) {
    context.logger.log('channel not defined, using default: "listed"');
  }
  if (!pluginConfig.sourceDir && !context.env.WEB_EXT_SOURCE_DIR) {
    context.logger.log('sourceDir not defined, using default: "dist"');
  }
  if (!pluginConfig.artifactsDir && !context.env.WEB_EXT_ARTIFACTS_DIR) {
    context.logger.log('artifactsDir not defined, using default: "artifacts"');
  }
  // validate optional configuration
  const config = getConfig(pluginConfig, context);
  if (config.channel !== 'listed' && config.channel !== 'unlisted') {
    errors.push(new SemanticReleaseError('channel must be either "listed" or "unlisted"'));
  }

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }

  try {
    await webExt.cmd.lint({ sourceDir: config.sourceDir }, { shouldExitProgram: false });
  } catch (err) {
    throw new SemanticReleaseError('Error linting extension', err.code, err.message);
  }
};
