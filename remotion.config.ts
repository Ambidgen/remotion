import {Config} from '@remotion/cli/config';
import {existsSync} from 'node:fs';
import path from 'node:path';

Config.setOverwriteOutput(true);
Config.setVideoImageFormat('jpeg');

// This sandbox has no system Chrome and cannot reach Remotion's browser CDN.
// `npm run setup:browser` unpacks an npm-hosted Chromium into .cache; use it
// only when it exists, so normal local setups keep Remotion's default browser.
const localBrowser = path.join(process.cwd(), '.cache/chromium/chrome-wrapper.sh');
if (existsSync(localBrowser)) {
  Config.setBrowserExecutable(localBrowser);
}
