const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const { body, validationResult } = require("express-validator");
const {
  getListOfTodo,
  Connect,
  removeTodo,
  setTodo,
  updateTodo,
  doesUserExist,
  isLoginValid,
  addUser,
} = require("./db");

app.use(bodyParser.json());

app.post(
  "/login",
  body("user").exists().isLength({ min: 3 }),
  body("pwd").exists().isLength({ min: 3 }),
  body("user").custom(async (value, { req }) => {
    let userExists = await doesUserExist(value);
    if (!userExists) {
      return Promise.reject("user not found");
    } else if (userExists && userExists.password != req.body.pwd) {
      return Promise.reject("wrong password");
    } else {
      return Promise.resolve("logged in successfully");
    }
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      res.status(200).send({ success: 1, error: 0 });
    }
  }
);

app.post(
  "/signup",
  body("user").exists().isLength({ min: 3 }),
  body("pwd").exists().isLength({ min: 3 }),
  body("user").custom(async (value, { req }) => {
    let userExists = await doesUserExist(value);
    if (userExists) {
      return Promise.reject("username already in use");
    }
  }),

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    } else {
      let user = req.body.user;
      let pwd = req.body.pwd;
      let result = await addUser(user, pwd);
      res.status(result.status).send({ success: 1, error: 0, result: result });
    }
  }
);

app.get("/getalltodos", async (req, res) => {
  //return all the todos for a particular user
  let user = req.body.user;
  let result = await getListOfTodo(user);
  res.status(result.status).send(result);
});

app.post("/settodo", async (req, res) => {
  // insert a new todo for this user
  let user = req.body.user;
  let todo = req.body.todo;
  let status = req.body.status;
  let result = await setTodo(user, todo, status);
  res.status(result.status).send(result);
});

app.post("/updatetodo", async (req, res) => {
  //edit the todo based on id
  let id = req.body.id;
  let newTodo = req.body.newTodo;
  let status = req.body.status;
  let result = await updateTodo(id, newTodo, status);
  res.status(result.status).send(result);
});

app.post("/removetodo", async (req, res) => {
  //remove a todo based on id
  let user = req.body.user;
  let id = req.body.id;
  let result = await removeTodo(id);
  res.status(result.status).send(result);
});

app.listen(3001, async () => {
  await Connect();
  console.log("server started at port 3001");
});
