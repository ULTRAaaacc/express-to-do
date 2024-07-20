const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const morgan = require("morgan");
const Todo = require("./models/todo");
const cors = require("cors");
// Initialize Express.js server and save as a variable
const app = express();

// Middleware

app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(cors());
// MongoDB connection string
const dbURI =
  "mongodb+srv://hasanhammoud746:test123@cluster0.n2twlwn.mongodb.net/todo-app?retryWrites=true&w=majority";

// Connect to MongoDB
mongoose
  .connect(dbURI)
  .then(() => {
    // console.log("Connected to MongoDB database!");
    app.listen(5000, () => {
      console.log("Server is running on port 5000");
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

// GET endpoint to fetch all todo items
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET endpoint to fetch a single todo item by MongoDB _id
app.get("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST endpoint to create a new todo item
// app.post("/todos", async (req, res) => {
//   const todo = new Todo({
//     title: req.body.title,
//     completed: req.body.completed || false,
//   });

//   try {
//     const newTodo = await todo.save();
//     res.status(201).json(newTodo);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });
app.post("/todos", async (req, res) => {
  const { title, completed } = req.body;
  if (!title) {
    return res.status(400).json({ message: "Title is required" });
  }

  const todo = new Todo({
    title,
    completed: completed || false,
  });

  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    console.error("Error creating todo:", err); // Debugging line
    res.status(400).json({ message: err.message });
  }
});

// PUT endpoint to update an existing todo item by MongoDB _id
app.put("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).json({ message: "Todo not found" });
    }
    todo.title = req.body.title || todo.title;
    todo.completed =
      req.body.completed !== undefined ? req.body.completed : todo.completed;
    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// !DELETE endpoint to remove an existing todo item by MongoDB _id
// app.delete("/todos/:id", async (req, res) => {
//   try {
//     const todo = await Todo.findById(req.params.id);
//     if (!todo) {
//       return res.status(404).json({ message: "Todo not found" });
//     }
//     await todo.remove();
//     res.status(204).send();
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });
// DELETE endpoint to remove an existing todo item by MongoDB _id
app.delete("/todos/:id", async (req, res) => {
  try {
    const result = await Todo.deleteOne({ _id: req.params.id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Todo not found" });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("404 Not Found");
});
