import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizarRolParaFrontend } from './role.mjs';

test('normaliza roles profesionales con variaciones de texto', () => {
  assert.equal(normalizarRolParaFrontend('profesional'), 'profesional');
  assert.equal(normalizarRolParaFrontend('Profecional'), 'profesional');
  assert.equal(normalizarRolParaFrontend('PROFESIONAL'), 'profesional');
  assert.equal(normalizarRolParaFrontend('cuidador'), 'cuidador');
});
