const STORAGE_KEY = "todo-items";
const THEME_STORAGE_KEY = "todo-theme";

const FILTER_TYPES = {
  ALL: "all",
  ACTIVE: "active",
  COMPLETED: "completed",
};

const EMPTY_TIP_TEXT = {
  [FILTER_TYPES.ALL]: "還沒有任何待辦事項,新增一個吧!",
  [FILTER_TYPES.ACTIVE]: "目前沒有未完成的待辦事項!",
  [FILTER_TYPES.COMPLETED]: "目前沒有已完成的待辦事項!",
};

const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const emptyTip = document.getElementById("emptyTip");
const remainingText = document.getElementById("remainingText");
const filterGroup = document.querySelector(".filter-group");
const filterButtons = document.querySelectorAll(".filter-btn");
const themeToggleBtn = document.getElementById("themeToggleBtn");

const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");
let currentFilter = FILTER_TYPES.ALL;
let todos = loadTodos();

// 初始化畫面並綁定事件
initializeTheme();
updateFilterButtonState();
renderTodos();
todoForm.addEventListener("submit", handleAddTodo);
todoList.addEventListener("change", handleToggleTodo);
todoList.addEventListener("click", handleDeleteTodo);
filterGroup.addEventListener("click", handleFilterChange);
themeToggleBtn.addEventListener("click", handleThemeToggle);
bindSystemThemeListener();

function handleAddTodo(event) {
  event.preventDefault();
  const text = todoInput.value.trim();

  // 避免新增空白內容
  if (!text) {
    todoInput.value = "";
    return;
  }

  todos.push({
    id: crypto.randomUUID(),
    text,
    completed: false,
  });

  todoInput.value = "";
  saveTodos();
  renderTodos();
}

function handleToggleTodo(event) {
  if (!event.target.classList.contains("todo-checkbox")) {
    return;
  }

  const itemId = event.target.dataset.id;
  todos = todos.map((todo) => {
    if (todo.id === itemId) {
      return { ...todo, completed: event.target.checked };
    }
    return todo;
  });

  saveTodos();
  renderTodos();
}

function handleDeleteTodo(event) {
  if (!event.target.classList.contains("delete-btn")) {
    return;
  }

  const itemId = event.target.dataset.id;
  todos = todos.filter((todo) => todo.id !== itemId);

  saveTodos();
  renderTodos();
}

function handleFilterChange(event) {
  if (!event.target.classList.contains("filter-btn")) {
    return;
  }

  currentFilter = event.target.dataset.filter;
  updateFilterButtonState();
  renderTodos();
}

function handleThemeToggle() {
  const currentTheme = document.documentElement.dataset.theme;
  const nextTheme = currentTheme === "dark" ? "light" : "dark";

  applyTheme(nextTheme);
  localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
}

function renderTodos() {
  todoList.innerHTML = "";
  const filteredTodos = getFilteredTodos();

  filteredTodos.forEach((todo) => {
    const li = document.createElement("li");
    li.className = `todo-item${todo.completed ? " completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "todo-checkbox";
    checkbox.checked = todo.completed;
    checkbox.dataset.id = todo.id;
    checkbox.setAttribute("aria-label", `切換完成狀態: ${todo.text}`);

    const text = document.createElement("span");
    text.className = "todo-text";
    text.textContent = todo.text;

    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete-btn";
    deleteBtn.dataset.id = todo.id;
    deleteBtn.textContent = "刪除";
    deleteBtn.setAttribute("aria-label", `刪除待辦: ${todo.text}`);

    li.append(checkbox, text, deleteBtn);
    todoList.appendChild(li);
  });

  updateFooterAndEmptyState(filteredTodos.length);
}

function updateFooterAndEmptyState(filteredCount) {
  const remainingCount = todos.filter((todo) => !todo.completed).length;
  remainingText.textContent = `未完成:${remainingCount} 項`;

  emptyTip.style.display = filteredCount === 0 ? "block" : "none";
  emptyTip.textContent = EMPTY_TIP_TEXT[currentFilter];
}

function getFilteredTodos() {
  if (currentFilter === FILTER_TYPES.ACTIVE) {
    return todos.filter((todo) => !todo.completed);
  }

  if (currentFilter === FILTER_TYPES.COMPLETED) {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

function updateFilterButtonState() {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function saveTodos() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

function loadTodos() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw);
    // 防止 localStorage 資料格式被破壞造成錯誤
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof item.id === "string" &&
        typeof item.text === "string" &&
        typeof item.completed === "boolean"
    );
  } catch (error) {
    console.error("讀取待辦資料失敗:", error);
    return [];
  }
}

function initializeTheme() {
  const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);

  if (storedTheme === "dark" || storedTheme === "light") {
    applyTheme(storedTheme);
    return;
  }

  applyTheme(prefersDarkScheme.matches ? "dark" : "light");
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;

  if (theme === "dark") {
    themeToggleBtn.textContent = "☀️ 淺色模式";
    return;
  }

  themeToggleBtn.textContent = "🌙 深色模式";
}

function bindSystemThemeListener() {
  const handleSystemThemeChange = (event) => {
    // 只有尚未手動切換過主題時,才跟隨系統設定
    if (localStorage.getItem(THEME_STORAGE_KEY)) {
      return;
    }

    applyTheme(event.matches ? "dark" : "light");
  };

  if (typeof prefersDarkScheme.addEventListener === "function") {
    prefersDarkScheme.addEventListener("change", handleSystemThemeChange);
    return;
  }

  prefersDarkScheme.addListener(handleSystemThemeChange);
}
