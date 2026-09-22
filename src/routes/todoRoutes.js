const express = require('express');
const mongoose = require('mongoose');
const Todo = require('../models/Todo');
const router = express.Router();

let memoryTodos = [
  { id: 1, title: 'Criar API', done: false },
  { id: 2, title: 'Estudar Swagger', done: true },
];

const isMongoConnected = () => mongoose.connection.readyState === 1;

const serializeTodo = (todo) => ({
  id: todo.id ?? todo._id?.toString?.() ?? todo._id,
  title: todo.title,
  done: Boolean(todo.done),
  createdAt: todo.createdAt,
  updatedAt: todo.updatedAt,
});

router.get('/todos', async (req, res) => {
  if (!isMongoConnected()) {
    return res.status(200).json({ success: true, data: memoryTodos });
  }

  const todos = await Todo.find().sort({ createdAt: -1 });
  return res.status(200).json({ success: true, data: todos.map(serializeTodo) });
});

router.get('/todos/:id', async (req, res) => {
  const { id } = req.params;

  if (!isMongoConnected()) {
    const todo = memoryTodos.find((item) => item.id === Number(id));

    if (!todo) {
      return res.status(404).json({
        success: false,
        error: { message: 'Tarefa não encontrada', statusCode: 404 },
      });
    }

    return res.status(200).json({ success: true, data: todo });
  }

  const todo = await Todo.findById(id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      error: { message: 'Tarefa não encontrada', statusCode: 404 },
    });
  }

  return res.status(200).json({ success: true, data: serializeTodo(todo) });
});

router.post('/todos', async (req, res) => {
  const { title, done = false } = req.body;

  if (!title || typeof title !== 'string' || title.trim() === '') {
    return res.status(400).json({
      success: false,
      error: { message: 'O campo title é obrigatório', statusCode: 400 },
    });
  }

  if (!isMongoConnected()) {
    const newTodo = {
      id: memoryTodos.length ? memoryTodos[memoryTodos.length - 1].id + 1 : 1,
      title: title.trim(),
      done: Boolean(done),
    };

    memoryTodos.push(newTodo);
    return res.status(201).json({ success: true, data: newTodo });
  }

  const todo = await Todo.create({
    title: title.trim(),
    done: Boolean(done),
  });

  return res.status(201).json({ success: true, data: serializeTodo(todo) });
});

router.put('/todos/:id', async (req, res) => {
  const { id } = req.params;
  const { title, done } = req.body;

  if (title !== undefined && (!title || typeof title !== 'string' || title.trim() === '')) {
    return res.status(400).json({
      success: false,
      error: { message: 'O campo title não pode ficar vazio', statusCode: 400 },
    });
  }

  if (!isMongoConnected()) {
    const todoIndex = memoryTodos.findIndex((item) => item.id === Number(id));

    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        error: { message: 'Tarefa não encontrada', statusCode: 404 },
      });
    }

    memoryTodos[todoIndex] = {
      ...memoryTodos[todoIndex],
      title: title !== undefined ? title.trim() : memoryTodos[todoIndex].title,
      done: done !== undefined ? Boolean(done) : memoryTodos[todoIndex].done,
    };

    return res.status(200).json({ success: true, data: memoryTodos[todoIndex] });
  }

  const todo = await Todo.findById(id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      error: { message: 'Tarefa não encontrada', statusCode: 404 },
    });
  }

  if (title !== undefined) todo.title = title.trim();
  if (done !== undefined) todo.done = Boolean(done);

  await todo.save();

  return res.status(200).json({ success: true, data: serializeTodo(todo) });
});

router.delete('/todos/:id', async (req, res) => {
  const { id } = req.params;

  if (!isMongoConnected()) {
    const todoIndex = memoryTodos.findIndex((item) => item.id === Number(id));

    if (todoIndex === -1) {
      return res.status(404).json({
        success: false,
        error: { message: 'Tarefa não encontrada', statusCode: 404 },
      });
    }

    const [deletedTodo] = memoryTodos.splice(todoIndex, 1);
    return res.status(200).json({ success: true, data: deletedTodo });
  }

  const todo = await Todo.findByIdAndDelete(id);

  if (!todo) {
    return res.status(404).json({
      success: false,
      error: { message: 'Tarefa não encontrada', statusCode: 404 },
    });
  }

  return res.status(200).json({ success: true, data: serializeTodo(todo) });
});

module.exports = router;
