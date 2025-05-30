import { config } from "dotenv"
import Database from "better-sqlite3"

config()

const rutaDB = process.env.DB_RUTA

export const database = new Database(rutaDB)

try {
    database.prepare("SELECT 1").get()
    console.log("Conexión a la base de datos realizada correctamente");
} catch (error) {
    console.error("Error al conectar a la base de datos: ", error.message);
}