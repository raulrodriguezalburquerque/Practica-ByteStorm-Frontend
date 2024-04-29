import { defineStore } from 'pinia'
import axios from "axios";

export const useOperativosStore = defineStore('operativos', {
    // Datos de la store
    state: () => ({
        // Operativo concreto buscado
        operativo: null,
        // Lista de operativos
        operativos: []
    }),
    // Funciones de la store
    actions: {
        // Funcion asincrona para conseguir los operativos
        async getOperativos() {
            // Hacemos la llamada HTTP GET para obtener la lista de operativos
            await axios.get("https://localhost:7057/api/Operativos")
                .then(response => { console.log(response);
                // Actualizamos la lista de operativos con la respuesta obtenida
                this.operativos = response.data;
            })
        },
        // Funcion asincrona para conseguir un operativo segun el ID
        async getOperativo(id) {
            // Hacemos la llamada HTTP GET para obtener el operativo
            await axios.get("https://localhost:7057/api/Operativos/"+id)
                .then(response => { console.log(response);
                // Actualizamos el operativo con la respuesta obtenida
                this.operativo = response.data;
            })
        },
        // Funcion asincrona para añadir un operativo a la lista
        async addOperativo(nombre, rol, misiones) {
            // Hacemos la llamada HTTP POST creando el nuevo operativo
            await axios.post("https://localhost:7057/api/Operativos", {
                nombre: nombre,
                rol: rol,
                misionesDTO: misiones
            }).then(response => { console.log(response); })
            .catch(error => { console.log(error); });
        },
        // Funcion asincrona para actualizar un operativo
        async updateOperativo(operativo, nombre, rol, misiones) {
            // Obtenemos el ID del operativo
            var id = operativo.id;
            // Hacemos la llamada HTTP PUT para actualizar el operativo
            await axios.put("https://localhost:7057/api/Operativos/"+id, {
                ID: id,
                nombre: nombre,
                rol: rol,
                misionesDTO: misiones
            }).then(response => { console.log(response); })
            .catch(error => { console.log(error); });
        },
        // Funcion asincrona para eliminar un operativo de la lista
        async removeOperativo(operativo) {
            // Obtenemos el id del operativo
            var id = operativo.id;
            // Hacemos la llamada HTTP DELETE para eliminar el operativo
            await axios.delete("https://localhost:7057/api/Operativos/"+id)
                .then(response => { console.log(response); })
                .catch(error => { console.log(error); });
        },
    }
})