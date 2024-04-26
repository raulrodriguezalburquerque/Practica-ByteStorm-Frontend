<template>
  <v-container fluid grid-list-md>
    <v-row no-gutters>
      <!-- Recorremos la lista de misones -->
      <v-col v-for="mision in listaMisiones" :key="mision.codigo" cols="12" sm="6" md="4" lg="3">
        <!-- Creamos una carta por mision -->
        <v-card class="ma-2">
          <!-- Titulo y menu de la carta -->
          <v-card-item class="bg-light-blue-darken-4">
            <v-row>
              <v-col cols="9">
                <v-card-title>{{ mision.descripcion }}</v-card-title>
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
                    <!-- Boton para editar la mision -->
                    <v-list-item @click="editarMision(mision)">
                      <v-list-item-title>Editar</v-list-item-title>
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
            <!-- Descripcion de la mision -->
            {{ mision.estado }}
            <v-divider class="my-2" />
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
        <!-- Cuadro con el formulario -->
        <v-sheet :elevation="5" class="ma-2">
          <v-form ref="formularioAñadir">
            <!-- Campo de texto para la descripcion -->
            <v-text-field v-model=descripcionAñadir label="Descripcion" required
            :rules="[value => value && value.length >= 1 || 'Es obligatorio rellenar este campo']" />
            <!-- Selector de operativo -->
            <v-select label="Operativo" :items="listaOperativos" item-title="nombre" 
            v-model="operativoSeleccionadoAñadir" return-object clearable>
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :subtitle="item.raw.rol"></v-list-item>
              </template>
            </v-select>
            <!-- Campo de seleccion de equipos -->
            <v-select label="Equipos disponibles" v-model="equiposSeleccionadosAñadir" :items="equiposDisponibles"
            item-title="descripcion" chips multiple return-object />
            <!-- Boton de añadir -->
            <v-btn @click=addMision class="mt-2" block>Añadir</v-btn>
          </v-form>
        </v-sheet>
      </v-col>
      <!-- Formulario para editar una mision, solo se muestra si "editar" es verdadero -->
      <v-dialog v-model="editar">
        <!-- Cuadro con el formulario -->
        <v-sheet :elevation="5" style="max-width: 50%; margin-left: 25%;">
          <v-form ref="formularioEditar">
            <!-- Campo de texto para la descripcion -->
            <v-text-field v-model=descripcionEditar label="Descripcion" required
            :rules="[value => value && value.length >= 1 || 'Es obligatorio rellenar este campo']" />
            <!-- Selector de operativo -->
            <v-select label="Operativo" :items="listaOperativos" item-title="nombre" 
            v-model="operativoSeleccionadoEditar" return-object clearable>
              <template v-slot:item="{ props, item }">
                <v-list-item v-bind="props" :subtitle="item.raw.rol"></v-list-item>
              </template>
            </v-select>
            <!-- Campo de seleccion de equipos -->
            <v-select label="Equipos disponibles" v-model="equiposSeleccionadosEditar" :items="equiposDisponiblesEditar"
            item-title="descripcion" chips multiple return-object />
            <!-- Boton de editar -->
            <v-btn @click=updateMision class="mt-2" block>Editar</v-btn>
          </v-form>
        </v-sheet>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
  import { useMisionesStore } from "@/stores/misiones";
  import { useOperativosStore } from "@/stores/operativos";
  import { useEquiposStore } from "@/stores/equipos";

  export default {
    name: 'ListaMisiones',
  
    data: () => ({
      // Store para las misiones
      storeMisiones: useMisionesStore(),
      // Store para los operativos
      storeOperativos: useOperativosStore(),
      // Store para los equipos
      storeEquipos: useEquiposStore(),

      // Lista de equipos disponibles
      equiposDisponibles: [],

      // Lista de operativos
      listaOperativos: [],

      // Lista de misiones
      listaMisiones: [],

      // Descripcion del formulario de añadir mision
      descripcionAñadir: '',
      // Operativo seleccionado al añadir mision
      operativoSeleccionadoAñadir: null,
      // Lista de equipos seleccionados al añadir mision
      equiposSeleccionadosAñadir: [],

      // Booleano para abrir el menu de editar mision
      editar: false,
      // Mision que editar
      misionEditar: null,
      // Descripcion dentro del formulario de editar mision
      descripcionEditar: '',
      // Operativo seleccionado al editar mision
      operativoSeleccionadoEditar: null,
      // Lista de equipos seleccionados al editar mision
      equiposSeleccionadosEditar: [],
      // Lista de equipos disponibles al editar mision
      equiposDisponiblesEditar: []
    }),

    methods: {
      // Funcion para abrir el menu de edicion de una mision
      editarMision(mision) {
        // Asignamos la mision que vamos a editar
        this.misionEditar = mision;
        // Cambiamos el valor de descripcion del menu al de la mision
        this.descripcionEditar = mision.descripcion;
        // Cambiamos el valor del operativo del menu al de la mision
        this.operativoSeleccionadoEditar = mision.operativoDTO;
        // Cambiamos el valor de equipos seleccionados del menu a los de la mision
        this.equiposSeleccionadosEditar = mision.equiposDTO;
        // Cambiamos la lista de equipos disponibles al editar mision
        this.equiposDisponiblesEditar = mision.equiposDTO.concat(this.equiposDisponibles);
        // Cambiamos el bool "editar" para abrir el menu de edicion
        this.editar = true;
      },
      // Funcion asincrona para conseguir las misiones
      async getMisiones() {
        // Hacemos que la store obtenga las misiones
        await this.storeMisiones.getMisiones();
        // Obtenemos las misiones de la store
        this.listaMisiones = this.storeMisiones.misiones;
      },
      // Funcion asincrona para añadir una mision a la lista
      async addMision() {
        const { valid } = await this.$refs.formularioAñadir.validate();
        if(valid) {
          // Hacemos que la store añada la nueva mision
          await this.storeMisiones.addMision(this.descripcionAñadir, this.operativoSeleccionadoAñadir,
           this.equiposSeleccionadosAñadir);
          // Conseguimos la lista de misiones actualizada y de equipos disponibles
          this.getMisiones();
          this.getEquiposDisponibles();
          // Reseteamos el formulario
          this.$refs.formularioAñadir.reset();
        }
      },
      // Funcion asincrona para actualizar una mision
      async updateMision() {
        const { valid } = await this.$refs.formularioEditar.validate();
        if(valid) {
          // Hacemos que la store actualice la mision
          await this.storeMisiones.updateMision(this.misionEditar, this.descripcionEditar, 
            this.operativoSeleccionadoEditar, this.equiposSeleccionadosEditar);
          // Conseguimos la lista de misiones y equipos disponibles actualizadas
          this.getMisiones();
          this.getEquiposDisponibles();
          // Se oculta el menu de edicion de mision
          this.editar = false;
        }
      },
      // Funcion asincrona para eliminar una mision de la lista
      async removeMision(mision) {
        // Hacemos que la store elimine la mision
        await this.storeMisiones.removeMision(mision);
        // Conseguimos la lista de misiones y equipos disponibles actualizadas
        this.getMisiones();
        this.getEquiposDisponibles();
      },
      // Funcion asincrona para obtener los equipos disponibles
      async getEquiposDisponibles()
      {
        // Hacemos que la store de equipos obtenga los equipos disponibles
        await this.storeEquipos.getEquiposDisponibles();
        // Obtenemos los equipos de la store
        this.equiposDisponibles = this.store.equiposDisponibles;
      },
      // Funcion asincrona para conseguir los operativos
      async getOperativos() {
        // Hacemos que la store de operativos obtenga los operativos
        await this.storeOperativos.getOperativos();
        // Obtenemos los operativos de la store
        this.listaOperativos = this.storeOperativos.operativosDisponibles;
      }
    },

    created: function() {
      // Obtenemos la lista de misiones, equipos disponibles y operativos
      this.getMisiones();
      this.getEquiposDisponibles();
      this.getOperativos();
    }
  }
</script>
