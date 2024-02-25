// api/server.js
const express = require('express');
const cors = require('cors');
const userModel = require('./users/model'); // Import the database access functions

const app = express();

app.use(express.json());
app.use(cors()); // Enable CORS middleware if you're doing the stretch goal with React

// POST /api/users - Create a user
app.post('/api/users', async (req, res) => {
  try {
    const { name, bio } = req.body;
    if (!name || !bio) {
      return res.status(400).json({ message: "Please provide name and bio for the user" });
    }
    const newUser = await userModel.insert({ name, bio });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: "There was an error while saving the user to the database" });
  }
});

// GET /api/users - Return all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "The users information could not be retrieved" });
  }
});

// GET /api/users/:id - Return a user by id
app.get('/api/users/:id', async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "The user with the specified ID does not exist" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "The user information could not be retrieved" });
  }
});

// DELETE /api/users/:id - Delete a user by id
app.delete('/api/users/:id', async (req, res) => {
  try {
    const user = await userModel.remove(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "The user with the specified ID does not exist" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "The user could not be removed" });
  }
});

// PUT /api/users/:id - Update a user by id
app.put('/api/users/:id', async (req, res) => {
  try {
    const { name, bio } = req.body;
    if (!name || !bio) {
      return res.status(400).json({ message: "Please provide name and bio for the user" });
    }
    const updatedUser = await userModel.update(req.params.id, { name, bio });
    if (!updatedUser) {
      return res.status(404).json({ message: "The user with the specified ID does not exist" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: "The user information could not be modified" });
  }
});

module.exports = app;
