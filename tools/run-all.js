const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

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

const root = path.resolve(__dirname, '..');
const children = [];
let shuttingDown = false;

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

function stopAll() {
  shuttingDown = true;
  for (const child of children) {
    if (!child.killed) {
      child.kill(process.platform === 'win32' ? 'SIGINT' : 'SIGTERM');
    }
  }
  setTimeout(() => process.exit(0), 200);
}

function spawnService(proc) {
  const options = {
    cwd: proc.cwd,
    stdio: 'inherit',
    windowsHide: false,
    shell: false
  };

  let command = proc.command;
  let args = proc.args;

  if (process.platform === 'win32' && command.toLowerCase().endsWith('.cmd')) {
    args = ['/c', command, ...proc.args];
    command = 'cmd.exe';
  }

  const child = spawn(command, args, options);

  children.push(child);

  child.on('exit', (code) => {
    if (!shuttingDown) {
      console.error(`${proc.name} terminó con código ${code}`);
      process.exit(code || 1);
    }
  });
}

async function main() {
  for (const proc of processes) {
    const available = await isServiceAvailable(proc.url);

    if (available) {
      console.log(`${proc.name} ya está activo en ${proc.url}; se omite.`);
      continue;
    }

    spawnService(proc);
  }

  setTimeout(() => {
    if (!shuttingDown) {
      openBrowser();
    }
  }, 1500);

  process.stdin.resume();
  process.on('SIGINT', stopAll);
  process.on('SIGTERM', stopAll);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
