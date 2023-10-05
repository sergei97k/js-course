"use strict";

// DOM variables
const form = document.querySelector(".create-task-form");
const taskInput = document.querySelector(".task-input");
const filteredInput = document.querySelector(".filter-input");
const taskList = document.querySelector(".collection");
const button = document.querySelector(".clear-tasks");

// "storage" functions
const STORAGE_KEY = "taskStorage";

// Завжди повертає масив
const getTasksFromStorage = () => {
  const tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  return tasks;
};

const setTaskToStorage = (task) => {
  const tasks = getTasksFromStorage();
  tasks.push(task);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

const clearStorage = () => {
  localStorage.removeItem(STORAGE_KEY);
};

const removeTaskFromLocalStorage = (deletedTask) => {
  const tasks = getTasksFromStorage();

  // Видалення елементу з масиву
  // 1 - filter
  // const filteredTasks = tasks.filter((task) => task !== deletedTask);
  // localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredTasks));

  // 2 - findIndex + splice
  const index = tasks.findIndex((task) => task === deletedTask);
  tasks.splice(index, 1);

  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};

// "tasks" functions
const addTask = (event) => {
  event.preventDefault();
  const value = taskInput.value.trim();

  // Пусте значення або пробіли - не додаємо LI
  if (value === "") {
    alert("Неккоректне значення");
    return;
  }

  // Create LI
  const li = document.createElement("li");
  li.className = "collection-item";
  li.textContent = value; // значення від користувача

  const span = document.createElement("span");
  span.className = "delete-item";
  span.innerHTML = '<i class="fa fa-remove"></i>';
  li.append(span);

  taskList.append(li);

  // Додаємо у localStorage
  setTaskToStorage(value);

  // Очистка інпута
  taskInput.value = "";
};

const clearTasks = () => {
  taskList.innerHTML = "";
  clearStorage();
};

const removeTask = (event) => {
  const isDeleteIcon = event.target.classList.contains("fa-remove");

  if (isDeleteIcon) {
    const isApproved = confirm("Ви впевнені?");

    if (isApproved) {
      const deletedLi = event.target.closest("li");
      deletedLi.remove();

      const text = deletedLi.firstChild.textContent;
      removeTaskFromLocalStorage(text);
    }
  }
};

const filterTasks = (event) => {
  const searchText = event.target.value.toLowerCase();
  const list = taskList.querySelectorAll(".collection-item");

  list.forEach((li) => {
    const liText = li.firstChild.textContent.toLowerCase();

    // if (liText.includes(searchText)) {
    //   li.hidden = false;
    // } else {
    //   li.hidden = true;
    // }

    li.hidden = !liText.includes(searchText);
  });
};

const getTasks = () => {
  const tasks = getTasksFromStorage();

  tasks.forEach((task) => {
    // Create LI
    const li = document.createElement("li");
    li.className = "collection-item";
    li.textContent = task; // значення зі storage

    const span = document.createElement("span");
    span.className = "delete-item";
    span.innerHTML = '<i class="fa fa-remove"></i>';
    li.append(span);

    taskList.append(li);
  });
};

// Ініціалізація
getTasks();
// document.addEventListener("DOMContentLoaded", getTasks);

// Event listeners
form.addEventListener("submit", addTask);

button.addEventListener("click", clearTasks);

taskList.addEventListener("click", removeTask);

filteredInput.addEventListener("input", filterTasks);
