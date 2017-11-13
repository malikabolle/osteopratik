const fs = require('fs');
const glob = require('glob');

glob('./dist/**/**', {}, (error, files) => {
  let str = '';
  let timestamp = +new Date();
  str += `CACHE MANIFEST
# ${timestamp}

CACHE:
`;

  for (fileName of files) {
    if (
      !fileName.includes('service-worker') &&
      !fileName.includes('sw') &&
      !fileName.includes('manifest') &&
      !fileName.includes('app-cache')
    ) {
      str += `${fileName}\n`;
    }
  }

  str += `
NETWORK:
*

FALLBACK:
/ /

SETTINGS:
prefer-online
`;

  fs.writeFileSync(
    './dist/app-cache.manifest',
    str.replace(/\.\/dist\//gm, '').replace(/\.\/dist/gm, '')
  );
});
