const ip = "localhost";
const port = "5178";

let tareas = {};

const listaTareas = document.getElementById("listaTareas");

function mostrarTareas() {
    console.log("Mostrando tareas: ", tareas);

    listaTareas.innerHTML = "";
    Object.values(tareas).forEach(tarea => {
        const li = document.createElement("li");

        li.innerHTML = `Titulo:<br> ${tarea.titulo}<br><br>Descripcion:<br> ${tarea.descripcion}<br><br>Estado:<br> ${tarea.status}<br>`;

        const eliminarBtn = document.createElement("button");
        eliminarBtn.textContent = "Eliminar";
        eliminarBtn.onclick = () => eliminarTarea(tarea.id);

        const completarBtn = document.createElement("button");
        completarBtn.textContent = "Completar";
        completarBtn.disabled = tarea.status === "completada";
        completarBtn.onclick = () => completarTarea(tarea.id);

        li.appendChild(eliminarBtn);
        li.appendChild(completarBtn);

        listaTareas.appendChild(li);
    });
}

function eliminarTarea(id) {
    fetch(`http://${ip}:${port}/tasks/${id}`, {
        method: "DELETE"
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al eliminar la tarea');
    })
    .catch(error => {
        console.error('Error eliminando tarea:', error);
    });
}

function completarTarea(id) {
    fetch(`http://${ip}:${port}/tasks/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: "completada" }),
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => {
        if (!response.ok) throw new Error('Error al completar la tarea');
    })
    .catch(error => {
        console.error('Error completando tarea:', error);
    });
}

fetch(`http://${ip}:${port}/tasks`)
    .then(response => {
        if (!response.ok) throw new Error('Error en la respuesta');
        return response.json();
    })
    .then(data => {
        if (data.status === 200) {
            tareas = {};
            for (const tarea of data.data) {
                tareas[tarea.id] = tarea;
            }
            mostrarTareas();
        } else {
            listaTareas.innerHTML = `<li>${data.message}</li>`;
        }
    })
    .catch(error => {
        console.error('Hubo un error:', error);
    });

const formulario = document.getElementById("tareaForm");

formulario.addEventListener("submit", function (event) {
    event.preventDefault();

    const titulo = document.getElementById("tituloTareaInput").value;
    const descripcion = document.getElementById("descripcionTareaInput").value;

    fetch(`http://${ip}:${port}/tasks`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ titulo, descripcion })
    })
    .then(response => {
        if (!response.ok) throw new Error('Error en la respuesta');
        document.getElementById("tituloTareaInput").value = "";
        document.getElementById("descripcionTareaInput").value = "";
        return response.json();
    })
    .catch(error => {
        console.error("Error creando tarea:", error);
    });
});

// --- WebSocket ---
const socket = new WebSocket(`ws://${ip}:${port}`);

socket.addEventListener('open', () => {
    console.log('Conectado al servidor WebSocket');
});

socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);

    if (data.action === 'NuevaTarea') {
        obtenerTareaId(data.payload.id);
    } else if (data.action === 'ActualizacionTarea') {
        if (tareas[data.payload.id]) {
            tareas[data.payload.id].status = data.payload.status;
        }
        obtenerTareaId(data.payload.id);
    } else if (data.action === 'EliminacionTarea') {
        delete tareas[data.payload.id];
        mostrarTareas();
    }
});

socket.addEventListener('close', () => {
    console.log('Desconectado del servidor WebSocket');
});

socket.addEventListener('error', (err) => {
    console.error('Error WebSocket:', err);
});

function obtenerTareaId(id) {
    fetch(`http://${ip}:${port}/tasks/${id}`)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error al obtener la tarea');
        }
        return response.json();
    }).then(data => {
        if (data.status === 200) {
            tareas[data.data.id] = data.data;
            mostrarTareas();
        } else {
            console.error(data.message);
        }
    });
}