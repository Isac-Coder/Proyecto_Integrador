const { exec } = require('child_process');

const urls = [
  'http://127.0.0.1:3001/health',
  'http://127.0.0.1:5500/'
];

function openUrl(url) {
  const command = process.platform === 'win32'
    ? `start "" "${url}"`
    : process.platform === 'darwin'
      ? `open "${url}"`
      : `xdg-open "${url}"`;

  exec(command, (error) => {
    if (error) {
      console.warn(`No se pudo abrir ${url} automáticamente: ${error.message}`);
    }
  });
}

urls.forEach(openUrl);
console.log('Se intentó abrir las URLs en el navegador.');
