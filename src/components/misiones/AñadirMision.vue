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
            item-title="descripcion" item-value="id" chips multiple return-object>
                <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :subtitle="item.raw.tipo"></v-list-item>
                </template>
            </v-select>
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
                    // Reseteamos el formulario
                    this.$refs.formularioAñadir.reset();
                }
            }
        },

        computed: {
            // Lista con los operativos
            listaOperativos() {
                // Obtenemos los operativos de la store
                return this.storeOperativos.getterOperativos;
            },
            // Lista con los equipos disponibles
            equiposDisponibles() {
                // Obtenemos los equipos disponibles de la store
                return this.storeEquipos.getterEquiposDisponibles;
            }
        }
    }
</script>