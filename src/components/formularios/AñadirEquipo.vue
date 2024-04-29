<template>
    <!-- Cuadro con el formulario -->
    <v-sheet :elevation="5" class="ma-2">
        <v-form ref="formularioAñadir">
            <!-- Campo para seleccionar tipo -->
            <v-select v-model=tipo label="Tipo" :items=tiposSeleccionables required class="my-2"
            :rules="[value => value && value.length >= 1 || 'Es obligatorio seleccionar un elemento']" />
            <!-- Campo de texto para la descripcion -->
            <v-text-field v-model=descripcion label="Descripcion" required class="my-2"
            :rules="[value => value && value.length >= 1 || 'Es obligatorio rellenar este campo']" />
            <!-- Boton de añadir -->
            <v-btn @click=addEquipo class="mt-2" block>Añadir</v-btn>
        </v-form>
    </v-sheet>
</template>

<script>
    import { useEquiposStore } from "@/stores/equipos";

    export default {
        name: 'AñadirEquipo',

        data: () => ({
            // Store para los equipos
            store: useEquiposStore(),

            // Tipos de equipo posibles
            tiposSeleccionables: ["Hardware", "Software"],
            
            // Descripcion y tipo dentro del formulario de añadir equipo
            tipo: '',
            descripcion: ''
        }),

        methods: {
            // Funcion para añadir un equipo a la lista
            async addEquipo() {
                // Comprobamos si el formulario de añadir equipo se ha rellenado correctamente
                const { valid } = await this.$refs.formularioAñadir.validate();
                if(valid) {
                    // La store de equipos añade el nuevo equipo
                    await this.store.addEquipo(this.tipo, this.descripcion);
                    // Emitimos un evento para que el componente padre se actualice
                    this.$emit('equipo-añadido');
                    // Reseteamos el formulario
                    this.$refs.formularioAñadir.reset();
                }
            }
        }
    }
</script>