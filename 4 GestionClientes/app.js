/* ============================================================
   GESTOR CLIENTES — app.js
   Vanilla JS + Fetch API + async/await
   Base URL: https://localhost:7286/api/Clientes
   ============================================================ */

const API = 'https://localhost:7286/api/Clientes';

// ── Estado local ──────────────────────────────────────────────
let clientes = [];
let clientesFiltrados = [];

// ── Elementos DOM ─────────────────────────────────────────────
const formCliente    = document.getElementById('form-cliente');
const btnSubmit      = document.getElementById('btn-submit');
const submitLoader   = document.getElementById('submit-loader');
const inpName        = document.getElementById('inp-name');
const inpEmail       = document.getElementById('inp-email');
const inpPhone       = document.getElementById('inp-phone');
const inpEstado      = document.getElementById('inp-estado');
const inpDate        = document.getElementById('inp-date');

const tbody          = document.getElementById('tbody-clientes');
const tableWrapper   = document.getElementById('table-wrapper');
const loadingState   = document.getElementById('loading-state');
const emptyState     = document.getElementById('empty-state');
const searchInput    = document.getElementById('search-input');
const btnRefresh     = document.getElementById('btn-refresh');
const btnEliminarTodos = document.getElementById('btn-eliminar-todos');

const modalEstado    = document.getElementById('modal-estado');
const modalNombre    = document.getElementById('modal-cliente-nombre');
const modalId        = document.getElementById('modal-cliente-id');
const modalSelect    = document.getElementById('modal-estado-select');
const modalConfirm   = document.getElementById('modal-confirm');
const modalCancel    = document.getElementById('modal-cancel');
const modalClose     = document.getElementById('modal-close');
const modalLoader    = document.getElementById('modal-loader');

const countTotal     = document.getElementById('count-total');
const countActivos   = document.getElementById('count-activos');
const countDesact    = document.getElementById('count-desact');

// ── Estado del modal ──────────────────────────────────────────
let pendingEstadoId = null;

// ── Inicialización ────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setDefaultDate();
  cargarClientes();
  attachEventListeners();
});

function setDefaultDate() {
  const today = new Date().toISOString().split('T')[0];
  inpDate.value = today;
}

function attachEventListeners() {
  formCliente.addEventListener('submit', onSubmitCliente);
  btnRefresh.addEventListener('click', cargarClientes);
  btnEliminarTodos.addEventListener('click', onEliminarTodos);
  searchInput.addEventListener('input', onSearch);
  modalConfirm.addEventListener('click', onConfirmarEstado);
  modalCancel.addEventListener('click', cerrarModal);
  modalClose.addEventListener('click', cerrarModal);
  modalEstado.addEventListener('click', (e) => {
    if (e.target === modalEstado) cerrarModal();
  });
}

// ── API HELPERS ───────────────────────────────────────────────

async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => 'Error desconocido');
    throw new Error(`HTTP ${res.status}: ${text}`);
  }
  // Si la respuesta tiene cuerpo, parseamos; si no, devolvemos null
  const ct = res.headers.get('content-type') || '';
  if (ct.includes('application/json') && res.status !== 204) {
    return res.json();
  }
  return null;
}

// ── OBTENER TODOS ─────────────────────────────────────────────
async function cargarClientes() {
  mostrarEstado('loading');
  btnRefresh.disabled = true;
  btnRefresh.textContent = '↻ Cargando...';
  try {
    const data = await fetchJSON(API);
    // La API devuelve la colección directamente o dentro de un wrapper
    clientes = Array.isArray(data) ? data : (data?.value ?? data?.data ?? []);
    filtrarYRenderizar();
    actualizarStats();
    showToast('Lista actualizada.', 'info');
  } catch (err) {
    mostrarEstado('error');
    showToast(`Error al cargar: ${err.message}`, 'error');
    console.error(err);
  } finally {
    btnRefresh.disabled = false;
    btnRefresh.textContent = '↻ Actualizar';
  }
}

