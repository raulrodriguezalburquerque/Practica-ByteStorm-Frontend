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
            <!-- Boton para cancelar la edicion-->
            <v-btn @click="cancelarEdicion" class="mt-2 w-50">Cancelar</v-btn>
            <!-- Boton para aceptar la edicion -->
            <v-btn @click="updateEquipo" class="mt-2 w-50">Aceptar</v-btn>
        </v-form>
    </v-sheet>
</template>

<script setup>
    import { ref, onMounted, defineEmits, defineExpose } from 'vue'
    import { useEquiposStore } from "@/stores/equipos";

    const emit = defineEmits(['form-mounted','cerrar-edicion'])

    // Store para los equipos
    const storeEquipos = useEquiposStore()

    // Tipos de equipo posibles
    const tiposSeleccionables = ref(["Hardware", "Software"])

    // Equipo que se va a editar
    const equipo = ref(null)
    // Descripcion y tipo dentro del formulario
    const tipo = ref('')
    const descripcion = ref('')

    // Formulario
    const formularioEditar = ref(null)

    // Funcion para rellenar el formulario de edicion con los datos del equipo
    function rellenarFormularioEdicion() {
        // Obtenemos el equipo que queremos editar
        equipo.value = storeEquipos.getterEquipo;
        // Cambiamos el valor de tipo y descripcion del menu al del equipo
        tipo.value = equipo.value.tipo;
        descripcion.value = equipo.value.descripcion;
    }

    // Funcion para actualizar un equipo
    async function updateEquipo() {
        // Comprobamos si el formulario de editar equipo se ha rellenado correctamente
        const { valid } = await formularioEditar.value.validate();
        if(valid) {
            // Hacemos que la store actualice el equipo
            await storeEquipos.updateEquipo(equipo.value, tipo.value, descripcion.value);
            // Emitimos un evento para que el componente padre oculte el formulario de edicion
            emit('cerrar-edicion');
        }
    }

    // Funcion para cancelar la edicion del equipo
    function cancelarEdicion() {
        // Emitimos un evento para que el componente padre oculte el formulario de edicion
        emit('cerrar-edicion');
    }

    defineExpose({
        rellenarFormularioEdicion
    });

    onMounted(() => {
        // Avisamos al componente padre que el formulario esta montado
        emit('form-mounted');
    })
        
</script>