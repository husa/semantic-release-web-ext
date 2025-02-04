import path from 'path';
import { readFile, writeFile } from 'fs/promises';
import SemanticReleaseError from '@semantic-release/error';
import { getConfig } from './config.js';

export const prepare = async (pluginConfig, context) => {
  const config = getConfig(pluginConfig, context);

  const manifestPath = path.join(config.sourceDir, 'manifest.json');
  let manifest;
  try {
    manifest = JSON.parse(await readFile(manifestPath, 'utf8'));
  } catch (err) {
    throw new SemanticReleaseError(
      `Error reading manifest file at ${manifestPath}`,
      err.code,
      err.message,
    );
  }
  const manifestVersion = manifest.version;
  const releaseVersion = context.nextRelease?.version;
  if (!releaseVersion) {
    throw new SemanticReleaseError('No release version found');
  }
  if (releaseVersion === manifestVersion) {
    context.logger.log('Release version is the same as the manifest version');
  } else {
    manifest.version = releaseVersion;
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2), { encoding: 'utf8' });
  }
};
