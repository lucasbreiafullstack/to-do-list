//Seleção de elementos
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

//Funções
const saveToDo = (text, done = 0, save = 1) =>{
    const toDo = document.createElement("div")
    toDo.classList.add("to-do")

    const toDoTitle = document.createElement("h3")
    toDoTitle.innerText = text
    toDo.appendChild(toDoTitle)

    const doneBtn = document.createElement("button")
    doneBtn.classList.add("finish-to-do")
    doneBtn.innerHTML = '<i class="fa-solid fa-check"></i>'
    toDo.appendChild(doneBtn)

    const editBtn = document.createElement("button")
    editBtn.classList.add("edit-to-do")
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>'
    toDo.appendChild(editBtn)

    const deleteBtn = document.createElement("button")
    deleteBtn.classList.add("remove-to-do")
    deleteBtn.innerHTML = '<i class="fa-solid fa-xmark"></i>'
    toDo.appendChild(deleteBtn)

    toDoList.appendChild(toDo)

    toDoInput.value = "";
    toDoInput.focus();

// Utilizando dados da localStorage
  if (done) {
    toDo.classList.add("done");
  }

  if (save) {
    saveTodoLocalStorage({ text, done: 0 });
  }

  toDoList.appendChild(toDo);

  toDoInput.value = "";
}

const toggleForms = () =>{
    editForm.classList.toggle("hide")
    toDoForm.classList.toggle("hide")
    toDoList.classList.toggle("hide")
}

const updateToDo = (text) =>{
    const todos = document.querySelectorAll(".to-do")

    todos.forEach((toDo) =>{
        let toDoTitle = toDo.querySelector("h3")

        if(toDoTitle.innerText === oldInputValue){
            toDoTitle.innerText = text
        }

        if (toDoTitle.innerText === oldInputValue) {
            toDoTitle.innerText = text;
      
            // Utilizando dados da localStorage
            updateTodoLocalStorage(oldInputValue, text);
        }
    })
}

const getSearchedTodos = (search) => {
    const todos = document.querySelectorAll(".to-do");
  
    todos.forEach((toDo) => {
      const todoTitle = toDo.querySelector("h3").innerText.toLowerCase();
  
      toDo.style.display = "flex";
  
      console.log(todoTitle);
  
      if (!todoTitle.includes(search)) {
        toDo.style.display = "none";
      }
    });
};

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll(".to-do");
  
    switch (filterValue) {
      case "all":
        todos.forEach((toDo) => (toDo.style.display = "flex"));
        break;
  
      case "done":
        todos.forEach((toDo) =>
          toDo.classList.contains("done")
            ? (toDo.style.display = "flex")
            : (toDo.style.display = "none")
        );
        break;
  
      case "todo":
        todos.forEach((toDo) =>
          !toDo.classList.contains("done")
            ? (toDo.style.display = "flex")
            : (toDo.style.display = "none")
        );
        break;
        default:
        break;
    }
  };


//Eventos
toDoForm.addEventListener("submit", (e) =>{
    e.preventDefault();

    const inputValue = toDoInput.value

    if(inputValue){
        saveToDo(inputValue)
    }
})

document.addEventListener("click", (e) =>{
    const targetEl = e.target
    const parentEl = targetEl.closest("div")
    let toDoTitle

    if(parentEl && parentEl.querySelector("h3")){
        toDoTitle = parentEl.querySelector("h3").innerText
    }

    if(targetEl.classList.contains("finish-to-do")){
        parentEl.classList.toggle("done")
    }

    if(targetEl.classList.contains("remove-to-do")){
        parentEl.remove()

        // Utilizando dados da localStorage
        removeTodoLocalStorage(toDoTitle);
    }

    if(targetEl.classList.contains("edit-to-do")){
       toggleForms()

       editInput.value = toDoTitle
       oldInputValue = toDoTitle
    }
})

cancelEditBtn.addEventListener("click", (e) =>{
    e.preventDefault()

    toggleForms()
})

editForm.addEventListener("submit", (e) =>{
    e.preventDefault()

    const editInputValue = editInput.value

    if(editInputValue){
        updateToDo(editInputValue)
    }

    toggleForms()
})

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

// Local Storage
const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem("todos")) || [];
  
    return todos;
  };
  
  const loadTodos = () => {
    const todos = getTodosLocalStorage();
  
    todos.forEach((todo) => {
      saveToDo(todo.text, todo.done, 0);
    });
  };
  
  const saveTodoLocalStorage = (todo) => {
    const todos = getTodosLocalStorage();
  
    todos.push(todo);
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  const removeTodoLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
  
    const filteredTodos = todos.filter((todo) => todo.text != todoText);
  
    localStorage.setItem("todos", JSON.stringify(filteredTodos));
  };
  
  const updateTodoStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage();
  
    todos.map((todo) =>
      todo.text === todoText ? (todo.done = !todo.done) : null
    );
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  const updateTodoLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();
  
    todos.map((todo) =>
      todo.text === todoOldText ? (todo.text = todoNewText) : null
    );
  
    localStorage.setItem("todos", JSON.stringify(todos));
  };
  
  loadTodos();