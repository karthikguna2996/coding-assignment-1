let express = require("express");
let app = express();
app.use(express.json());
let { open } = require("sqlite");
let sqlite3 = require("sqlite3");
let path = require("path");
let dbPath = path.join(__dirname, "todoApplication.db");
let db = null;
var format = require("date-fns/format");
var isValid = require("date-fns/isValid");

let connectDatabase = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3003, () => {
      console.log("server started");
    });
  } catch (err) {
    console.log(`there is an ${err.message}`);
    process.exit(1);
  }
};
connectDatabase();

let middleWareFunctionGet = (request, response, next) => {
  let { search_q, status, priority, category, date } = request.query;
  let priorityValues = ["HIGH", "MEDIUM", "LOW"];
  let statusValues = [`TO DO`, `IN PROGRESS`, `DONE`];
  let categoryValues = [`WORK`, `HOME`, `LEARNING`];
  if (status !== undefined) {
    let isStatusValid = statusValues.some((val) => {
      if (val === `${status}`) {
        return true;
      }
    });

    if (isStatusValid === false) {
      response.status(400);
      response.send("Invalid Todo Status");
    } else {
      next();
    }
  } else if (priority !== undefined) {
    let isPriorityValid = priorityValues.some((val) => {
      if (val === `${priority}`) {
        return true;
      }
    });

    if (isPriorityValid === false) {
      response.status(400);
      response.send("Invalid Todo Priority");
    } else {
      next();
    }
  } else if (category !== undefined) {
    let isCategoryValid = categoryValues.some((val) => {
      if (val === `${category}`) {
        return true;
      }
    });

    if (isCategoryValid === false) {
      response.status(400);
      response.send("Invalid Todo Category");
    } else {
      next();
    }
  } else if (date !== undefined) {
    console.log("duedateDefined");
    let validDate = isValid(new Date(date));
    if (validDate === false) {
      response.status(400);
      response.send("Invalid Due Date");
    } else {
      next();
    }
  } else if (search_q !== undefined) {
    next();
  }
};
let middleWareFunctionPut = (request, response, next) => {
  let { todo, status, priority, category, dueDate } = request.body;
  console.log(todo);
  let { todoId } = request.params;
  let priorityValues = ["HIGH", "MEDIUM", "LOW"];
  let statusValues = [`TO DO`, `IN PROGRESS`, `DONE`];
  let categoryValues = [`WORK`, `HOME`, `LEARNING`];
  if (status !== undefined) {
    let isStatusValid = statusValues.some((val) => {
      if (val === `${status}`) {
        return true;
      }
    });

    if (isStatusValid === false) {
      response.status(400);
      response.send("Invalid Todo Status");
    } else {
      next();
    }
  } else if (priority !== undefined) {
    let isPriorityValid = priorityValues.some((val) => {
      if (val === `${priority}`) {
        return true;
      }
    });

    if (isPriorityValid === false) {
      response.status(400);
      response.send("Invalid Todo Priority");
    } else {
      next();
    }
  } else if (category !== undefined) {
    let isCategoryValid = categoryValues.some((val) => {
      if (val === `${category}`) {
        return true;
      }
    });

    if (isCategoryValid === false) {
      response.status(400);
      response.send("Invalid Todo Category");
    } else {
      next();
    }
  } else if (dueDate !== undefined) {
    let validDate = isValid(new Date(`${dueDate}`));
    console.log(validDate);
    if (validDate === false) {
      response.status(400);
      response.send("Invalid Due Date");
    } else {
      next();
    }
  } else if (
    todo === undefined &&
    status === undefined &&
    priority === undefined &&
    category === undefined &&
    dueDate === undefined &&
    todoId !== undefined
  ) {
    next();
  } else if (todo !== undefined) {
    next();
  }
};

let middleWareFunctionPost = (request, response, next) => {
  let { todo, status, priority, category, dueDate } = request.body;
  let { todoId } = request.params;
  let priorityValues = ["HIGH", "MEDIUM", "LOW"];
  let statusValues = [`TO DO`, `IN PROGRESS`, `DONE`];
  let categoryValues = [`WORK`, `HOME`, `LEARNING`];

  let isStatusValid = statusValues.some((val) => {
    if (val === `${status}`) {
      return true;
    }
  });
  console.log(isStatusValid);
  let isPriorityValid = priorityValues.some((val) => {
    if (val === `${priority}`) {
      return true;
    }
  });
  let isCategoryValid = categoryValues.some((val) => {
    if (val === `${category}`) {
      return true;
    }
  });
  let validDate = isValid(new Date(`${dueDate}`));

  if (isStatusValid === false) {
    response.status(400);
    response.send("Invalid Todo Status");
  } else if (isPriorityValid === false) {
    response.status(400);
    response.send("Invalid Todo Priority");
  } else if (isCategoryValid === false) {
    response.status(400);
    response.send("Invalid Todo Category");
  } else if (validDate === false) {
    response.status(400);
    response.send("Invalid Due Date");
  } else {
    next();
  }
};