// ── CREAR CLIENTE ─────────────────────────────────────────────
async function onSubmitCliente(e) {
  e.preventDefault();
  if (!validarFormulario()) return;

  // Parsear phone como número entero explícito con Number()
  // parseInt puede devolver NaN si el campo tiene espacios o está vacío
  const phoneVal = Number(inpPhone.value.trim());

  // ASP.NET espera la fecha en formato ISO con hora, pero el input type="date"
  // devuelve "YYYY-MM-DD". Agregamos T00:00:00 para evitar problemas de zona horaria.
  const dateVal = inpDate.value
    ? new Date(inpDate.value + 'T00:00:00').toISOString()
    : new Date().toISOString();

  const dto = {
    name:   inpName.value.trim(),
    email:  inpEmail.value.trim(),
    phone:  phoneVal,           // número nativo, no string
    estado: parseInt(inpEstado.value, 10),
    date:   dateVal,
  };

  setSubmitLoading(true);
  try {
    await fetchJSON(API, {
      method: 'POST',
      body: JSON.stringify(dto),
    });
    showToast(`Cliente "${dto.name}" registrado con éxito.`, 'success');
    formCliente.reset();
    setDefaultDate();
    limpiarErrores();
    await cargarClientes();
  } catch (err) {
    showToast(`Error al crear cliente: ${err.message}`, 'error');
    console.error(err);
  } finally {
    setSubmitLoading(false);
  }
}

// ── ELIMINAR POR ID ───────────────────────────────────────────
async function onEliminarPorId(id, nombre) {
  if (!confirm(`¿Seguro que querés eliminar a "${nombre}"?\nEsta acción no se puede deshacer.`)) return;
  try {
    await fetchJSON(`${API}/${id}`, { method: 'DELETE' });
    showToast(`Cliente "${nombre}" eliminado.`, 'success');
    await cargarClientes();
  } catch (err) {
    showToast(`Error al eliminar: ${err.message}`, 'error');
    console.error(err);
  }
}

// ── ELIMINAR TODOS ────────────────────────────────────────────
async function onEliminarTodos() {
  if (clientes.length === 0) { showToast('No hay clientes para eliminar.', 'info'); return; }
  if (!confirm(`⚠ Esto eliminará TODOS los clientes (${clientes.length}).\n¿Estás completamente seguro?`)) return;
  btnEliminarTodos.disabled = true;
  try {
    await fetchJSON(API, { method: 'DELETE' });
    showToast('Todos los clientes fueron eliminados.', 'success');
    await cargarClientes();
  } catch (err) {
    showToast(`Error: ${err.message}`, 'error');
    console.error(err);
  } finally {
    btnEliminarTodos.disabled = false;
  }
}

// ── CAMBIAR ESTADO ────────────────────────────────────────────
function onAbrirModalEstado(id, nombre, estadoActual) {
  pendingEstadoId = id;
  modalNombre.textContent = nombre;
  modalId.textContent     = id;
  modalSelect.value       = estadoActual;
  modalEstado.hidden      = false;
  document.body.style.overflow = 'hidden';
}

function cerrarModal() {
  modalEstado.hidden = true;
  pendingEstadoId    = null;
  document.body.style.overflow = '';
}

async function onConfirmarEstado() {
  if (pendingEstadoId === null) return;
  const nuevoEstado = parseInt(modalSelect.value);
  const nombreEstado = nuevoEstado === 0 ? 'Activo' : 'Desactivado';

  setModalLoading(true);
  try {
    // PUT /api/Clientes/{id}?nuevoEstado={valor}
    await fetchJSON(`${API}/${pendingEstadoId}?nuevoEstado=${nuevoEstado}`, {
      method: 'PUT',
    });
    showToast(`Estado cambiado a "${nombreEstado}".`, 'success');
    cerrarModal();
    await cargarClientes();
  } catch (err) {
    showToast(`Error al cambiar estado: ${err.message}`, 'error');
    console.error(err);
  } finally {
    setModalLoading(false);
  }
}

// ── RENDER ────────────────────────────────────────────────────
function filtrarYRenderizar() {
  const q = searchInput.value.toLowerCase().trim();
  clientesFiltrados = q
    ? clientes.filter(c =>
        (c.name  || '').toLowerCase().includes(q) ||
        (c.email || '').toLowerCase().includes(q) ||
        String(c.id).includes(q)
      )
    : [...clientes];

  renderTabla(clientesFiltrados);
}

