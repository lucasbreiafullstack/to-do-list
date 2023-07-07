// Seleção de elementos
const toDoForm = document.querySelector("#to-do-form");
const toDoInput = document.querySelector("#to-do-input");
const toDoList = document.querySelector("#to-do-list");
const editForm = document.querySelector("#edit-form");
const editInput = document.querySelector("#edit-input");
const cancelEditBtn = document.querySelector("#cancel-edit-btn");
const searchInput = document.querySelector("#search-input");
const eraseBtn = document.querySelector("#erase-button");
const filterBtn = document.querySelector("#filter-select");

let oldInputValue;
let todos = [];

// Funções

const saveToLocalStorage = () => {
  localStorage.setItem("todos", JSON.stringify(todos));
};

const getFromLocalStorage = () => {
  const savedTodos = localStorage.getItem("todos");
  todos = savedTodos ? JSON.parse(savedTodos) : [];
};

const saveToDo = (taskId, taskName, done = 0) => {
  const toDo = document.createElement("div");
  toDo.classList.add("to-do");
  toDo.dataset.taskId = taskId;

  const toDoTitle = document.createElement("h3");
  toDoTitle.innerText = taskName;
  toDo.appendChild(toDoTitle);

  const doneBtn = document.createElement("button");
  doneBtn.classList.add("finish-to-do");
  doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
  toDo.appendChild(doneBtn);

  const editBtn = document.createElement("button");
  editBtn.classList.add("edit-to-do");
  editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
  toDo.appendChild(editBtn);

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("remove-to-do");
  deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>';
  toDo.appendChild(deleteBtn);

  toDoList.appendChild(toDo);

  const todoItem = { id: taskId, name: taskName, done: done };
  todos.push(todoItem);
  saveToLocalStorage();

  toDoInput.value = "";
  toDoInput.focus();
};

const toggleForms = () => {
  editForm.classList.toggle("hide");
  toDoForm.classList.toggle("hide");
  toDoList.classList.toggle("hide");
};

const updateToDo = (taskId, taskName) => {
  const toDoTitleElements = document.querySelectorAll(".to-do h3");

  toDoTitleElements.forEach((toDoTitle) => {
    if (toDoTitle.dataset.taskId === taskId) {
      toDoTitle.innerText = taskName;
    }
  });

  todos.forEach((todo) => {
    if (todo.id === taskId) {
      todo.name = taskName;
    }
  });

  saveToLocalStorage();
};

const getSearchedTodos = (search) => {
  const toDoElements = document.querySelectorAll(".to-do");

  toDoElements.forEach((toDoElement) => {
    const toDoTitle = toDoElement.querySelector("h3").innerText.toLowerCase();

    toDoElement.style.display = "flex";

    if (!toDoTitle.includes(search)) {
      toDoElement.style.display = "none";
    }
  });
};

const filterTodos = (filterValue) => {
  const toDoElements = document.querySelectorAll(".to-do");

  switch (filterValue) {
    case "all":
      toDoElements.forEach((toDoElement) => (toDoElement.style.display = "flex"));
      break;

    case "done":
      toDoElements.forEach((toDoElement) =>
        toDoElement.classList.contains("done")
          ? (toDoElement.style.display = "flex")
          : (toDoElement.style.display = "none")
      );
      break;

    case "todo":
      toDoElements.forEach((toDoElement) =>
        !toDoElement.classList.contains("done")
          ? (toDoElement.style.display = "flex")
          : (toDoElement.style.display = "none")
      );
      break;

    default:
      break;
  }
};

// Eventos
toDoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const taskName = toDoInput.value;

  if (taskName) {
    postTaskBackend(taskName);
  }
});

document.addEventListener("click", (e) => {
  const targetEl = e.target;
  const parentEl = targetEl.closest("div");
  let taskId, taskName;

  if (parentEl && parentEl.querySelector("h3")) {
    taskId = parentEl.dataset.taskId;
    taskName = parentEl.querySelector("h3").innerText;
  }

  if (targetEl.classList.contains("finish-to-do")) {
    const done = parentEl.classList.contains("done") ? 0 : 1;
    toggleTaskStatusBackend(taskId, done);
    parentEl.classList.toggle("done");
  }

  if (targetEl.classList.contains("remove-to-do")) {
    deleteTaskBackend(taskId);
    parentEl.remove();
  }

  if (targetEl.classList.contains("edit-to-do")) {
    toggleForms();
    editInput.value = taskName;
    oldInputValue = taskName;
  }
});

cancelEditBtn.addEventListener("click", (e) => {
  e.preventDefault();
  toggleForms();
});

editForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const newTaskName = editInput.value;

  if (newTaskName) {
    updateTaskBackend(oldInputValue, newTaskName);
  }

  toggleForms();
});

searchInput.addEventListener("keyup", (e) => {
  const search = e.target.value;
  getSearchedTodos(search);
});

eraseBtn.addEventListener("click", (e) => {
  e.preventDefault();
  searchInput.value = "";
  searchInput.dispatchEvent(new Event("keyup"));
});

filterBtn.addEventListener("change", (e) => {
  const filterValue = e.target.value;
  filterTodos(filterValue);
});

// Conexão com o backend
const baseURL = "http://localhost:3003/tasks";

const fazPost = async (baseURL, body) => {
  console.log("body:", body);
  let request = new XMLHttpRequest();
  request.open("POST", baseURL, true);
  request.setRequestHeader("Content-type", "application/json");
  request.send(JSON.stringify(body));

  request.onload = function () {
    console.log(this.responseText);
  };

  return request.responseText;
};

const postTaskBackend = async (taskName) => {
  taskName = toDoInput.value;
  const data = { task_name: taskName };
  console.log(taskName);

  fazPost(baseURL, data);

  axios
    .post(baseURL, JSON.stringify(data))
    .then((response) => {
      const { id, task_name, done } = response.data.task;
      saveToDo(id, task_name, done);
    })
    .catch((error) => {
      console.log("Error:", error);
    });
};

const getTaskBackend = (taskId) => {
  return axios
    .get(`${baseURL}/${taskId}`)
    .then((response) => response.data)
    .catch((error) => {
      console.log("Error:", error)
    })
}

