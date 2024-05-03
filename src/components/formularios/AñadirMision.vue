<template>
    <!-- Cuadro con el formulario -->
    <v-sheet :elevation="5" class="ma-2">
        <v-form ref="formularioAñadir">
            <!-- Campo de texto para la descripcion -->
            <v-text-field v-model=descripcion label="Descripcion" required
            :rules="[value => value && value.length >= 1 || 'Es obligatorio rellenar este campo']" />
            <!-- Selector de operativo -->
            <v-select label="Operativo" :items="listaOperativos" item-title="nombre" 
            v-model="operativoSeleccionado" return-object clearable>
                <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :subtitle="item.raw.rol"></v-list-item>
                </template>
            </v-select>
            <!-- Campo de seleccion de equipos -->
            <v-select label="Equipos disponibles" v-model="equiposSeleccionados" :items="equiposDisponibles"
            item-title="descripcion" item-value="id" chips multiple return-object />
            <!-- Boton de añadir -->
            <v-btn @click=addMision class="mt-2" block>Añadir</v-btn>
        </v-form>
    </v-sheet>
</template>

<script>
    import { useMisionesStore } from "@/stores/misiones";
    import { useOperativosStore } from "@/stores/operativos";
    import { useEquiposStore } from "@/stores/equipos";

    export default {
        name: 'AñadirMision',

        data: () => ({
            // Stores para las misiones, operativos y equipos
            storeMisiones: useMisionesStore(),
            storeOperativos: useOperativosStore(),
            storeEquipos: useEquiposStore(),

            // Lista de equipos disponibles
            equiposDisponibles: [],

            // Lista de operativos
            listaOperativos: [],

            // Descripcion, operativo y equipos seleccionados del formulario
            descripcion: '',
            operativoSeleccionado: null,
            equiposSeleccionados: []
        }),

        methods: {
            // Funcion asincrona para añadir una mision a la lista
            async addMision() {
                // Comprobamos que el formulario se haya rellenado correctametne
                const { valid } = await this.$refs.formularioAñadir.validate();
                if(valid) {
                    // Hacemos que la store añada la nueva mision
                    await this.storeMisiones.addMision(this.descripcion, this.operativoSeleccionado,
                        this.equiposSeleccionados);
                    // Conseguimos la lista de equipos disponibles actualizada
                    this.getEquiposDisponibles();
                    // Reseteamos el formulario
                    this.$refs.formularioAñadir.reset();
                    // Emitimos un evento para que el componente padre se actualice
                    this.$emit('mision-añadida');
                }
            },
            // Funcion asincrona para conseguir los operativos
            async getOperativos() {
                // Hacemos que la store obtenga los operativos
                await this.storeOperativos.getOperativos();
                // Obtenemos los operativos de la store
                this.listaOperativos = this.storeOperativos.operativos;
            },
            // Funcion asincrona para obtener los equipos disponibles
            async getEquiposDisponibles()
            {
                // Hacemos que la store obtenga los equipos disponibles
                await this.storeEquipos.getEquiposDisponibles();
                // Obtenemos los equipos de la store
                this.equiposDisponibles = this.storeEquipos.equiposDisponibles;
            }
        },

        created: function() {
            // Obtenemos la lista de operativos y equipos disponibles
            this.getOperativos();
            this.getEquiposDisponibles();
        }
    }
</script>