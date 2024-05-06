<template>
  <v-container fluid grid-list-md>
    <v-row no-gutters>
      <!-- Titulo para misiones pendientes -->
      <p class="text-h4 w-100 ma-2 mb-4" style="color: #00BFA5;">Misiones pendientes</p>
      <!-- Recorremos la lista de misones -->
      <v-col v-for="mision in misionesPendientes" :key="mision.codigo" cols="12" sm="6" md="4" lg="3">
        <!-- Creamos una carta por cada mision pendiente -->
        <v-card class="ma-2">
          <!-- Titulo y menu de la carta -->
          <v-card-item class="bg-light-blue-darken-4">
            <v-row>
              <v-col cols="9">
                <v-card-title>{{ mision.descripcion }}</v-card-title>
                <v-card-subtitle>{{ mision.estado }}</v-card-subtitle>
              </v-col>
              <v-col cols="3" class="d-flex align-center justify-end">
                <!-- Menu -->
                <v-menu>
                  <!-- Boton para abrir el menu -->
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-menu" class="bg-light-blue-darken-4" flat />
                  </template>
                  <!-- Lista de botones del menu para mision pendiente -->
                  <v-list>
                    <!-- Boton para editar la mision -->
                    <v-list-item @click="mostrarFormularioEditar(mision)">
                      <v-list-item-title>Editar</v-list-item-title>
                    </v-list-item>
                    <!-- Boton para completar la mision -->
                    <v-list-item @click="completarMision(mision)">
                      <v-list-item-title>Completar</v-list-item-title>
                    </v-list-item>
                    <!-- Boton para eliminar la mision -->
                    <v-list-item @click="removeMision(mision)">
                      <v-list-item-title>Eliminar</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-card-item>
          <!-- Texto de la carta -->
          <v-card-text class="bg-light-blue-lighten-4 pt-4">
            <!-- Nombre y rol del operativo si la mision tiene asignado uno, si no mensaje que lo indique -->
            <p v-if="mision.operativoDTO != null"> {{ mision.operativoDTO.nombre }} - {{ mision.operativoDTO.rol }} </p>
            <p v-else> Operativo no asignado </p>
            <v-divider class="my-2"></v-divider>
            <!-- Panel expandible con equipos asignados si la mision tiene asignado alguno -->
            <v-expansion-panels v-if="mision.equiposDTO != null && mision.equiposDTO.length > 0">
              <v-expansion-panel title="Equipos asignados">
                <v-expansion-panel-text>
                  <!-- Lista de equipos asignados a la mision -->
                  <v-list v-for="equipo in mision.equiposDTO" :key="equipo">
                    {{ equipo.descripcion }}
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
            <!-- Texto si no hay equipos asignados -->
            <p v-else> Sin equipos asignados </p>
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Formulario para añadir una nueva mision -->
      <v-col cols="12" sm="6" md="4" lg="3">
        <AñadirMision />
      </v-col>

      <!-- Titulo para misiones completadas -->
      <p class="text-h4 w-100 ma-2 mt- mb-4" style="color: #00BFA5;">Misiones completadas</p>
      <!-- Recorremos la lista de misones -->
      <v-col v-for="mision in misionesCompletadas" :key="mision.codigo" cols="12" sm="6" md="4" lg="3">
        <!-- Creamos una carta por cada mision completada -->
        <v-card class="ma-2">
          <!-- Titulo y menu de la carta -->
          <v-card-item class="bg-light-blue-darken-4">
            <v-row>
              <v-col cols="9">
                <v-card-title>{{ mision.descripcion }}</v-card-title>
                <v-card-subtitle>{{ mision.estado }}</v-card-subtitle>
              </v-col>
              <v-col cols="3" class="d-flex align-center justify-end">
                <!-- Menu -->
                <v-menu>
                  <!-- Boton para abrir el menu -->
                  <template v-slot:activator="{ props }">
                    <v-btn v-bind="props" icon="mdi-menu" class="bg-light-blue-darken-4" flat />
                  </template>
                  <!-- Lista con la opcion de eliminar para una mision completada -->
                  <v-list>
                    <!-- Boton para eliminar la mision -->
                    <v-list-item @click="removeMision(mision)">
                      <v-list-item-title>Eliminar</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-col>
            </v-row>
          </v-card-item>
        </v-card>
      </v-col>

      <!-- Formulario para editar una mision, solo se muestra si "editar" es verdadero -->
      <v-dialog v-model="editar">
        <EditarMision ref="editar" @form-mounted="rellenarFormularioEditarMision(misionEditar)"
          @mision-actualizada="misionActualizada" />
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
  import AñadirMision from "./AñadirMision.vue";
  import EditarMision from "./EditarMision.vue";
  import { useMisionesStore } from "@/stores/misiones";
  import { useOperativosStore } from "@/stores/operativos";
  import { useEquiposStore } from "@/stores/equipos";

  export default {
    name: 'ListaMisiones',
  
    components: {
      AñadirMision,
      EditarMision
    },

    data: () => ({
      // Stores para las misiones, operativos y equipos
      storeMisiones: useMisionesStore(),
      storeOperativos: useOperativosStore(),
      storeEquipos: useEquiposStore(),

      // Booleano para abrir el menu de editar mision
      editar: false,
      // Mision que editar
      misionEditar: null,
    }),

    methods: {
      // Funcion para mostrar el formulario de editar mision
      mostrarFormularioEditar(mision) {
        // Se guarda la mision que queremos editar
        this.misionEditar = mision;
        // Se muestra el formulario
        this.editar = true;
      },
      // Funcion para rellenar el formulario de editar mision
      async rellenarFormularioEditarMision(mision) {
        // Obtenemos el codigo de la mision que queremos editar
        var codigo = mision.codigo;
        // La store busca la mision
        await this.storeMisiones.getMision(codigo);
        // Llenamos el formulario de editar mision
        this.$refs.editar.rellenarFormularioEdicion();
      },
      // Funcion para actualizar el componente despues de actualizar una mision
      misionActualizada() {
        // Se oculta el menu de edicion de mision
        this.editar = false;
      },
      // Funcion asincrona para completar una mision de la lista
      async completarMision(mision) {
        // Hacemos que la store de por completada la mision
        await this.storeMisiones.completarMision(mision);
      },
      // Funcion asincrona para eliminar una mision de la lista
      async removeMision(mision) {
        // Hacemos que la store elimine la mision
        await this.storeMisiones.removeMision(mision);
      }
    },

    computed: {
      // Lista con las misiones
      listaMisiones() {
        // Obtenemos las misiones de la store
        return this.storeMisiones.getterMisiones;
      },
      // Lista con las misiones pendientes
      misionesPendientes() {
        // Filtramos las misiones que no esten completadas
        return this.listaMisiones.filter(m => m.estado != "Completada");
      },
      // Lista con las misiones completadas
      misionesCompletadas() {
        // Filtramos las misiones completadas
        return this.listaMisiones.filter(m => m.estado == "Completada");
      }
    }
  }
</script>
