import { defineStore } from 'pinia'
import axios from "axios";

export const useEquiposStore = defineStore('equipos', {
    // Datos de la store
    state: () => ({
        // Lista de equipos
        equipos: [],
        // Lista de equipos disponibles
        equiposDisponibles: []
    }),
    // Funciones de la store
    actions: {
        // Funcion asincrona para conseguir los equipos
        async getEquipos() {
            // Hacemos la llamada HTTP GET para obtener la lista de equipos
            await axios.get("https://localhost:7057/api/Equipos")
                .then(response => { console.log(response);
                // Actualizamos la lista de equipos con la respuesta obtenida
                this.equipos = response.data;
            })
        },
        // Funcion asincrona para obtener los equipos disponibles
        async getEquiposDisponibles()
        {
            // Hacemos la llamada HTTP GET para obtener la lista de equipos disponibles
            await axios.get("https://localhost:7057/api/Equipos/Disponibles")
                .then(response => { console.log(response);
                // Actualizamos la lista de equipos disponibles con la respuesta obtenida
                this.equiposDisponibles = response.data;
            })
        },
        // Funcion asincrona para añadir un equipo a la lista
        async addEquipo(tipo, descripcion) {
            // Hacemos la llamada HTTP POST creando el nuevo equipo
            await axios.post("https://localhost:7057/api/Equipos", {
                tipo: tipo,
                descripcion: descripcion,
                estado: "Disponible"
            }).then(response => { console.log(response); })
            .catch(error => { console.log(error); });
        },
        // Funcion asincrona para actualizar un equipo
        async updateEquipo(equipo, tipo, descripcion) {
            // Obtenemos el ID del equipo
            var id = equipo.id;
            // Hacemos la llamada HTTP PUT para actualizar el equipo
            await axios.put("https://localhost:7057/api/Equipos/"+id, {
                ID: id,
                tipo: tipo,
                descripcion: descripcion,
                estado: equipo.estado
            }).then(response => { console.log(response); })
            .catch(error => { console.log(error); });
        },
        // Funcion asincrona para eliminar un equipo de la lista
        async removeEquipo(equipo) {
            // Obtenemos el id del equipo
            var id = equipo.id;
            // Hacemos la llamada HTTP DELETE para eliminar el equipo
            await axios.delete("https://localhost:7057/api/Equipos/"+id)
                .then(response => { console.log(response); })
                .catch(error => { console.log(error); });
        }
    }
})