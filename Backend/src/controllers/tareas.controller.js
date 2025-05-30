import { crearTarea, obtenerTareas, obtenerTareaPorId, actualizarTarea, eliminarTarea } from "../models/tareas.model.js";
import { wss } from "../index.js";

export const crearTareaController = (req, res) => {
    try {
        const titulo = req.body.titulo;
        const descripcion = req.body.descripcion.trim().length > 0 ? req.body.descripcion : null;

        if(!titulo || titulo.length > 100){
            return res.status(400).json({ message: "El título es obligatorio y no puede exceder los 100 caracteres" });
        }

        if(descripcion && descripcion.length > 500){
            return res.status(400).json({ message: "La descripción no puede exceder los 500 caracteres" });
        }

        const tarea = { titulo, descripcion };

        const result = crearTarea(tarea);

        if(result.status === 201) {
            wss.clients.forEach(client => {
            if(client.readyState === client.OPEN){
                client.send(JSON.stringify({
                    action : "NuevaTarea",
                    payload: {
                        id: result.idCreado,
                        tarea
                    }
                }))
            }
        })
        }

        return res.status(result.status).json({ status: result.status, message: result.message });

    } catch (error) {
        console.log("Error al crear la tarea:", error);
        return res.status(500).json({ message: error.message });
    }
}

export const obtenerTareasController = (req, res) => {  
    try {
        const tareas = obtenerTareas();
        return res.status(tareas.status).json({ status: tareas.status, message: tareas.message, data: tareas.data });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const obtenerTareaPorIdController = (req, res) => {
    try {
        const id = req.params.id;
        const tarea = obtenerTareaPorId(id);
        return res.status(tarea.status).json({ status: tarea.status, message: tarea.message, data: tarea.data });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const actualizarTareaController = (req, res) => {
    try {
        const id = req.params.id;
        const status = req.body.status;

        if(!status || status.trim().length === 0){
            return res.status(400).json({ message: "El estado es obligatorio" });
        }

        const result = actualizarTarea(id, status);

        if(result.status === 201){
            wss.clients.forEach(client => {
            if(client.readyState === client.OPEN){
                client.send(JSON.stringify({
                    action : "ActualizacionTarea",
                    payload: {
                        id,
                        status
                    }
                }))
            }
        })
        }

        return res.status(result.status).json({ status: result.status, message: result.message });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}

export const eliminarTareaController = (req, res) => {
    try {
        const id = req.params.id;
        const result = eliminarTarea(id);

        if(result.status === 200){
            wss.clients.forEach(client => {
            if(client.readyState === client.OPEN){
                client.send(JSON.stringify({
                    action : "EliminacionTarea",
                    payload: {
                        id
                    }
                }))
            }
        })
        }

        return res.status(result.status).json({ status: result.status, message: result.message });

    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}