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
////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////

// const express = require("express");
// const bodyParser = require("body-parser");
// const mongoose = require("mongoose");
// const morgan = require("morgan");
// const cors = require("cors");
// const jwt = require("jsonwebtoken");
// const bcrypt = require("bcryptjs");
// const Todo = require("./models/todo");
// const User = require("./models/user");
// require("dotenv").config();

// const app = express();

// // Middleware
// app.use(bodyParser.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(morgan("dev"));
// app.use(express.static("public"));
// app.use(cors());

// // Database connection
// const dbURI = process.env.MONGODB_URI; // Use environment variable for MongoDB URI

// mongoose
//   .connect(dbURI)
//   .then(() => {
//     app.listen(5000, () => {
//       console.log("Server is running on port 5000");
//     });
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB:", err);
//   });

// // Middleware to verify JWT token
// function authenticateToken(req, res, next) {
//   const token = req.headers["authorization"];
//   if (!token)
//     return res
//       .status(401)
//       .json({ message: "Access denied. No token provided." });

//   jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
//     if (err) return res.status(403).json({ message: "Invalid token." });
//     req.user = user;
//     next();
//   });
// }

// // User registration endpoint
// app.post("/register", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = new User({ username, password: hashedPassword });
//     await user.save();
//     res.status(201).json({ message: "User registered successfully" });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // User login endpoint
// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.findOne({ username });
//     if (!user) return res.status(404).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign(
//       { userId: user._id, username: user.username },
//       process.env.JWT_SECRET,
//       { expiresIn: "1h" }
//     );
//     res.json({ token });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET endpoint to fetch all todo items
// app.get("/todos", authenticateToken, async (req, res) => {
//   try {
//     const todos = await Todo.find();
//     res.json(todos);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET endpoint to fetch a single todo item by MongoDB _id
// app.get("/todos/:id", authenticateToken, async (req, res) => {
//   try {
//     const todo = await Todo.findById(req.params.id);
//     if (!todo) return res.status(404).json({ message: "Todo not found" });
//     res.json(todo);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // POST endpoint to create a new todo item
// app.post("/todos", authenticateToken, async (req, res) => {
//   const { title, completed } = req.body;
//   if (!title) return res.status(400).json({ message: "Title is required" });

//   const todo = new Todo({
//     title,
//     completed: completed || false,
//   });

//   try {
//     const newTodo = await todo.save();
//     res.status(201).json(newTodo);
//   } catch (err) {
//     console.error("Error creating todo:", err);
//     res.status(400).json({ message: err.message });
//   }
// });

// // PUT endpoint to update an existing todo item by MongoDB _id
// app.put("/todos/:id", authenticateToken, async (req, res) => {
//   try {
//     const todo = await Todo.findById(req.params.id);
//     if (!todo) return res.status(404).json({ message: "Todo not found" });

//     todo.title = req.body.title || todo.title;
//     todo.completed =
//       req.body.completed !== undefined ? req.body.completed : todo.completed;
//     const updatedTodo = await todo.save();
//     res.json(updatedTodo);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// });

// // DELETE endpoint to remove an existing todo item by MongoDB _id
// app.delete("/todos/:id", authenticateToken, async (req, res) => {
//   try {
//     const result = await Todo.deleteOne({ _id: req.params.id });
//     if (result.deletedCount === 0)
//       return res.status(404).json({ message: "Todo not found" });
//     res.status(204).send();
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // 404 handler
// app.use((req, res) => {
//   res.status(404).send("404 Not Found");
// });
