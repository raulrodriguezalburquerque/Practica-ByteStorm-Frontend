<template>
  <v-container fluid grid-list-md>
    <v-row no-gutters>
      <!-- Recorremos la lista de operativos -->
      <v-col v-for="operativo in listaOperativos" :key="operativo.ID" cols="12" sm="6" md="4" lg="3">
        <!-- Creamos una carta por operativo -->
        <v-card class="ma-2">
          <!-- Titulo y menu de la carta -->
          <v-card-item class="bg-light-blue-darken-4">
            <v-row>
              <v-col cols="9">
                <v-card-title>{{ operativo.nombre }}</v-card-title>
                <v-card-subtitle>{{ operativo.rol }}</v-card-subtitle>
              </v-col>
              <v-col cols="3" class="d-flex align-center justify-end">
                <!-- Menu -->
                <v-menu>
                  <!-- Boton para abrir el menu -->
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-menu" class="bg-light-blue-darken-4" flat />
                  </template>
                  <!-- Lista de botones del menu -->
                  <v-list>
                    <!-- Boton para editar el operativo -->
                    <v-list-item @click="mostrarFormularioEditar(operativo)">
                      <v-list-item-title>Editar</v-list-item-title>
                    </v-list-item>
                    <!-- Boton para eliminar el operativo -->
                    <v-list-item @click="removeOperativo(operativo)">
                      <v-list-item-title>Eliminar</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-card-item>
          <!-- Texto de la carta -->
          <v-card-text class="bg-light-blue-lighten-4 pt-4">
            <!-- Panel expandible con misiones asignadas si el operativo tiene asignada alguna -->
            <v-expansion-panels v-if="operativo.misionesDTO != null && operativo.misionesDTO.length > 0">
              <v-expansion-panel title="Misiones asignadas">
                <v-expansion-panel-text>
                  <!-- Lista de misiones asignadas al operativo -->
                  <v-list v-for="mision in operativo.misionesDTO" :key="mision">
                    {{ mision.descripcion }}
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
            <!-- Texto si no hay misiones asignadas -->
            <p v-else> Sin misiones asignadas </p>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Formulario para añadir un nuevo operativo -->
      <v-col cols="12" sm="6" md="4" lg="3">
        <AñadirOperativo />
      </v-col>
      <!-- Formulario para editar un operativo, solo se muestra si "editar" es verdadero -->
      <v-dialog v-model="editar">
        <EditarOperativo ref="editar" @form-mounted="rellenarFormularioEditarOperativo(operativoEditar)"
          @operativo-actualizado="operativoActualizado" />
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
  import AñadirOperativo from "./AñadirOperativo.vue";
  import EditarOperativo from "./EditarOperativo.vue";
  import { useOperativosStore } from "@/stores/operativos";
  import { useMisionesStore } from "@/stores/misiones";

  export default {
    name: 'ListaOperativos',

    components: {
      AñadirOperativo,
      EditarOperativo
    },
  
    data: () => ({
      // Stores para los operativos y misiones
      storeOperativos: useOperativosStore(),
      storeMisiones: useMisionesStore(),

      // Booleano para abrir el menu de editar operativo
      editar: false,
      // Operativo que editar
      operativoEditar: null,
    }),

    methods: {
      // Funcion para mostrar el formulario de editar operativo
      mostrarFormularioEditar(operativo) {
        // Se guarda el operativo que queremos editar
        this.operativoEditar = operativo;
        // Se muestra el formulario
        this.editar = true;
      },
      // Funcion para rellenar el formulario de editar operativo
      async rellenarFormularioEditarOperativo(operativo) {
        // Obtenemos el ID del operativo que queremos editar
        var id = operativo.id;
        // La store busca el operativo
        await this.storeOperativos.getOperativo(id);
        // Llenamos el formulario de editar operativo
        this.$refs.editar.rellenarFormularioEdicion();
      },
      // Funcion para actualizar el componente despues de actualizar un operativo
      operativoActualizado() {
        // Se oculta el menu de edicion de operativo
        this.editar = false;
      },
      // Funcion asincrona para eliminar un operativo de la lista
      async removeOperativo(operativo) {
        // Hacemos que la store elimine el operativo
        await this.storeOperativos.removeOperativo(operativo);
      },
    },

    computed: {
      // Lista con los operativos
      listaOperativos() {
        // Obtenemos los operativos de la store
        return this.storeOperativos.getterOperativos;
      }
    }
  }
</script>
