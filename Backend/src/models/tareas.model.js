import { database } from "../database/database.js";

export const crearTarea = (tarea) => {
    try {
        const {titulo, descripcion} = tarea;

        const query = `INSERT INTO tareas (titulo, descripcion) VALUES (?, ?)`;
        const stmt = database.prepare(query);
        const result = stmt.run(titulo, descripcion);

        if(result.changes > 0){
            return {status: 201, message: "Tarea creada correctamente", idCreado: result.lastInsertRowid};
        }else {
            throw new Error("No se pudo crear la tarea");
        }
    } catch (error) {
        return {status: 500, message: error.message};
    }
}

export const obtenerTareas = () => {
    try {
        const query = `SELECT id, titulo, descripcion, status, fechaCreacion, fechaActualizacion FROM tareas`;
        const stmt = database.prepare(query);
        const tareas = stmt.all();

        if(tareas.length > 0){
            return {status: 200, message: "Tareas obtenidas correctamente", data: tareas};
        }else{
            return {status: 404, message: "No se encontraron tareas"};
        }
    } catch (error) {
        return {status: 500, message: error.message};
    }
}

export const obtenerTareaPorId = (id) => {
    try {
        const query = `SELECT id, titulo, descripcion, status, fechaCreacion, fechaActualizacion FROM tareas WHERE id = ?`;
        const stmt = database.prepare(query);
        const tarea = stmt.get(id);

        if(tarea){
            return {status: 200, message: "Tarea obtenida correctamente", data: tarea};
        }else{
            return {status: 404, message: "Tarea no encontrada"};
        }
    } catch (error) {
        return {status: 500, message: error.message};
    }
}

export const actualizarTarea = (id, status) => {
    try {
        const query = `UPDATE tareas SET status = ?, fechaActualizacion = datetime('now', 'localtime') WHERE id = ?`;
        const stmt = database.prepare(query);
        const result = stmt.run(status, id);

        if(result.changes > 0){
            return {status: 201, message: "Tarea actualizada correctamente"};
        }else {
            throw new Error("No se pudo actualizar la tarea");
        }
    } catch (error) {
        return {status: 500, message: error.message};
    }
}

export const eliminarTarea = (id) => {
    try {
        const query = `DELETE FROM tareas WHERE id = ?`;
        const stmt = database.prepare(query);
        const result = stmt.run(id);

        if(result.changes > 0){
            return {status: 200, message: "Tarea eliminada correctamente"};
        }else{
            return {status: 404, message: "Tarea no encontrada, puede que ya haya sido eliminada"};
        }
    } catch (error) {
        return {status: 500, message: error.message};
    }
}