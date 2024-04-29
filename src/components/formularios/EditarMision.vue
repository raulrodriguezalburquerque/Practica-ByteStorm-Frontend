<template>
    <!-- Cuadro con el formulario -->
    <v-sheet :elevation="5" style="max-width: 50%; margin-left: 25%;">
        <v-form ref="formularioEditar">
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
            <v-select label="Equipos disponibles" v-model="equiposSeleccionados" :items="equiposDisponiblesSeleccionar"
            item-title="descripcion" chips multiple return-object />
            <!-- Boton de editar -->
            <v-btn @click=updateMision class="mt-2" block>Editar</v-btn>
        </v-form>
    </v-sheet>
</template>

<script>
    import { useMisionesStore } from "@/stores/misiones";
    import { useOperativosStore } from "@/stores/operativos";
    import { useEquiposStore } from "@/stores/equipos";

    export default {
        name: 'EditarMision',

        data: () => ({
            // Stores para las misiones, operativos y equipos
            storeMisiones: useMisionesStore(),
            storeOperativos: useOperativosStore(),
            storeEquipos: useEquiposStore(),
            
            // Lista de equipos disponibles
            equiposDisponibles: [],

            // Lista de operativos
            listaOperativos: [],

            // Mision que se va a editar
            mision: null,
            // Descripcion, operativo y equipos seleccionados del formulario
            descripcion: '',
            operativoSeleccionado: null,
            equiposSeleccionados: [],
            // Equipos disponibles para seleccionar
            equiposDisponiblesSeleccionar: []
        }),

        methods: {
            // Funcion para rellenar el formulario de edicion con los datos de la mision
            async rellenarFormularioEdicion() {
                // Obtenemos la mision que queremos editar
                this.mision = this.storeMisiones.mision;

                // Cambiamos el valor de la descripcion, operativo y equipos seleccionados del formulario a los de la mision
                this.descripcion = this.mision.descripcion;
                this.operativoSeleccionado = this.mision.operativoDTO;
                this.equiposSeleccionados = this.mision.equiposDTO;

                // Obtenemos la lista de operativos y de equipos disponibles
                await this.getOperativos();
                await this.getEquiposDisponibles();
                // Cambiamos la lista de equipos disponibles de seleccionar a los seleccionados mas los disponibles
                this.equiposDisponiblesSeleccionar = this.equiposSeleccionados.concat(this.equiposDisponibles);
            },
            // Funcion asincrona para actualizar una mision
            async updateMision() {
                const { valid } = await this.$refs.formularioEditar.validate();
                if(valid) {
                    // Hacemos que la store actualice la mision
                    await this.storeMisiones.updateMision(this.mision, this.descripcion, 
                        this.operativoSeleccionado, this.equiposSeleccionados);
                    // Emitimos un evento para que el componente padre se actualice
                    this.$emit('mision-actualizada');
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
            },
        },

        mounted() {
            // Avisamos al componente padre que el formulario esta montado
            this.$emit('form-mounted');
        }
        
    }
</script>