app.get(`/todos/`, middleWareFunctionGet, async (request, response) => {
  let { search_q, status, priority, category, due_date } = request.query;
  console.log(search_q);
  if (
    status !== undefined &&
    priority === undefined &&
    category === undefined &&
    due_date === undefined
  ) {
    let getQuery1 = `
               SELECT id,todo,priority,status,category,due_date AS dueDate
               FROM todo
               WHERE status = '${status}'
        `;

    let getResponse1 = await db.all(getQuery1);
    response.send(getResponse1);
  } else if (
    status === undefined &&
    priority !== undefined &&
    category === undefined &&
    due_date === undefined
  ) {
    let getQuery2 = `
               SELECT id,todo,priority,status,category,due_date AS dueDate
               FROM todo
               WHERE priority = '${priority}'
        `;
    let getResponse2 = await db.all(getQuery2);
    response.send(getResponse2);
  } else if (
    status !== undefined &&
    priority !== undefined &&
    category === undefined &&
    due_date === undefined
  ) {
    let getQuery3 = `
               SELECT id,todo,priority,status,category,due_date AS dueDate
               FROM todo
               WHERE priority = '${priority}' AND status = '${status}'
        `;
    let getResponse3 = await db.all(getQuery3);
    response.send(getResponse3);
  } else if (
    status !== undefined &&
    priority === undefined &&
    category !== undefined &&
    due_date === undefined
  ) {
    let getQuery4 = `
               SELECT id,todo,priority,status,category,due_date AS dueDate
               FROM todo
               WHERE category = '${category}' AND status = '${status}'
        `;
    let getResponse4 = await db.all(getQuery4);
    response.send(getResponse4);
  } else if (
    status === undefined &&
    priority !== undefined &&
    category !== undefined &&
    due_date === undefined
  ) {
    let getQuery5 = `
               SELECT id,todo,priority,status,category,due_date AS dueDate
               FROM todo
               WHERE category = '${category}' AND priority = '${priority}'
        `;
    let getResponse5 = await db.all(getQuery5);
    response.send(getResponse5);
  } else if (
    status === undefined &&
    priority === undefined &&
    category !== undefined &&
    due_date === undefined
  ) {
    let getQuery6 = `
               SELECT id,todo,priority,status,category,due_date AS dueDate
               FROM todo
               WHERE category = '${category}'
        `;
    let getResponse6 = await db.all(getQuery6);
    response.send(getResponse6);
  } else {
    let getQuery7 = `
               SELECT id,todo,priority,status,category,due_date AS dueDate
               FROM todo
               WHERE todo LIKE '%${search_q}%'
        `;
    let getResponse7 = await db.all(getQuery7);
    response.send(getResponse7);
  }
});

app.get(`/todos/:todoId/`, async (request, response) => {
  let { todoId } = request.params;
  let getQueryId = `
          SELECT id,todo,priority,status,category,due_date AS dueDate
          FROM todo
          WHERE id = ${todoId}
    `;
  let getResponseId = await db.get(getQueryId);
  response.send(getResponseId);
});

app.get(`/agenda/`, middleWareFunctionGet, async (request, response) => {
  let { date } = request.query;
  console.log(date);
  let dueDate = format(new Date(`${date}`), `yyyy-MM-dd`);
  console.log(dueDate);
  let getQueryDate = `
               SELECT id,todo,priority,status,category,due_date AS dueDate
               FROM todo
               WHERE  due_date LIKE '${dueDate}'

           `;
  let getResponseDate = await db.all(getQueryDate);
  response.send(getResponseDate);
});

app.post(`/todos/`, middleWareFunctionPost, async (request, response) => {
  let { id, todo, priority, status, category, dueDate } = request.body;
  let due_Date = format(new Date(`${dueDate}`), `yyyy-MM-dd`);
  console.log(due_Date);
  let postQuery = `
               INSERT INTO todo(id,todo,priority,status,category,due_date)
               VALUES (${id},'${todo}','${priority}','${status}','${category}','${due_Date}');
    `;
  await db.run(postQuery);
  response.send("Todo Successfully Added");
});

app.put(`/todos/:todoId/`, middleWareFunctionPut, async (request, response) => {
  let { id, todo, priority, status, category, dueDate } = request.body;
  console.log(todo);
  let { todoId } = request.params;
  console.log(todoId);
  if (
    status !== undefined &&
    priority === undefined &&
    category === undefined &&
    dueDate === undefined
  ) {
    let putQuery = `
        UPDATE todo
        SET status = '${status}'
        WHERE id = ${todoId}
    `;
    await db.run(putQuery);
    response.send("Status Updated");
  } else if (
    status === undefined &&
    priority !== undefined &&
    category === undefined &&
    dueDate === undefined
  ) {
    let putQuery = `
        UPDATE todo
        SET priority = '${priority}'
        WHERE id = ${todoId}
    `;
    await db.run(putQuery);
    response.send("Priority Updated");
  } else if (todo !== undefined) {
    let putQuery = `
        UPDATE todo
        SET todo = '${todo}'
        WHERE id = ${todoId}
    `;
    await db.run(putQuery);
    response.send("Todo Updated");
  } else if (
    status === undefined &&
    priority === undefined &&
    category !== undefined &&
    dueDate === undefined
  ) {
    let putQuery = `
        UPDATE todo
        SET category = '${category}'
        WHERE id = ${todoId}
    `;
    await db.run(putQuery);
    response.send("Category Updated");
  } else {
    let putQuery = `
        UPDATE todo
        SET  due_date = '${dueDate}'
        WHERE id = ${todoId}
    `;
    await db.run(putQuery);
    response.send("Due Date Updated");
  }
});

app.delete(`/todos/:todoId/`, async (request, response) => {
  let { todoId } = request.params;
  let deleteQuery = `
          DELETE FROM todo WHERE id = ${todoId}
      `;
  await db.run(deleteQuery);
  response.send("Todo Deleted");
});

module.exports = app;

