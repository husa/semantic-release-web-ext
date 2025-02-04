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

  if (errors.length > 0) {
    throw new AggregateError(errors);
  }

  // notify about default values
  if (!pluginConfig.channel) {
    context.logger.log('channel not defined, using default: listed');
  }
  if (!pluginConfig.sourceDir) {
    context.logger.log('sourceDir not defined, using default: dist');
  }
  if (!pluginConfig.artifactsDir) {
    context.logger.log('artifactsDir not defined, using default: artifacts');
  }

  try {
    const config = getConfig(pluginConfig, context);
    await webExt.cmd.lint({ sourceDir: config.sourceDir });
  } catch (err) {
    throw new SemanticReleaseError('Error linting extension', err.code, err.message);
  }
};