function renderTabla(lista) {
  if (lista.length === 0) {
    mostrarEstado(clientes.length === 0 ? 'empty' : 'empty');
    return;
  }
  mostrarEstado('table');
  tbody.innerHTML = '';

  lista.forEach((c, idx) => {
    const esActivo = c.estado === 0 || c.estado === 'Activo';
    const fechaStr = c.date
      ? new Date(c.date).toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' })
      : '—';

    const tr = document.createElement('tr');
    tr.dataset.id = c.id;
    tr.innerHTML = `
      <td class="td-id">#${c.id}</td>
      <td><strong>${escHtml(c.name)}</strong></td>
      <td>${escHtml(c.email)}</td>
      <td>${c.phone}</td>
      <td>
        <span class="badge ${esActivo ? 'badge-activo' : 'badge-desact'}">
          ${esActivo ? 'Activo' : 'Desactivado'}
        </span>
      </td>
      <td class="td-date">${fechaStr}</td>
      <td class="td-actions">
        <button class="btn-action btn-edit" data-id="${c.id}" data-nombre="${escAttr(c.name)}" data-estado="${c.estado}" title="Cambiar estado">
          ⇄ Estado
        </button>
        <button class="btn-action btn-del" data-id="${c.id}" data-nombre="${escAttr(c.name)}" title="Eliminar cliente">
          ✕ Borrar
        </button>
      </td>
    `;

    // Highlight nueva fila si fue recién creada
    if (idx === 0 && window._newClienteId && c.id === window._newClienteId) {
      tr.classList.add('row-new');
      window._newClienteId = null;
    }

    tbody.appendChild(tr);
  });

  // Delegación de eventos en tbody
  tbody.onclick = (e) => {
    const btnEdit = e.target.closest('.btn-edit');
    const btnDel  = e.target.closest('.btn-del');
    if (btnEdit) {
      const { id, nombre, estado } = btnEdit.dataset;
      onAbrirModalEstado(parseInt(id), nombre, parseInt(estado));
    }
    if (btnDel) {
      const { id, nombre } = btnDel.dataset;
      onEliminarPorId(parseInt(id), nombre);
    }
  };
}

function onSearch() {
  filtrarYRenderizar();
}

// ── ESTADÍSTICAS ──────────────────────────────────────────────
function actualizarStats() {
  const total   = clientes.length;
  const activos = clientes.filter(c => c.estado === 0 || c.estado === 'Activo').length;
  const inact   = total - activos;
  countTotal.textContent   = total;
  countActivos.textContent = activos;
  countDesact.textContent  = inact;
}

// ── ESTADOS DE VISTA ──────────────────────────────────────────
function mostrarEstado(estado) {
  loadingState.hidden = estado !== 'loading';
  emptyState.hidden   = estado !== 'empty';
  tableWrapper.hidden = estado !== 'table';
}

// ── VALIDACIONES ──────────────────────────────────────────────
function validarFormulario() {
  limpiarErrores();
  let valid = true;

  if (!inpName.value.trim()) {
    mostrarError('err-name', 'El nombre no puede estar vacío.');
    inpName.classList.add('error');
    valid = false;
  }
  if (!inpEmail.value.trim() || !inpEmail.value.includes('@')) {
    mostrarError('err-email', 'El email debe ser válido y contener "@".');
    inpEmail.classList.add('error');
    valid = false;
  }
  const phoneNum = Number(inpPhone.value.trim());
  if (!inpPhone.value.trim() || isNaN(phoneNum) || !Number.isInteger(phoneNum) || phoneNum <= 0) {
    mostrarError('err-phone', 'Ingresá un número de teléfono entero y válido.');
    inpPhone.classList.add('error');
    valid = false;
  }
  return valid;
}

function mostrarError(id, msg) {
  const el = document.getElementById(id);
  if (el) el.textContent = msg;
}

function limpiarErrores() {
  ['err-name', 'err-email', 'err-phone'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = '';
  });
  [inpName, inpEmail, inpPhone].forEach(el => el.classList.remove('error'));
}

// ── LOADING STATES ────────────────────────────────────────────
function setSubmitLoading(on) {
  btnSubmit.disabled       = on;
  submitLoader.hidden      = !on;
}

function setModalLoading(on) {
  modalConfirm.disabled    = on;
  modalLoader.hidden       = !on;
  modalCancel.disabled     = on;
}

// ── TOAST ─────────────────────────────────────────────────────
function showToast(msg, tipo = 'info') {
  const iconos = { success: '✓', error: '✕', info: 'i' };
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${tipo}`;
  toast.innerHTML = `
    <span class="toast-icon">${iconos[tipo] ?? 'i'}</span>
    <span class="toast-text">${escHtml(msg)}</span>
    <div class="toast-progress"></div>
  `;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(20px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ── UTILIDADES ────────────────────────────────────────────────
function escHtml(str) {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escAttr(str) {
  return String(str ?? '').replace(/"/g, '&quot;');
}
