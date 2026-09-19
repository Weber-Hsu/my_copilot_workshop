const STORAGE_KEY = "todo-list-items";

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const remainingCount = document.querySelector("#remaining-count");
const clearCompletedButton = document.querySelector("#clear-completed");

let todos = loadTodos();

// 從 localStorage 讀取待辦資料，若資料損壞則回傳空清單。
function loadTodos() {
  try {
    const savedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY));
    return Array.isArray(savedTodos) ? savedTodos : [];
  } catch (error) {
    return [];
  }
}

// 將目前清單保存到瀏覽器的 localStorage。
function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// 重新繪製清單與底部的未完成數量。
function renderTodos() {
  todoList.replaceChildren();
  emptyState.hidden = todos.length > 0;

  todos.forEach((todo) => {
    const item = document.createElement("li");
    item.className = `todo-item${todo.completed ? " is-completed" : ""}`;
    item.dataset.id = todo.id;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = todo.completed;
    checkbox.setAttribute("aria-label", `完成待辦事項: ${todo.text}`);

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-button";
    deleteButton.type = "button";
    deleteButton.dataset.action = "delete";
    deleteButton.textContent = "刪除";
    deleteButton.setAttribute("aria-label", `刪除待辦事項: ${todo.text}`);

    item.append(checkbox, text, deleteButton);
    todoList.append(item);
  });

  const unfinishedTodos = todos.filter((todo) => !todo.completed).length;
  remainingCount.textContent = `未完成:${unfinishedTodos} 項`;
}

todoForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = todoInput.value.trim();

  if (!text) {
    todoInput.focus();
    return;
  }

  todos.push({
    id: crypto.randomUUID(),
    text,
    completed: false,
  });
  saveTodos();
  renderTodos();
  todoInput.value = "";
  todoInput.focus();
});

todoList.addEventListener("change", (event) => {
  if (event.target.type !== "checkbox") {
    return;
  }

  const todoItem = event.target.closest(".todo-item");
  const todo = todos.find((item) => item.id === todoItem.dataset.id);
  todo.completed = event.target.checked;
  saveTodos();
  renderTodos();
});

todoList.addEventListener("click", (event) => {
  const deleteButton = event.target.closest('[data-action="delete"]');
  if (!deleteButton) {
    return;
  }

  const todoItem = deleteButton.closest(".todo-item");
  todos = todos.filter((todo) => todo.id !== todoItem.dataset.id);
  saveTodos();
  renderTodos();
});

clearCompletedButton.addEventListener("click", () => {
  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});

renderTodos();