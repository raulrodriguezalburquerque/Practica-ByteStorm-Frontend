<template>
    <!-- Cuadro con el formulario -->
    <v-sheet :elevation="5" style="max-width: 75%; margin-left: 12.5%;">
        <v-form ref="formularioEditar">
            <!-- Campo de texto para el nombre -->
            <v-text-field v-model=nombre label="Nombre" required
            :rules="[value => value && value.length >= 1 || 'Es obligatorio rellenar este campo']" />
            <!-- Campo de texto para el rol -->
            <v-text-field v-model=rol label="Rol" required
            :rules="[value => value && value.length >= 1 || 'Es obligatorio rellenar este campo']" />
            <!-- Campo de seleccion de misiones -->
            <v-select label="Misiones disponibles" v-model="misionesSeleccionadas" :items="misionesDisponibles"
            item-title="descripcion" item-value="codigo" chips multiple return-object />
            <!-- Boton de editar -->
            <v-btn @click="updateOperativo" class="mt-2" block>Editar</v-btn>
        </v-form>
    </v-sheet>
</template>

<script>
    import { useOperativosStore } from "@/stores/operativos";
    import { useMisionesStore } from "@/stores/misiones";

    export default {
        name: 'EditarOperativo',

        data: () => ({
            // Stores para los operativos y misiones
            storeOperativos: useOperativosStore(),
            storeMisiones: useMisionesStore(),
            
            // Lista de misiones planificadas
            misionesPlanificadas: [],
            // Lista de misiones disponibles para seleccionar
            misionesDisponibles: [],

            // Operativo que se va a editar
            operativo: null,
            // Nombre, rol y misiones seleccionadas dentro del formulario
            nombre: '',
            rol: '',
            misionesSeleccionadas: []
        }),

        methods: {
            // Funcion para rellenar el formulario de edicion con los datos del operativo
            async rellenarFormularioEdicion() {
                // Obtenemos el operativo que queremos editar
                this.operativo = this.storeOperativos.getterOperativo;

                // Cambiamos el valor del nombre, rol y misiones seleccionadas del menu a las del operativo
                this.nombre = this.operativo.nombre;
                this.rol = this.operativo.rol;
                this.misionesSeleccionadas = this.operativo.misionesDTO;

                // Obtenemos las misiones planificadas
                this.getMisionesPlanificadas();
                // Cambiamos la lista de misiones disponibles a las del operativo mas las planificadas
                this.misionesDisponibles = this.misionesSeleccionadas.concat(this.misionesPlanificadas);
            },
            // Funcion para actualizar un operativo
            async updateOperativo() {
                // Comprobamos si el formulario de editar operativo se ha rellenado correctamente
                const { valid } = await this.$refs.formularioEditar.validate();
                if(valid) {
                    // Hacemos que la store actualice el operativo
                    await this.storeOperativos.updateOperativo(this.operativo, this.nombre, 
                        this.rol,this.misionesSeleccionadas);
                    // Emitimos un evento para que el componente padre se actualice
                    this.$emit('operativo-actualizado');
                }
            },
            // Funcion asincrona para obtener las misiones planificadas
            getMisionesPlanificadas()
            {
                // Obtenemos las misiones de la store
                this.misionesPlanificadas = this.storeMisiones.getterMisionesPlanificadas;
            },
        },

        mounted() {
            // Avisamos al componente padre que el formulario esta montado
            this.$emit('form-mounted');
        }
        
    }
</script>