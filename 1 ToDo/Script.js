const API_URL = "http://localhost:5231/api/tareas";

async function cargarTareas() {
    const res = await fetch(API_URL);
    const tareas = await res.json();

    const lista = document.getElementById("lista-tareas");
    lista.innerHTML = "";

    tareas.forEach(t => {
        const li = document.createElement("li");
        li.className = "task" + (t.completed ? " completed" : "");

        const info = document.createElement("span");
        info.textContent = `${t.name} — ${t.description}`;

        li.appendChild(info);

        if (!t.completed) {
            const btn = document.createElement("button");
            btn.textContent = "Completar";
            btn.onclick = () => completarTarea(t.id);
            li.appendChild(btn);
        }

        lista.appendChild(li);
    });
}

async function crearTarea() {
    const name = document.getElementById("name").value;
    const description = document.getElementById("description").value;

    if (!name || !description) return;

    await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description })
    });

    document.getElementById("name").value = "";
    document.getElementById("description").value = "";

    cargarTareas();
}

async function completarTarea(id) {
    await fetch(`${API_URL}/${id}`, { method: "PUT" });
    cargarTareas();
}

cargarTareas();
