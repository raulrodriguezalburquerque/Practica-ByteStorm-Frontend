<template>
  <v-container fluid>
    <v-row no-gutters>
      <!-- Recorremos la lista de equipos -->
      <v-col v-for="equipo in listaEquipos" :key="equipo.ID" cols="12" sm="6" md="4" lg="3">
        <!-- Creamos una carta por equipo -->
        <v-card class="ma-2">
          <!-- Titulo, subtitulo y menu de la carta -->
          <v-card-item class="bg-light-blue-darken-4">
            <v-row>
              <v-col cols="9">
                <v-card-title>{{ equipo.descripcion }}</v-card-title>
                <v-card-subtitle>{{ equipo.tipo }}</v-card-subtitle>
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
                    <!-- Boton para editar el equipo -->
                    <v-list-item @click="mostrarFormularioEditar(equipo)">
                      <v-list-item-title>Editar</v-list-item-title>
                    </v-list-item>
                    <!-- Boton para eliminar el equipo -->
                    <v-list-item @click="removeEquipo(equipo)">
                      <v-list-item-title>Eliminar</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-card-item>
          <!-- Texto de la carta -->
          <v-card-text class="bg-light-blue-lighten-4 pt-4">
            <p v-if="equipo.misionDTO != null">{{ equipo.estado }} - {{ equipo.misionDTO.descripcion }}</p>
            <p v-else>{{ equipo.estado }}</p>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Formulario para añadir un nuevo equipo -->
      <v-col cols="12" sm="6" md="4" lg="3">
        <AñadirEquipo @equipo-añadido="getEquipos" />
      </v-col>
    </v-row>
    <!-- Formulario para editar un equipo, solo se muestra si "editar" es verdadero -->
    <v-dialog v-model="editar">
      <EditarEquipo ref="editar" @form-mounted="rellenarFormularioEditarEquipo(equipoEditar)"
        @equipo-actualizado="equipoActualizado" />
    </v-dialog>
  </v-container>
</template>

<script>
  import AñadirEquipo from "../formularios/AñadirEquipo.vue";
  import EditarEquipo from "../formularios/EditarEquipo.vue";
  import { useEquiposStore } from "@/stores/equipos";

  export default {
    name: 'ListaEquipos',
  
    components: {
      AñadirEquipo,
      EditarEquipo
    },

    data: () => ({
      // Store para los equipos
      storeEquipos: useEquiposStore(),

      // Lista de equipos
      listaEquipos: [],

      // Booleano para abrir el menu de editar equipo
      editar: false,
      // Equipo que editar
      equipoEditar: null,
    }),

    methods: {
      // Funcion para mostrar el formulario de editar equipo
      mostrarFormularioEditar(equipo) {
        // Se guarda el equipo que queremos editar
        this.equipoEditar = equipo;
        // Se muestra el formulario
        this.editar = true;
      },
      // Funcion para rellenar el formulario de editar equipo con sus datos
      async rellenarFormularioEditarEquipo(equipo) {
        // Obtenemos el ID del equipo que queremos editar
        var id = equipo.id;
        // La store busca el equipo
        await this.storeEquipos.getEquipo(id);
        // Llenamos el formulario de editar equipo
        this.$refs.editar.rellenarFormularioEdicion();
      },
      // Funcion asincrona para conseguir los equipos
      async getEquipos() {
        // Hacemos que la store de equipos obtenga los equipos
        await this.storeEquipos.getEquipos();
        // Obtenemos los equipos de la store
        this.listaEquipos = this.storeEquipos.equipos;
      },
      // Funcion para actualizar el componente despues de actualizar un equipo
      equipoActualizado() {
        // Conseguimos la lista de equipos actualizada
        this.getEquipos();
        // Se oculta el menu de edicion de equipo
        this.editar = false;
      },
      // Funcion asincrona para eliminar un equipo de la lista
      async removeEquipo(equipo) {
        // Hacemos que la store elimine el equipo
        await this.storeEquipos.removeEquipo(equipo);
        // Conseguimos la lista de equipos actualizada
        this.getEquipos();
      }
    },

    created: function() {
      // Obtenemos la lista de equipos
      this.getEquipos();
    }
  }
</script>
