const { exec } = require('child_process');

// Direcciones locales que se abrirán al iniciar el proyecto.
const urls = [
  'http://127.0.0.1:3001/health',
  'http://127.0.0.1:5500/'
];

/** Abre una URL usando el comando disponible en el sistema operativo actual. */
function openUrl(url) {
  // Cada plataforma usa un comando distinto para delegar la URL al navegador.
  const command = process.platform === 'win32'
    ? `start "" "${url}"`
    : process.platform === 'darwin'
      ? `open "${url}"`
      : `xdg-open "${url}"`;

  // El fallo al abrir el navegador no debe detener los servicios de la aplicación.
  exec(command, (error) => {
    if (error) {
      console.warn(`No se pudo abrir ${url} automáticamente: ${error.message}`);
    }
  });
}

// Intenta abrir backend y frontend después de que el lanzador los prepara.
urls.forEach(openUrl);
console.log('Se intentó abrir las URLs en el navegador.');
