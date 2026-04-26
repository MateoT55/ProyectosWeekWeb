/* ─────────────────────────────────────────────────────
   script.js  –  TaskFlow frontend
   Connects to ASP.NET Core REST API at BASE_URL
   ───────────────────────────────────────────────────── */

const BASE_URL = "https://localhost:7139/api/ToDoControllers";

/* ─── State ──────────────────────────────────────────── */
let allTasks   = [];          // full list fetched from API
let activeFilter = "all";     // "all" | "pending" | "done"

/* ─── DOM References ─────────────────────────────────── */
const taskListEl  = document.getElementById("task-list");
const emptyMsgEl  = document.getElementById("empty-msg");

const inputName   = document.getElementById("input-name");
const inputDesc   = document.getElementById("input-desc");
const btnAdd      = document.getElementById("btn-add");
const formError   = document.getElementById("form-error");

const modalOverlay  = document.getElementById("modal-overlay");
const editIdInput   = document.getElementById("edit-id");
const editNameInput = document.getElementById("edit-name");
const editDescInput = document.getElementById("edit-desc");
const editError     = document.getElementById("edit-error");
const btnSaveEdit   = document.getElementById("btn-save-edit");
const btnCancelEdit = document.getElementById("btn-cancel-edit");

const toastEl = document.getElementById("toast");

/* ─── Helpers ────────────────────────────────────────── */

/**
 * Show a brief toast notification.
 * @param {string} msg
 */
function showToast(msg) {
  toastEl.textContent = msg;
  toastEl.classList.add("show");
  setTimeout(() => toastEl.classList.remove("show"), 2400);
}

/**
 * Generic fetch wrapper with JSON support.
 * Returns { ok, data, status }
 */
async function apiRequest(method, url, body = null) {
  const options = {
    method,
    headers: { "Content-Type": "application/json" },
  };
  if (body !== null) options.body = JSON.stringify(body);

  try {
    const res = await fetch(url, options);
    let data = null;
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }
    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    return { ok: false, status: 0, data: "Network error. Is the API running?" };
  }
}

/* ─── API Calls ──────────────────────────────────────── */

async function fetchTasks() {
  const { ok, data } = await apiRequest("GET", BASE_URL);
  if (ok) {
    allTasks = data;
    renderTasks();
  } else {
    taskListEl.innerHTML = `<p class="empty-msg" style="color:#d44">Could not load tasks. ${data}</p>`;
  }
}

async function createTask(nombre, descripcion) {
  const { ok, data } = await apiRequest("POST", BASE_URL, { nombre, descripcion, completada: false });
  if (ok) {
    showToast("Task created ✓");
    await fetchTasks();
  } else {
    formError.textContent = typeof data === "string" ? data : "Could not create task.";
  }
}

async function markComplete(id) {
  const { ok, data } = await apiRequest("PUT", `${BASE_URL}/${id}/completar`);
  if (ok) {
    showToast("Task completed ✓");
    await fetchTasks();
  } else {
    showToast(typeof data === "string" ? data : "Error completing task.");
  }
}

async function deleteTask(id) {
  const { ok, data } = await apiRequest("DELETE", `${BASE_URL}/${id}`);
  if (ok) {
    showToast("Task deleted");
    await fetchTasks();
  } else {
    showToast(typeof data === "string" ? data : "Error deleting task.");
  }
}

async function updateTask(id, nombre, descripcion) {
  const { ok, data } = await apiRequest("PUT", `${BASE_URL}/${id}`, { nombre, descripcion, completada: false });
  if (ok) {
    showToast("Task updated ✓");
    closeModal();
    await fetchTasks();
  } else {
    editError.textContent = typeof data === "string" ? data : "Could not update task.";
  }
}

/* ─── Render ─────────────────────────────────────────── */

function getFilteredTasks() {
  if (activeFilter === "pending") return allTasks.filter(t => !t.completada);
  if (activeFilter === "done")    return allTasks.filter(t =>  t.completada);
  return allTasks;
}

