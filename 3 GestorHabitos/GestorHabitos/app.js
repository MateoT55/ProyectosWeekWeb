/* ===================================
   app.js — Gestor de Hábitos
   API Base: https://localhost:7095/api/Habitos
   =================================== */

const API_BASE = 'https://localhost:7095/api/Habitos';

// ── Estado del modal ──────────────────────────────────
let modalCallback = null;

// ─────────────────────────────────────────────────────
//  TOAST NOTIFICATIONS
// ─────────────────────────────────────────────────────
let toastTimer = null;

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = 'toast show';
  if (type === 'error') toast.classList.add('toast--error');
  if (type === 'warn')  toast.classList.add('toast--warn');

  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3200);
}

// ─────────────────────────────────────────────────────
//  MODAL DE CONFIRMACIÓN
// ─────────────────────────────────────────────────────
function abrirModal(titulo, cuerpo, onConfirm) {
  document.getElementById('modalTitle').textContent = titulo;
  document.getElementById('modalBody').textContent  = cuerpo;
  document.getElementById('modalOverlay').classList.remove('hidden');
  modalCallback = onConfirm;

  document.getElementById('modalConfirmBtn').onclick = async () => {
    cerrarModal();
    await onConfirm();
  };
}

function cerrarModal() {
  document.getElementById('modalOverlay').classList.add('hidden');
  modalCallback = null;
}

// Cerrar modal al clickear el overlay
document.getElementById('modalOverlay').addEventListener('click', (e) => {
  if (e.target === document.getElementById('modalOverlay')) cerrarModal();
});

// ─────────────────────────────────────────────────────
//  UTILIDADES DE ESTADOS DE LA TABLA
// ─────────────────────────────────────────────────────
function mostrarEstado(estado) {
  // 'loading' | 'empty' | 'error' | 'table'
  document.getElementById('stateLoading').classList.add('hidden');
  document.getElementById('stateEmpty').classList.add('hidden');
  document.getElementById('stateError').classList.add('hidden');
  document.getElementById('tableWrapper').classList.add('hidden');

  if (estado === 'loading') {
    document.getElementById('stateLoading').classList.remove('hidden');
  } else if (estado === 'empty') {
    document.getElementById('stateEmpty').classList.remove('hidden');
  } else if (estado === 'error') {
    document.getElementById('stateError').classList.remove('hidden');
  } else if (estado === 'table') {
    document.getElementById('tableWrapper').classList.remove('hidden');
  }
}

// ─────────────────────────────────────────────────────
//  FORMATEAR FECHA
// ─────────────────────────────────────────────────────
function formatearFecha(isoString) {
  if (!isoString) return '—';
  const d = new Date(isoString);
  if (isNaN(d)) return isoString;
  return d.toLocaleString('es-AR', {
    day:    '2-digit',
    month:  '2-digit',
    year:   'numeric',
    hour:   '2-digit',
    minute: '2-digit',
  });
}

