
# API Gestión de tareas

Para configurar el entorno de desarrollo se deben instalar las siguientes dependencias, voy a omitir la instalación de NodeJs, estoy ocupando la versión 23.10.0

* better-sqlite3
* express
* cors
* ws
* dotenv

Para instalar estas dependencias primero debe ubicarse con la consola en la carpeta Backend.

Luego debe ejecutar el comando ``` npm install ```

Esto instalará las dependencias necesarias para ejecutar el proyecto.

## Ejecución del backend

Deje añadido el archivo .env para que no haya problemas al querer probarlo, esto no se debería hacer pero en esta ocasión lo voy a subir, consta de lo siguiente:

* DB_RUTA, que es la ruta donde se guardo la base de datos SQLite, en mi caso la guardé en "./src/database/todo.db" pero puede ser modificada acá.

* SERVER_PORT, es el puerto en el que se va a ejecutar la API, yo la tenía en el puerto 5178 pero en caso de estar ocupado queda a elección propia el puerto que se quiera ocupar, no olvidar que hay que cambiar el puerto también en el archivo del frontend.

Una vez configurado se debe ejecutar el comando ``` npm start ``` para iniciar el proyecto, debería mostrar un mensaje indicando que se conectó exitosamente a la base de datos y que el servidor está corriendo en el puerto que le fue indicado.

## Ejecución del frontend
Para ejecutar el frontend, bastaría con abrir el archivo index.html que está en la carpeta Frontend con algún navegador, fue probado con exito en Chrome, Firefox y Safari.

## Explicación del diseño
En el diseño de la API, elegí separar todas las funcionalidades, separando en modelo, controlador y rutas para poder realizar una mejor mantención del código y poder encontrar y corregir bugs de una mejor forma. De esta manera pude implementar websockets de forma eficiente en las funciones que debían tenerlo.

Mi idea era que al momento de crear, modificar o eliminar las tareas actuará el websocket, emitiendo un mensaje con los datos solicitados en la prueba, mensaje que sería tomado por el frontend, lo cual se ejecuta una vez el controlador reciba la respuesta de que los datos fueron creados o modificados correctamente.

En el frontend hay una variable "tareas" la cual en el primer ingreso a la página obtiene todas las tareas desde la API, luego dependiendo de los mensajes que recibe por el websocket iría añadiendo, eliminando o modificando los elementos que están guardados dentro de la variable, luego se ejecuta una función que actualiza la lista con los datos que tenga la variable tareas, de esta manera se cumple la funcionalidad de que la lista se actualice dinámicamente con los eventos del servidor.

Me hubiera gustado implementar algunas mejoras al sistema las cuales explico a continuación:

* Una tabla para los estados: Con la creación de otra tabla en la base de datos para guardar los estados que pueden tener las tareas, se pudo haber tenido un mejor control, evitando problemas al ingresar valores como "Completado" o "completado", que pueden afectar a futuro si se intenta obtener la cantidad total de tareas que fueron completadas. Además se pudo haber agregado estados como "En progreso", "Cancelada", "Postergada", etc.

* En vez de eliminar, cambiar a estado eliminado: Con el fin de evitar eliminaciones accidentales de datos, o eliminaciones hechas por terceros pudo haber sido mejor cambiar el estado de la tarea a eliminado, y en la consulta SQL definir que solo muestre las tareas cuyo estado es distinto a eliminado.

* Obtener datos completos en el websocket: Si en los eventos del servidor que están relacionados con el websocket se hubiera ejecutado una función que retornara todos los datos del id asociado en vez de solo algunos, se podría haber tenido más control sobre los datos que estaban llegando al frontend, para así poder incluir toda la información de la tarea.
