const test = require('node:test');
const assert = require('node:assert/strict');
const { connectDatabase } = require('../src/config/database');
const { login, register } = require('../src/controllers/auth.controller');

test('login valida credenciales contra la base de datos', async () => {
  const req = {
    body: {
      email: 'registro-test-1784093368342@zoecare.com',
      password: 'prueba123'
    }
  };

  let responseBody;
  let statusCode;

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    json(payload) {
      responseBody = payload;
      return this;
    }
  };

  await login(req, res);

  assert.equal(statusCode, undefined);
  assert.equal(responseBody.success, true);
  assert.equal(responseBody.user.email, 'registro-test-1784093368342@zoecare.com');
  assert.equal(responseBody.user.rol, 'profesional');
});

test('register guarda un usuario nuevo en la base de datos y permite login', async () => {
  const email = `registro-test-${Date.now()}@zoecare.com`;

  const registerReq = {
    body: {
      nombre: 'Usuario de Prueba',
      email,
      password: 'prueba123',
      rol: 'profesional'
    }
  };

  let registerResponse;
  const registerRes = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      registerResponse = payload;
      return this;
    }
  };

  await register(registerReq, registerRes);

  assert.equal(registerResponse.success, true);
  assert.equal(registerResponse.user.email, email);
  assert.equal(registerResponse.user.rol, 'profesional');

  const pool = await connectDatabase();
  const dbResult = await pool.query('SELECT nombre FROM public.usuarios_sistema WHERE correo_electronico = $1', [email]);
  assert.equal(dbResult.rows[0].nombre, 'Usuario de Prueba');

  const loginReq = {
    body: {
      email,
      password: 'prueba123'
    }
  };

  let loginResponse;
  const loginRes = {
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      loginResponse = payload;
      return this;
    }
  };

  await login(loginReq, loginRes);

  assert.equal(loginResponse.success, true);
  assert.equal(loginResponse.user.email, email);
  assert.equal(loginResponse.user.rol, 'profesional');
});
