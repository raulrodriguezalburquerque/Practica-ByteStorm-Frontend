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
            <v-btn @click="addEquipo" class="mt-2" block>Añadir</v-btn>
        </v-form>
    </v-sheet>
</template>

<script setup>
    import { ref } from 'vue'
    import { useEquiposStore } from "@/stores/equipos";

    // Store para los equipos
    const storeEquipos = useEquiposStore()

    // Tipos de equipo posibles
    const tiposSeleccionables = ref(["Hardware", "Software"])

    // Descripcion y tipo dentro del formulario de añadir equipo
    const tipo = ref('')
    const descripcion = ref('')

    // Formulario
    const formularioAñadir = ref(null)

    // Funcion para añadir un equipo a la lista
    async function addEquipo() {
        // Comprobamos si el formulario de añadir equipo se ha rellenado correctamente
        const { valid } = await formularioAñadir.value.validate();
        if(valid) {
            // La store de equipos añade el nuevo equipo
            await storeEquipos.addEquipo(tipo.value, descripcion.value);
            // Reseteamos el formulario
            formularioAñadir.value.reset();
        }
    }

</script>