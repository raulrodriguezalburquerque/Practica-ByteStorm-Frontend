<template>
  <v-container fluid>
    <v-row no-gutters>
      <!-- Titulo para lista de equipos -->
      <p class="text-h4 w-100 ma-2 mb-4" style="color: #00BFA5;">Equipos</p>
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
        <AñadirEquipo />
      </v-col>
    </v-row>
    <!-- Formulario para editar un equipo, solo se muestra si "editar" es verdadero -->
    <v-dialog v-model="editar">
      <EditarEquipo ref="formularioEditar" @form-mounted="rellenarFormularioEditarEquipo(equipoEditar)"
        @cerrar-edicion="cerrarFormularioEdicion" />
    </v-dialog>
  </v-container>
</template>

<script setup>
  import { ref, computed } from 'vue'
  import AñadirEquipo from "./AñadirEquipo.vue";
  import EditarEquipo from "./EditarEquipo.vue";
  import { useEquiposStore } from "@/stores/equipos";

  // Store para los equipos
  const storeEquipos = useEquiposStore()

  // Booleano para abrir el menu de editar equipo
  const editar = ref(false)
  // Equipo que editar
  const equipoEditar = ref(null)

  // Formulario de edicion
  const formularioEditar = ref(null)

  // Lista con los equipos
  const listaEquipos = computed(() => {
    // Obtenemos los equipos de la store
    return storeEquipos.getterEquipos;
  })

  // Funcion para mostrar el formulario de editar equipo
  function mostrarFormularioEditar(equipo) {
    // Se guarda el equipo que queremos editar
    equipoEditar.value = equipo;
    // Se muestra el formulario
    editar.value = true;
  }

  // Funcion para rellenar el formulario de editar equipo con sus datos
  async function rellenarFormularioEditarEquipo(equipo) {
    // Obtenemos el ID del equipo que queremos editar
    var id = equipo.id;
    // La store busca el equipo
    await storeEquipos.getEquipo(id);
    // Llenamos el formulario de editar equipo
    formularioEditar.value.rellenarFormularioEdicion();
  }

  // Funcion para cerrar el formulario de edicion
  function cerrarFormularioEdicion() {
    // Se oculta el menu de edicion de equipo
    editar.value = false;
  }

  // Funcion asincrona para eliminar un equipo de la lista
  async function removeEquipo(equipo) {
    // Hacemos que la store elimine el equipo
    await storeEquipos.removeEquipo(equipo);
  }

</script>
