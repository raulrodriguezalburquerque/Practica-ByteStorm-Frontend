import { defineStore } from 'pinia'
import { useMisionesStore } from "@/stores/misiones"
import { getEquiposAxios, getEquipoAxios, addEquipoAxios, updateEquipoAxios, removeEquipoAxios } from "@/api-calls/axios-equipos"

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
            // Actualizamos la lista de equipos con los obtenidos con la llamada a la API
            this.equipos = await getEquiposAxios();
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
                // Actualizamos el equipo con la respuesta obtenida
                this.equipo = await getEquipoAxios;
        },
        // Funcion asincrona para añadir un equipo a la lista
        async addEquipo(tipo, descripcion) {
            // Añadimos el equipo creado al array
            this.equipos.push(await addEquipoAxios(tipo, descripcion));
        },
        // Funcion asincrona para actualizar un equipo
        async updateEquipo(equipo, tipo, descripcion) {
            // Si podemos actualizar el equipo, actualizamos las stores
            if(await updateEquipoAxios(equipo, tipo, descripcion))
            {
                // Actualizamos la store de equipos y misiones
                await this.getEquipos();
                await useMisionesStore().getMisiones();
            }
        },
        // Funcion asincrona para eliminar un equipo de la lista
        async removeEquipo(equipo) {
            // Si podemos eliminar el equipo, actualizamos las stores
            if(await removeEquipoAxios(equipo))
            {
                // Filtramos el equipo eliminado del array
                this.equipos = this.equipos.filter(e => e.id != equipo.id);
                // Actualizamos la store de misiones
                await useMisionesStore().getMisiones();
            }
        }
    }
})