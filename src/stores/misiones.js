import { defineStore } from 'pinia'
import { useEquiposStore } from "@/stores/equipos"
import { useOperativosStore } from "@/stores/operativos"
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
    // Getters de la store
    getters: {
        getterMision() { return this.mision; },
        getterMisiones() { return this.misiones; },
        // Getter para las misiones con estado Planificada
        getterMisionesPlanificadas() { return this.misiones.filter(m => m.estado == "Planificada"); }  
    },
    // Funcionalidad de la store
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
            // Comprobamos si el array de misiones tiene ya la mision
            var mision = this.misiones.find((m) => m.codigo == codigo);
            // Si ya estaba en el array, guardamos la mision
            if(mision != undefined)
                this.mision = mision;
            // Realizamos la llamada HTTP para obtener la mision
            else
                // Hacemos la llamada HTTP GET para obtener la mision
                await axios.get("https://localhost:7057/api/Misiones/"+codigo)
                    .then(response => { console.log(response);
                    // Actualizamos la mision con la respuesta obtenida
                    this.mision = response.data;
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
            }).then(async (response) => { console.log(response); 
                // Añadimos la mision creada al array
                this.misiones.push(response.data);
                // Actualizamos las stores de equipos y operativos
                await useEquiposStore().getEquipos();
                await useOperativosStore().getOperativos();
            })
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
            }).then(async (response) => { console.log(response); 
                // Actualizamos las stores de equipos, misiones y operativos
                await this.getMisiones();
                await useEquiposStore().getEquipos();
                await useOperativosStore().getOperativos();
            })
            .catch(error => { console.log(error); });
        },
        // Funcion asincrona para completar una mision de la lista
        async completarMision(mision) {
            // Obtenemos el codigo de la mision
            var code = mision.codigo;
            // Hacemos la llamada HTTP PUT para completar la mision
            await axios.put("https://localhost:7057/api/Misiones/Completar/"+code)
                .then(async (response) => { console.log(response); 
                    // Actualizamos las stores de equipos, misiones y operativos
                    await this.getMisiones();
                    await useEquiposStore().getEquipos();
                    await useOperativosStore().getOperativos();
                })
                .catch(error => { console.log(error); });
        },
        // Funcion asincrona para eliminar una mision de la lista
        async removeMision(mision) {
            // Obtenemos el codigo de la mision
            var code = mision.codigo;
            // Hacemos la llamada HTTP DELETE para eliminar la mision
            await axios.delete("https://localhost:7057/api/Misiones/"+code)
                .then(async (response) => { console.log(response); 
                    // Filtramos la mision eliminada del array
                    this.misiones = this.misiones.filter(m => m.codigo != code);
                    // Actualizamos las stores de equipos y operativos
                    await useEquiposStore().getEquipos();
                    await useOperativosStore().getOperativos();
                })
                .catch(error => { console.log(error); });
        }
    }
})