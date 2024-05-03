import { defineStore } from 'pinia'
import { useMisionesStore } from "@/stores/misiones"
import axios from "axios";

export const useEquiposStore = defineStore('equipos', {
    // Datos de la store
    state: () => ({
        // Equipo concreto buscado
        equipo: null,
        // Lista de equipos
        equipos: [],
        // Lista de equipos disponibles
        equiposDisponibles: []
    }),
    // Getters de la store
    getters: {
        getterEquipo() { return this.equipo; },
        getterEquipos() { return this.equipos; },
        // Getter para los equipos con estado Disponible
        getterEquiposDisponibles() { return this.equipos.filter(e => e.estado == "Disponible"); }  
    },
    // Funcionalidad de la store
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
        // Funcion asincrona para conseguir un equipo segun el ID
        async getEquipo(id) {
            // Comprobamos si el array de equipos tiene ya el equipo
            var equipo = this.equipos.find((e) => e.id == id);
            // Si ya estaba en el array, guardamos el equipo
            if(equipo != undefined)
                this.equipo = equipo;
            // Realizamos la llamada HTTP para obtener el equipo
            else
                // Hacemos la llamada HTTP GET para obtener el equipo
                await axios.get("https://localhost:7057/api/Equipos/"+id)
                .then(response => { console.log(response);
                    // Actualizamos el equipo con la respuesta obtenida
                    this.equipo = response.data;
                })
        },
        // Funcion asincrona para añadir un equipo a la lista
        async addEquipo(tipo, descripcion) {
            // Hacemos la llamada HTTP POST creando el nuevo equipo
            await axios.post("https://localhost:7057/api/Equipos", {
                tipo: tipo,
                descripcion: descripcion,
                estado: "Disponible"
            }).then(response => { console.log(response); 
                // Añadimos el equipo creado al array
                this.equipos.push(response.data);
            })
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
                estado: equipo.estado,
                misionDTO: equipo.misionDTO
            }).then(async (response) => { console.log(response); 
                // Actualizamos la store de equipos y misiones
                await this.getEquipos();
                await useMisionesStore().getMisiones();
            })
            .catch(error => { console.log(error); });
        },
        // Funcion asincrona para eliminar un equipo de la lista
        async removeEquipo(equipo) {
            // Obtenemos el id del equipo
            var id = equipo.id;
            // Hacemos la llamada HTTP DELETE para eliminar el equipo
            await axios.delete("https://localhost:7057/api/Equipos/"+id)
                .then(async (response) => { console.log(response); 
                    // Filtramos el equipo eliminado del array
                    this.equipos = this.equipos.filter(e => e.id != id);
                    // Actualizamos la store de misiones
                    await useMisionesStore().getMisiones();
                })
                .catch(error => { console.log(error); });
        }
    }
})