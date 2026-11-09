document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("task-input");
  const addButton = document.getElementById("add-task-btn");
  const list = document.getElementById("task-list");
  const counter = document.getElementById("counter");
  const filterButtons = [...document.querySelectorAll(".filters button")];
  const modal = document.getElementById("edit-modal");
  const editInput = document.getElementById("edit-input");
  const saveEdit = document.getElementById("save-edit");
  const cancelEdit = document.getElementById("cancel-edit");
  const progressFill = document.getElementById("progress-fill");
  const progressBar = document.querySelector(".progress-bar");
  const clock = document.getElementById("clock");

  const STORAGE_KEY = "smart-task-list.tasks";
  let currentFilter = "all";
  let editingTaskId = null;

  function createId() {
    return globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function loadTasks() {
    try {
      const current = localStorage.getItem(STORAGE_KEY);
      const legacy = current === null ? localStorage.getItem("tasks") : null;
      const stored = JSON.parse(current ?? legacy ?? "[]");
      if (!Array.isArray(stored)) return [];
      return stored
        .filter((task) => task && typeof task.text === "string")
        .map((task) => ({
          id: typeof task.id === "string" ? task.id : createId(),
          text: task.text,
          done: Boolean(task.done),
        }));
    } catch {
      return [];
    }
  }

  let tasks = loadTasks();

  function persistTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.warn("Tasks could not be saved in this browser.", error);
    }
  }

  function updateSummary() {
    const completed = tasks.filter((task) => task.done).length;
    const total = tasks.length;
    if (counter) counter.textContent = `Total: ${total} | Completed: ${completed}`;
    if (progressFill) {
      const percentage = total === 0 ? 0 : (completed / total) * 100;
      progressFill.style.width = `${percentage}%`;
      progressBar?.setAttribute("aria-valuenow", String(Math.round(percentage)));
    }
  }

  function makeActionButton(label, symbol, onClick) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "action";
    button.textContent = symbol;
    button.setAttribute("aria-label", label);
    button.addEventListener("click", onClick);
    return button;
  }

  function render() {
    if (!list) return;
    list.replaceChildren();

    const visibleTasks = tasks.filter((task) => {
      if (currentFilter === "done") return task.done;
      if (currentFilter === "todo") return !task.done;
      return true;
    });

    for (const task of visibleTasks) {
      const item = document.createElement("li");
      if (task.done) item.classList.add("done");

      const text = document.createElement("span");
      text.textContent = task.text;
      text.tabIndex = 0;
      text.setAttribute("role", "button");
      text.setAttribute("aria-label", `Edit task: ${task.text}`);
      text.addEventListener("dblclick", () => openEditor(task.id));
      text.addEventListener("keydown", (event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openEditor(task.id);
        }
      });

      const completeButton = makeActionButton(
        task.done ? "Mark as incomplete" : "Mark as complete",
        task.done ? "↶" : "✓",
        () => toggleTask(task.id)
      );
      const deleteButton = makeActionButton("Delete task", "×", () => deleteTask(task.id));

      item.append(text, completeButton, deleteButton);
      list.appendChild(item);
    }

    updateSummary();
    persistTasks();
  }

  function addTask() {
    const text = input?.value.trim();
    if (!text) {
      input?.focus();
      return;
    }
    tasks.push({ id: createId(), text, done: false });
    input.value = "";
    render();
    input.focus();
  }

  function toggleTask(id) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;
    task.done = !task.done;
    render();
  }

  function deleteTask(id) {
    tasks = tasks.filter((task) => task.id !== id);
    if (editingTaskId === id) closeEditor();
    render();
  }

  function openEditor(id) {
    const task = tasks.find((item) => item.id === id);
    if (!task || !modal || !editInput) return;
    editingTaskId = id;
    editInput.value = task.text;
    modal.style.display = "flex";
    editInput.focus();
  }

  function closeEditor() {
    if (modal) modal.style.display = "none";
    editingTaskId = null;
  }

  function saveEditedTask() {
    const task = tasks.find((item) => item.id === editingTaskId);
    const updatedText = editInput?.value.trim();
    if (task && updatedText) task.text = updatedText;
    closeEditor();
    render();
  }

  function updateClock() {
    if (!clock) return;
    clock.textContent = new Intl.DateTimeFormat(undefined, {
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date());
  }

  addButton?.addEventListener("click", addTask);
  input?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") addTask();
  });
  saveEdit?.addEventListener("click", saveEditedTask);
  cancelEdit?.addEventListener("click", closeEditor);
  editInput?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") saveEditedTask();
    if (event.key === "Escape") closeEditor();
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => {
        item.classList.remove("active");
        item.setAttribute("aria-pressed", "false");
      });
      button.classList.add("active");
      button.setAttribute("aria-pressed", "true");
      currentFilter = button.dataset.filter || "all";
      render();
    });
  });

  updateClock();
  window.setInterval(updateClock, 1000);
  render();
});
