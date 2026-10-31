const STORAGE_KEY = "todo-items";

const todoForm = document.getElementById("todoForm");
const todoInput = document.getElementById("todoInput");
const todoList = document.getElementById("todoList");
const emptyTip = document.getElementById("emptyTip");
const remainingText = document.getElementById("remainingText");

let todos = loadTodos();

// 初始化畫面並綁定事件
renderTodos();
todoForm.addEventListener("submit", handleAddTodo);
todoList.addEventListener("change", handleToggleTodo);
todoList.addEventListener("click", handleDeleteTodo);

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

function renderTodos() {
  todoList.innerHTML = "";

  todos.forEach((todo) => {
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

  updateFooterAndEmptyState();
}

function updateFooterAndEmptyState() {
  const remainingCount = todos.filter((todo) => !todo.completed).length;
  remainingText.textContent = `未完成:${remainingCount} 項`;

  emptyTip.style.display = todos.length === 0 ? "block" : "none";
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
  } catch {
    return [];
  }
}
