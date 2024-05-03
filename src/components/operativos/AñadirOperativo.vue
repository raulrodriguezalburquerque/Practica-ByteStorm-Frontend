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
            item-title="descripcion" item-value="codigo" chips multiple return-object />
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
                    // Reseteamos el formulario
                    this.$refs.formularioAñadir.reset();
                }
            },
            // Funcion para conseguir el codigo de una mision
            getCodigo(mision)
            {
                return mision.codigo;
            }
        },

        computed: {
            // Lista con las misiones planificadas
            misionesPlanificadas() {
                // Obtenemos las misiones planificadas de la store
                return this.storeMisiones.getterMisionesPlanificadas;
            }
        }
        
    }
</script>