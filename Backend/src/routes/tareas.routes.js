import { crearTareaController, obtenerTareasController, obtenerTareaPorIdController, actualizarTareaController, eliminarTareaController } from "../controllers/tareas.controller.js";
import { Router } from "express";

const router = Router();

router.post("/tasks", crearTareaController);
router.get("/tasks", obtenerTareasController);
router.get("/tasks/:id", obtenerTareaPorIdController);
router.put("/tasks/:id", actualizarTareaController);
router.delete("/tasks/:id", eliminarTareaController);

export default router;