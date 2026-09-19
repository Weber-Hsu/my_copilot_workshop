const STORAGE_KEY = "todo-list-items";

const todoForm = document.querySelector("#todo-form");
const todoInput = document.querySelector("#todo-input");
const todoList = document.querySelector("#todo-list");
const emptyState = document.querySelector("#empty-state");
const remainingCount = document.querySelector("#remaining-count");
const clearCompletedButton = document.querySelector("#clear-completed");
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = themeToggle.querySelector(".theme-icon");
const themeLabel = themeToggle.querySelector(".theme-label");
const filterButtons = document.querySelectorAll("[data-filter]");

let todos = loadTodos();
let currentFilter = "all";
const themeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

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

// 依照目前篩選條件取得要顯示的待辦事項。
function getVisibleTodos() {
  if (currentFilter === "active") {
    return todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === "completed") {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

// 更新沒有項目時顯示的提示文字。
function updateEmptyState(visibleTodos) {
  if (todos.length === 0) {
    emptyState.textContent = "還沒有任何待辦事項,新增一個吧!";
  } else if (currentFilter === "active") {
    emptyState.textContent = "目前沒有未完成的待辦事項。";
  } else if (currentFilter === "completed") {
    emptyState.textContent = "目前沒有已完成的待辦事項。";
  }

  emptyState.hidden = visibleTodos.length > 0;
}

// 根據是否有已完成項目同步更新批次清除按鈕。
function updateClearCompletedButton() {
  clearCompletedButton.disabled = !todos.some((todo) => todo.completed);
}

// 重新繪製篩選後的清單與整體未完成數量。
function renderTodos() {
  todoList.replaceChildren();
  const visibleTodos = getVisibleTodos();
  updateEmptyState(visibleTodos);

  visibleTodos.forEach((todo) => {
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
  updateClearCompletedButton();
}

// 套用主題並同步切換按鈕文字。
function applyTheme(theme) {
  const isDark = theme === "dark";
  document.documentElement.dataset.theme = theme;
  themeIcon.textContent = isDark ? "☀️" : "🌙";
  themeLabel.textContent = isDark ? "淺色模式" : "深色模式";
  themeToggle.setAttribute("aria-pressed", String(isDark));
}

// 沒有手動設定時，清除屬性讓 CSS 跟隨系統偏好。
function applySystemTheme() {
  const savedTheme = localStorage.getItem("todo-theme");
  if (savedTheme !== "light" && savedTheme !== "dark") {
    document.documentElement.removeAttribute("data-theme");
    applyTheme(themeMediaQuery.matches ? "dark" : "light");
    document.documentElement.removeAttribute("data-theme");
  } else {
    applyTheme(savedTheme);
  }
}

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.dataset.theme === "dark"
    || (!document.documentElement.dataset.theme && themeMediaQuery.matches);
  const nextTheme = isDark ? "light" : "dark";
  localStorage.setItem("todo-theme", nextTheme);
  applyTheme(nextTheme);
});

themeMediaQuery.addEventListener("change", () => {
  if (!localStorage.getItem("todo-theme")) {
    applySystemTheme();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    currentFilter = button.dataset.filter;
    filterButtons.forEach((filterButton) => {
      const isActive = filterButton === button;
      filterButton.classList.toggle("is-active", isActive);
      filterButton.setAttribute("aria-pressed", String(isActive));
    });
    renderTodos();
  });
});

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
  if (!confirm("確定要清除所有已完成的待辦事項嗎?")) {
    return;
  }

  todos = todos.filter((todo) => !todo.completed);
  saveTodos();
  renderTodos();
});

applySystemTheme();
renderTodos();