<template>
    <!-- Cuadro con el formulario -->
    <v-sheet :elevation="5" style="max-width: 75%; margin-left: 12.5%;">
        <v-form ref="formularioEditar">
            <!-- Campo para seleccionar tipo -->
            <v-select v-model=tipo label="Tipo" :items=tiposSeleccionables required
            :rules="[value => value && value.length >= 1 || 'Es obligatorio seleccionar un elemento']" />
            <!-- Campo de texto para la descripcion -->
            <v-text-field v-model=descripcion label="Descripcion" required
            :rules="[value => value && value.length >= 1 || 'Es obligatorio rellenar este campo']" />
            <!-- Boton de editar -->
            <v-btn @click="updateEquipo" class="mt-2" block>Editar</v-btn>
        </v-form>
    </v-sheet>
</template>

<script>
    import { useEquiposStore } from "@/stores/equipos";

    export default {
        name: 'EditarEquipo',

        data: () => ({
            // Store para los equipos
            store: useEquiposStore(),

            // Tipos de equipo posibles
            tiposSeleccionables: ["Hardware", "Software"],
            
            // Equipo que se va a editar
            equipo: null,
            // Descripcion y tipo dentro del formulario
            tipo: '',
            descripcion: ''
        }),

        methods: {
            // Funcion para rellenar el formulario de edicion con los datos del equipo
            rellenarFormularioEdicion() {
                // Obtenemos el equipo que queremos editar
                this.equipo = this.store.getterEquipo;
                // Cambiamos el valor de tipo y descripcion del menu al del equipo
                this.tipo = this.equipo.tipo;
                this.descripcion = this.equipo.descripcion;
            },
            // Funcion para actualizar un equipo
            async updateEquipo() {
                // Comprobamos si el formulario de editar equipo se ha rellenado correctamente
                const { valid } = await this.$refs.formularioEditar.validate();
                if(valid) {
                    // Hacemos que la store actualice el equipo
                    await this.store.updateEquipo(this.equipo, this.tipo, this.descripcion);
                    // Emitimos un evento para que el componente padre se actualice
                    this.$emit('equipo-actualizado');
                }
            }
        },

        mounted() {
            // Avisamos al componente padre que el formulario esta montado
            this.$emit('form-mounted');
        }
        
    }
</script>