function renderTasks() {
  const tasks = getFilteredTasks();

  // Clear everything except the static empty-msg template
  taskListEl.innerHTML = "";

  if (tasks.length === 0) {
    const p = document.createElement("p");
    p.className = "empty-msg";
    p.textContent = activeFilter === "all"
      ? "No tasks yet. Add one above!"
      : activeFilter === "done"
      ? "No completed tasks."
      : "No pending tasks.";
    taskListEl.appendChild(p);
    return;
  }

  tasks.forEach(task => {
    const item = buildTaskElement(task);
    taskListEl.appendChild(item);
  });
}

function buildTaskElement(task) {
  const item = document.createElement("div");
  item.className = `task-item${task.completada ? " done" : ""}`;
  item.dataset.id = task.id;

  // Checkbox circle
  const check = document.createElement("div");
  check.className = "task-check";
  check.title = task.completada ? "Already completed" : "Mark as complete";
  check.textContent = task.completada ? "✓" : "";
  if (!task.completada) {
    check.addEventListener("click", () => markComplete(task.id));
  }

  // Content
  const content = document.createElement("div");
  content.className = "task-content";

  const nameEl = document.createElement("div");
  nameEl.className = "task-name";
  nameEl.textContent = task.nombre;

  content.appendChild(nameEl);

  if (task.descripcion) {
    const descEl = document.createElement("div");
    descEl.className = "task-desc";
    descEl.textContent = task.descripcion;
    content.appendChild(descEl);
  }

  // Actions
  const actions = document.createElement("div");
  actions.className = "task-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "task-btn btn-edit";
  editBtn.title = "Edit task";
  editBtn.innerHTML = "✎";
  editBtn.addEventListener("click", () => openEditModal(task));

  const delBtn = document.createElement("button");
  delBtn.className = "task-btn btn-delete";
  delBtn.title = "Delete task";
  delBtn.innerHTML = "✕";
  delBtn.addEventListener("click", () => {
    if (confirm(`Delete "${task.nombre}"?`)) deleteTask(task.id);
  });

  actions.appendChild(editBtn);
  actions.appendChild(delBtn);

  item.appendChild(check);
  item.appendChild(content);
  item.appendChild(actions);

  return item;
}

/* ─── Modal ──────────────────────────────────────────── */

function openEditModal(task) {
  editIdInput.value   = task.id;
  editNameInput.value = task.nombre;
  editDescInput.value = task.descripcion || "";
  editError.textContent = "";
  modalOverlay.classList.add("open");
  editNameInput.focus();
}

function closeModal() {
  modalOverlay.classList.remove("open");
}

/* ─── Event Listeners ────────────────────────────────── */

// Add task
btnAdd.addEventListener("click", () => {
  const nombre = inputName.value.trim();
  const desc   = inputDesc.value.trim();
  formError.textContent = "";

  if (!nombre) {
    formError.textContent = "Task name is required.";
    inputName.focus();
    return;
  }

  btnAdd.disabled = true;
  btnAdd.textContent = "Adding…";
  createTask(nombre, desc).finally(() => {
    btnAdd.disabled = false;
    btnAdd.textContent = "Add Task";
    inputName.value = "";
    inputDesc.value = "";
  });
});

// Add task on Enter inside name field
inputName.addEventListener("keydown", (e) => {
  if (e.key === "Enter") btnAdd.click();
});

// Save edit
btnSaveEdit.addEventListener("click", () => {
  const id     = parseInt(editIdInput.value);
  const nombre = editNameInput.value.trim();
  const desc   = editDescInput.value.trim();
  editError.textContent = "";

  if (!nombre) {
    editError.textContent = "Task name is required.";
    editNameInput.focus();
    return;
  }

  btnSaveEdit.disabled = true;
  btnSaveEdit.textContent = "Saving…";
  updateTask(id, nombre, desc).finally(() => {
    btnSaveEdit.disabled = false;
    btnSaveEdit.textContent = "Save Changes";
  });
});

// Cancel edit
btnCancelEdit.addEventListener("click", closeModal);

// Close modal on overlay click
modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

// Filter tabs
document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    renderTasks();
  });
});

/* ─── Init ───────────────────────────────────────────── */
fetchTasks();
