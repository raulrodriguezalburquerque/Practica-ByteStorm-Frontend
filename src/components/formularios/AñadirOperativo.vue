<template>
    <!-- Cuadro con el formulario -->
    <v-sheet :elevation="5" class="ma-2">
        <v-form ref="formularioAñadir">
            <!-- Campo de texto para el nombre -->
            <v-text-field v-model=nombre label="Nombre" required
            :rules="[value => value && value.length >= 1 || 'Es obligatorio rellenar este campo']" />
            <!-- Campo de texto para el rol -->
            <v-text-field v-model=rol label="Rol" required
            :rules="[value => value && value.length >= 1 || 'Es obligatorio rellenar este campo']" />
            <!-- Campo de seleccion de misiones -->
            <v-select label="Misiones planificadas" v-model="misionesSeleccionadas" :items="misionesPlanificadas"
            item-title="descripcion" chips multiple return-object />
            <!-- Boton de añadir -->
            <v-btn @click=addOperativo class="mt-2" block>Añadir</v-btn>
        </v-form>
    </v-sheet>
</template>

<script>
    import { useOperativosStore } from "@/stores/operativos";
    import { useMisionesStore } from "@/stores/misiones";

    export default {
        name: 'AñadirOperativo',

        data: () => ({
            // Stores para los operativos y misiones
            storeOperativos: useOperativosStore(),
            storeMisiones: useMisionesStore(),

            // Lista de misiones planificadas
            misionesPlanificadas: [],

            // Nombre, rol y misiones seleccionadas dentro del formulario
            nombre: '',
            rol: '',
            misionesSeleccionadas: []
        }),

        methods: {
            // Funcion asincrona para añadir un operativo a la lista
            async addOperativo() {
                // Comprobamos si el formulario de añadir operativo se ha rellenado correctamente
                const { valid } = await this.$refs.formularioAñadir.validate();
                if(valid) {
                    // Hacemos que la store de operativos añada el nuevo operativo
                    await this.storeOperativos.addOperativo(this.nombre, this.rol, this.misionesSeleccionadas);
                    // Conseguimos la lista de misiones planificadas actualizada
                    this.getMisionesPlanificadas();
                    // Reseteamos el formulario
                    this.$refs.formularioAñadir.reset();
                    // Emitimos un evento para que el componente padre se actualice
                    this.$emit('operativo-añadido');
                }
            },
            // Funcion asincrona para obtener las misiones planificadas
            async getMisionesPlanificadas()
            {
                // Hacemos que la store obtenga las misiones planificadas
                await this.storeMisiones.getMisionesPlanificadas();
                // Obtenemos las misiones de la store
                this.misionesPlanificadas = this.storeMisiones.misionesPlanificadas;
            },
        },

        created: function() {
            // Obtenemos la lista de misiones planificadas
            this.getMisionesPlanificadas();
        }
    }
</script>