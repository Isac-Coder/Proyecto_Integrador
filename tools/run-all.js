const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

/** Ejecuta el script auxiliar que abre las direcciones locales en el navegador. */
function openBrowser() {
  const scriptPath = path.join(__dirname, 'open-browser.js');
  const child = spawn(process.execPath, [scriptPath], {
    cwd: root,
    stdio: 'inherit',
    shell: false
  });

  child.on('error', (error) => {
    console.error('No se pudo abrir el navegador:', error.message);
  });
}

// Ruta base del repositorio y procesos iniciados por este lanzador.
const root = path.resolve(__dirname, '..');
const children = [];
let shuttingDown = false;

// Definición de los servicios que conforman la aplicación local.
const processes = [
  {
    name: 'backend',
    cwd: path.join(root, 'Back'),
    command: process.platform === 'win32' ? 'npm.cmd' : 'npm',
    args: ['start'],
    url: 'http://127.0.0.1:3001/health'
  },
  {
    name: 'frontend',
    cwd: path.join(root, 'Front', 'Diseño_1'),
    command: process.platform === 'win32' ? 'npm.cmd' : 'npm',
    args: ['start'],
    url: 'http://127.0.0.1:5500/'
  }
];

/** Comprueba si un servicio ya responde para no iniciar una segunda instancia. */
function isServiceAvailable(url) {
  return new Promise((resolve) => {
    const req = http.get(url, (res) => {
      res.resume();
      resolve(res.statusCode >= 200 && res.statusCode < 500);
    });

    req.on('error', () => resolve(false));
    req.setTimeout(1500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

/** Detiene de forma coordinada los procesos secundarios al cerrar el lanzador. */
function stopAll() {
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) {
      child.kill(process.platform === 'win32' ? 'SIGINT' : 'SIGTERM');
    }
  }
  setTimeout(() => process.exit(0), 200);
}

/** Inicia un servicio con su directorio y comando de ejecución correspondientes. */
function spawnService(proc) {
  const options = {
    cwd: proc.cwd,
    stdio: 'inherit',
    windowsHide: false,
    shell: false
  };

  let command = proc.command;
  let args = proc.args;

  // En Windows, los scripts .cmd se ejecutan mediante cmd.exe.
  if (process.platform === 'win32' && command.toLowerCase().endsWith('.cmd')) {
    args = ['/c', command, ...proc.args];
    command = 'cmd.exe';
  }

  const child = spawn(command, args, options);

  children.push(child);

  // Si un servicio se detiene inesperadamente, termina también el lanzador.
  child.on('exit', (code) => {
    if (!shuttingDown) {
      console.error(`${proc.name} terminó con código ${code}`);
      process.exit(code || 1);
    }
  });
}

/** Coordina el arranque, apertura del navegador y manejo de señales del sistema. */
async function main() {
  for (const proc of processes) {
    // Reutiliza una instancia existente cuando el puerto ya está atendiendo solicitudes.
    const available = await isServiceAvailable(proc.url);

    if (available) {
      console.log(`${proc.name} ya está activo en ${proc.url}; se omite.`);
      continue;
    }

    spawnService(proc);
  }

  // Espera brevemente para que los servidores estén disponibles antes de abrir URLs.
  setTimeout(() => {
    if (!shuttingDown) {
      openBrowser();
    }
  }, 1500);

  // Mantiene el proceso principal activo y permite detenerlo con Ctrl + C.
  process.stdin.resume();
  process.on('SIGINT', stopAll);
  process.on('SIGTERM', stopAll);
}

// Informa cualquier error no controlado durante la coordinación de servicios.
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
