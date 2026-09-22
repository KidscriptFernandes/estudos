const test = require('node:test');
const assert = require('node:assert/strict');
const express = require('express');
const todoRoutes = require('./todoRoutes');

const createApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api', todoRoutes);
  return app;
};

const runRequest = async (app, method, path, body) => {
  const server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));

  const { port } = server.address();
  try {
    const response = await fetch(`http://localhost:${port}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await response.json();
    return { status: response.status, data };
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }
};

test('deve criar, listar, atualizar e excluir tarefas', async () => {
  const app = createApp();

  const created = await runRequest(app, 'POST', '/api/todos', {
    title: 'Estudar Node.js',
    done: false,
  });

  assert.equal(created.status, 201);
  assert.equal(created.data.success, true);
  assert.equal(created.data.data.title, 'Estudar Node.js');

  const listed = await runRequest(app, 'GET', '/api/todos');
  assert.equal(listed.status, 200);
  assert.equal(listed.data.success, true);
  assert.ok(Array.isArray(listed.data.data));

  const id = created.data.data.id;

  const updated = await runRequest(app, 'PUT', `/api/todos/${id}`, {
    title: 'Estudar Node.js e Express',
    done: true,
  });

  assert.equal(updated.status, 200);
  assert.equal(updated.data.data.title, 'Estudar Node.js e Express');
  assert.equal(updated.data.data.done, true);

  const removed = await runRequest(app, 'DELETE', `/api/todos/${id}`);
  assert.equal(removed.status, 200);
  assert.equal(removed.data.success, true);
  assert.equal(removed.data.data.id, id);
});
