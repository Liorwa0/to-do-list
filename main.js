document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("task-input");
  const addBtn = document.getElementById("add-task-btn");
  const list = document.getElementById("task-list");
  const counter = document.getElementById("counter");
  const filterButtons = document.querySelectorAll(".filters button");

  const modal = document.getElementById("edit-modal");
  const editInput = document.getElementById("edit-input");
  const saveEdit = document.getElementById("save-edit");
  const cancelEdit = document.getElementById("cancel-edit");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all";
  let editIndex = null;

  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function render() {
    list.innerHTML = "";
    let completedCount = 0;

    tasks.forEach((t, i) => {
      if (currentFilter === "done" && !t.done) return;
      if (currentFilter === "todo" && t.done) return;

      const li = document.createElement("li");
      if (t.done) li.classList.add("done");

      const span = document.createElement("span");
      span.textContent = t.text;
      span.ondblclick = () => editTask(i);

      const checkBtn = document.createElement("button");
      checkBtn.className = "action";
      checkBtn.innerHTML = '<i class="fa-solid fa-check"></i>';
      checkBtn.onclick = () => toggleDone(i);

      const delBtn = document.createElement("button");
      delBtn.className = "action";
      delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
      delBtn.onclick = () => deleteTask(i);

      li.appendChild(span);
      li.appendChild(checkBtn);
      li.appendChild(delBtn);

      list.appendChild(li);

      if (t.done) completedCount++;
    });

    counter.textContent = `الإجمالي: ${tasks.length} | المنجزة: ${completedCount}`;
    saveTasks();
    updateProgress(); // لتحديث الإحصائية بكل مرة
  }

  function addTask() {
    const text = input.value.trim();
    if (!text) return;
    tasks.push({ text, done: false });
    input.value = "";
    render();
  }

  function toggleDone(i) {
    tasks[i].done = !tasks[i].done;
    render();
  }

  function deleteTask(i) {
    tasks.splice(i, 1);
    render();
  }

  // نافذة التعديل
  function editTask(i) {
    editIndex = i;
    editInput.value = tasks[i].text;
    modal.style.display = "flex";
    editInput.focus();
  }

  saveEdit.onclick = () => {
    const newText = editInput.value.trim();
    if (newText) {
      tasks[editIndex].text = newText;
      render();
    }
    modal.style.display = "none";
  };

  cancelEdit.onclick = () => {
    modal.style.display = "none";
  };

  //  الفلاتر
  filterButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      filterButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      currentFilter = btn.getAttribute("data-filter");
      render();
    });
  });

  addBtn.addEventListener("click", addTask);
  input.addEventListener("keydown", e => { if (e.key === "Enter") addTask(); });

  //  الساعة
  function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHour = hours % 12 || 12;
    document.getElementById('clock').textContent = `${displayHour}:${minutes}:${seconds} ${ampm}`;
  }

  setInterval(updateClock, 1000);
  updateClock();

  // نسبة الإنجاز
  function updateProgress() {
    const done = tasks.filter(t => t.done).length;
    const total = tasks.length || 1;
    const percent = (done / total) * 100; //تحسب النسبه المئويه للانجاز
    const fill = document.getElementById("progress-fill");
    if (fill) fill.style.width = percent + "%";//تغير عرض الشريط حسب النسبه
  }

  render();
});
