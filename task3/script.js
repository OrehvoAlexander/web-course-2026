
let tasks = [];

let nextId = 1;

let currentFilter = "all";

const form = document.getElementById("task-form");
const input = document.getElementById("task-input");
const warning = document.getElementById("warning");
const list = document.getElementById("task-list");
const counter = document.getElementById("counter");
const filterButtons = document.querySelectorAll(".filter-btn");


function addTask(text) {
  const task = {
    id: nextId,
    text: text,
    completed: false
  };
  nextId = nextId + 1;
  tasks.push(task);
}

function toggleTask(id) {
  tasks.forEach(function (task) {
    if (task.id === id) {
      task.completed = !task.completed;
    }
  });
}

function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id;
  });
}

function render() {
  list.innerHTML = "";

  const visibleTasks = tasks.filter(function (task) {
    if (currentFilter === "active") {
      return !task.completed;
    }
    if (currentFilter === "done") {
      return task.completed;
    }
    return true; 
  });

  visibleTasks.forEach(function (task) {
    const li = document.createElement("li");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", function () {
      toggleTask(task.id);
      render();
    });

    const text = document.createElement("span");
    text.textContent = task.text;
    if (task.completed) {
      text.classList.add("completed");
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Удалить";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id);
      render();
    });

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(deleteBtn);
    list.appendChild(li);
  });

  const doneCount = tasks.filter(function (task) {
    return task.completed;
  }).length;
  const activeCount = tasks.length - doneCount;
  counter.textContent = "Осталось: " + activeCount + ", Выполнено: " + doneCount;

  filterButtons.forEach(function (btn) {
    if (btn.dataset.filter === currentFilter) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });
}

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const text = input.value.trim();

  if (text === "") {
    warning.textContent = "Введите текст задачи";
    return;
  }

  warning.textContent = "";
  addTask(text);
  input.value = "";
  render();
});

filterButtons.forEach(function (btn) {
  btn.addEventListener("click", function () {
    currentFilter = btn.dataset.filter;
    render();
  });
});

render();
