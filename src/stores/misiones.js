import { defineStore } from 'pinia'
import axios from "axios";

export const useMisionesStore = defineStore('misiones', {
    // Datos de la store
    state: () => ({
        // Mision concreta buscada
        mision: null,
        // Lista de misiones
        misiones: [],
        // Lista de misiones planificadas
        misionesPlanificadas: []
    }),
    // Funciones de la store
    actions: {
        // Funcion asincrona para conseguir las misiones
        async getMisiones() {
            // Hacemos la llamada HTTP GET para obtener la lista de misiones
            await axios.get("https://localhost:7057/api/Misiones")
                .then(response => { console.log(response); 
                // Actualizamos la lista de misiones con la respuesta obtenida
                this.misiones = response.data;
            })
        },
        // Funcion asincrona para conseguir una mision segun el codigo
        async getMision(codigo) {
            // Hacemos la llamada HTTP GET para obtener la mision
            await axios.get("https://localhost:7057/api/Misiones/"+codigo)
                .then(response => { console.log(response);
                // Actualizamos la mision con la respuesta obtenida
                this.mision = response.data;
            })
        },
        // Funcion asincrona para obtener las misiones planificadas
        async getMisionesPlanificadas()
        {
            // Hacemos la llamada HTTP GET para obtener la lista de misiones planificadas
            await axios.get("https://localhost:7057/api/Misiones/Planificadas")
                .then(response => { console.log(response);
                // Actualizamos la lista de misiones planificadas con la respuesta obtenida
                this.misionesPlanificadas = response.data;
            })
        },
        // Funcion asincrona para añadir una mision a la lista
        async addMision(descripcion, operativo, equipos) {
            // Hacemos la llamada HTTP POST creando la nueva mision
            await axios.post("https://localhost:7057/api/Misiones", {
                descripcion: descripcion,
                estado: "Planificada",
                operativoDTO: operativo,
                equiposDTO: equipos
            }).then(response => { console.log(response); })
            .catch(error => { console.log(error); });
        },
        // Funcion asincrona para actualizar una mision
        async updateMision(mision, descripcion, operativo, equipos) {
            // Obtenemos el codigo de la mision
            var code = this.mision.codigo;
            // Hacemos la llamada HTTP PUT para actualizar la mision
            await axios.put("https://localhost:7057/api/Misiones/"+code, {
                codigo: code,
                descripcion: descripcion,
                estado: mision.estado,
                operativoDTO: operativo,
                equiposDTO: equipos
            }).then(response => { console.log(response); })
            .catch(error => { console.log(error); });
        },
        // Funcion asincrona para eliminar una mision de la lista
        async removeMision(mision) {
            // Obtenemos el codigo de la mision
            var code = mision.codigo;
            // Hacemos la llamada HTTP DELETE para eliminar la mision
            await axios.delete("https://localhost:7057/api/Misiones/"+code)
                .then(response => { console.log(response); })
                .catch(error => { console.log(error); });
        }
    }
})