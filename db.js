const { Pool, Client } = require("pg");

var pool;
const Connect = () => {
  pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "postgres",
    password: "admin",
    port: 5432,
  });
};

const queryResolver = async (query) => {
  let data = {};
  let res = await pool
    .query(query)
    .then((res) => {
      console.log("res : ", res);
      data.res = res.rows;
      data.status = 200;
      return data;
    })
    .catch((err) => {
      console.log("error for query  : ", query, err);
      data.err = err;
      data.status = 500;
      return data;
    });
  return data;
};

const getListOfTodo = async (user) => {
  let query = `select * from todolist where username = '${user}'`;
  let result = await queryResolver(query);
  return result;
};

const setTodo = async (user, todo, status) => {
  let query = `insert into todolist(todo,username,status) values('${todo}','${user}','${status}'); `;
  let result = await queryResolver(query);
  return result;
};

const updateTodo = async (id, todo) => {
  let query = `update todolist set todo = '${todo}' where id ='${id}';`;
  let result = await queryResolver(query);
  return result;
};

const removeTodo = async (id) => {
  let query = `delete from todolist where id = ${id}`;
  let result = await queryResolver(query);
  return result;
};

const doesUserExist = async (user) => {
  let query = `select * from todousers where username='${user}' limit 1`;
  let result = await queryResolver(query);
  return result.res[0]
};

const isLoginValid = async(user,pwd) =>{
    let query = `select * from todousers where username ='${user}' and password='${pwd}'`;
    let result = await queryResolver(query);
    return result.res[0]
}

const addUser = async (user, pwd) => {
  let query = `insert into todousers (username,password) values('${user}','${pwd}')`;
  let result = await queryResolver(query);
  return result;
};

module.exports = {
  getListOfTodo,
  Connect,
  removeTodo,
  setTodo,
  updateTodo,
  doesUserExist,
  addUser,
  isLoginValid
};
