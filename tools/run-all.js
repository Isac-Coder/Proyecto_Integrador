const { spawn } = require('child_process');
const http = require('http');
const path = require('path');

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
      child.kill('SIGTERM');
    }
  }
  setTimeout(() => process.exit(0), 200);
}

function spawnService(proc) {
  const child = spawn(proc.command, proc.args, {
    cwd: proc.cwd,
    stdio: 'inherit',
    shell: false
  });

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

  process.stdin.resume();
  process.on('SIGINT', stopAll);
  process.on('SIGTERM', stopAll);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