// ─────────────────────────────────────────────────────
//  RENDERIZAR TABLA
// ─────────────────────────────────────────────────────
function renderizarTabla(habitos) {
  const tbody = document.getElementById('habitosTableBody');
  tbody.innerHTML = '';

  habitos.forEach(h => {
    const esCumplido = h.estado === 1 || h.estado === 'Cumplido';
    const estadoLabel = esCumplido ? 'Cumplido' : 'Pendiente';
    const siguienteEstado = esCumplido ? 0 : 1;
    const siguienteLabel  = esCumplido ? 'Marcar Pendiente' : 'Marcar Cumplido';

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td class="cell-id">#${h.id}</td>
      <td class="cell-name">${escapeHtml(h.name)}</td>
      <td class="cell-desc" title="${escapeHtml(h.desc)}">${escapeHtml(h.desc)}</td>
      <td class="cell-date">${formatearFecha(h.date)}</td>
      <td>
        <span
          class="badge badge--${estadoLabel.toLowerCase()}"
          title="${siguienteLabel}"
          onclick="cambiarEstado(${h.id}, ${siguienteEstado})"
        >
          <span class="badge-dot"></span>
          ${estadoLabel}
        </span>
      </td>
      <td class="cell-actions">
        <button class="btn-delete" onclick="confirmarEliminarUno(${h.id})" title="Eliminar hábito #${h.id}">
          ✕
        </button>
      </td>
    `;

    // Animación de entrada con delay escalonado
    tr.style.opacity = '0';
    tr.style.transform = 'translateY(8px)';
    tbody.appendChild(tr);
    requestAnimationFrame(() => {
      tr.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
      tr.style.opacity = '1';
      tr.style.transform = 'translateY(0)';
    });
  });
}

// Escapar HTML para evitar XSS
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// ─────────────────────────────────────────────────────
//  GET — CARGAR TODOS LOS HÁBITOS
// ─────────────────────────────────────────────────────
async function cargarHabitos() {
  mostrarEstado('loading');

  try {
    const res = await fetch(`${API_BASE}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const habitos = await res.json();

    if (!Array.isArray(habitos) || habitos.length === 0) {
      mostrarEstado('empty');
    } else {
      mostrarEstado('table');
      renderizarTabla(habitos);
    }

  } catch (err) {
    console.error('Error al cargar hábitos:', err);
    mostrarEstado('error');
  }
}

// ─────────────────────────────────────────────────────
//  POST — CREAR HÁBITO
// ─────────────────────────────────────────────────────
async function crearHabito() {
  const name   = document.getElementById('habitName').value.trim();
  const desc   = document.getElementById('habitDesc').value.trim();
  const date   = document.getElementById('habitDate').value;
  const estado = parseInt(document.getElementById('habitEstado').value);

  // Validación básica
  if (!name) {
    showToast('El nombre del hábito es requerido.', 'warn');
    document.getElementById('habitName').focus();
    return;
  }

  if (!date) {
    showToast('La fecha es requerida.', 'warn');
    document.getElementById('habitDate').focus();
    return;
  }

  const btn = document.getElementById('btnCrear');
  btn.disabled = true;
  btn.innerHTML = '<span class="spinner" style="width:14px;height:14px;margin:0 auto"></span>';

  // El body que espera el backend según la clase Habito
  const body = {
    name,
    desc,
    estado,
    date: new Date(date).toISOString(),
  };

  try {
    const res = await fetch(`${API_BASE}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const msg = await res.text().catch(() => '');
      throw new Error(msg || `HTTP ${res.status}`);
    }

    // Limpiar formulario
    document.getElementById('habitName').value  = '';
    document.getElementById('habitDesc').value  = '';
    document.getElementById('habitDate').value  = '';
    document.getElementById('habitEstado').value = '0';

    showToast('✓ Hábito creado exitosamente');
    await cargarHabitos();

  } catch (err) {
    console.error('Error al crear hábito:', err);
    showToast(`Error al crear el hábito: ${err.message}`, 'error');
  } finally {
    btn.disabled = false;
    btn.innerHTML = '<span class="btn-icon">+</span><span>Registrar Hábito</span>';
  }
}

// ─────────────────────────────────────────────────────
//  PUT — CAMBIAR ESTADO (usando CambiarEstadoDTO)
// ─────────────────────────────────────────────────────
async function cambiarEstado(id, nuevoEstado) {
  // nuevoEstado: 0 = Pendiente, 1 = Cumplido

  const dto = { estado: nuevoEstado };

  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });

    if (res.status === 404) {
      showToast(`Hábito #${id} no encontrado.`, 'warn');
      return;
    }

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const label = nuevoEstado === 1 ? 'Cumplido' : 'Pendiente';
    showToast(`✓ Hábito #${id} marcado como ${label}`);
    await cargarHabitos();

  } catch (err) {
    console.error('Error al cambiar estado:', err);
    showToast(`Error al cambiar estado: ${err.message}`, 'error');
  }
}

// ─────────────────────────────────────────────────────
//  DELETE — ELIMINAR UN HÁBITO
// ─────────────────────────────────────────────────────
function confirmarEliminarUno(id) {
  abrirModal(
    `Eliminar hábito #${id}`,
    `¿Querés eliminar el hábito #${id}? Esta acción no se puede deshacer.`,
    () => eliminarHabito(id)
  );
}

async function eliminarHabito(id) {
  try {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    showToast(`✓ Hábito #${id} eliminado`);
    await cargarHabitos();

  } catch (err) {
    console.error('Error al eliminar hábito:', err);
    showToast(`Error al eliminar hábito: ${err.message}`, 'error');
  }
}

// ─────────────────────────────────────────────────────
//  DELETE — ELIMINAR TODOS LOS HÁBITOS
// ─────────────────────────────────────────────────────
function confirmarEliminarTodo() {
  abrirModal(
    'Eliminar TODOS los hábitos',
    'Esta acción eliminará permanentemente toda la colección de hábitos. ¿Estás completamente seguro?',
    () => eliminarTodos()
  );
}

async function eliminarTodos() {
  try {
    const res = await fetch(`${API_BASE}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    showToast('✓ Todos los hábitos fueron eliminados', 'warn');
    await cargarHabitos();

  } catch (err) {
    console.error('Error al eliminar colección:', err);
    showToast(`Error al eliminar colección: ${err.message}`, 'error');
  }
}

// ─────────────────────────────────────────────────────
//  KEYBOARD SHORTCUTS
// ─────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
  // Escape cierra el modal
  if (e.key === 'Escape') cerrarModal();

  // Enter en el input de nombre dispara crear si el form tiene foco
  if (e.key === 'Enter' && document.activeElement?.id === 'habitName') {
    crearHabito();
  }
});

// ─────────────────────────────────────────────────────
//  INIT
// ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Set default date to now
  const now = new Date();
  const local = new Date(now - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  document.getElementById('habitDate').value = local;

  // Cargar hábitos al iniciar
  cargarHabitos();
});
