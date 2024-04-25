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
                    <v-list-item @click="editarOperativo(operativo)">
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
            {{ operativo.rol }}
            <v-divider class="my-2" />
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
        <!-- Cuadro con el formulario -->
        <v-sheet :elevation="5" class="ma-2">
          <v-form ref="formularioAñadir">
            <!-- Campo de texto para el nombre -->
            <v-text-field v-model=nombreAñadir label="Nombre" required
            :rules="[value => value && value.length >= 1 || 'Es obligatorio rellenar este campo']" />
            <!-- Campo de texto para el rol -->
            <v-text-field v-model=rolAñadir label="Rol" required
            :rules="[value => value && value.length >= 1 || 'Es obligatorio rellenar este campo']" />
            <!-- Campo de seleccion de misiones -->
            <v-select label="Misiones planificadas" v-model="misionesSeleccionadasAñadir" :items="misionesPlanificadas"
            item-title="descripcion" chips multiple return-object />
            <!-- Boton de añadir -->
            <v-btn @click=addOperativo class="mt-2" block>Añadir</v-btn>
          </v-form>
        </v-sheet>
      </v-col>
      <!-- Formulario para editar un operativo, solo se muestra si "editar" es verdadero -->
      <v-dialog v-model="editar">
        <!-- Cuadro con el formulario -->
        <v-sheet :elevation="5" style="max-width: 50%; margin-left: 25%;">
          <v-form ref="formularioEditar">
            <!-- Campo de texto para el nombre -->
            <v-text-field v-model=nombreEditar label="Nombre" required
            :rules="[value => value && value.length >= 1 || 'Es obligatorio rellenar este campo']" />
            <!-- Campo de texto para el rol -->
            <v-text-field v-model=rolEditar label="Rol" required
            :rules="[value => value && value.length >= 1 || 'Es obligatorio rellenar este campo']" />
            <!-- Campo de seleccion de misiones -->
            <v-select label="Misiones disponibles" v-model="misionesSeleccionadasEditar" :items="misionesDisponiblesEditar"
            item-title="descripcion" chips multiple return-object />
            <!-- Boton de editar -->
            <v-btn @click="updateOperativo" class="mt-2" block>Editar</v-btn>
          </v-form>
        </v-sheet>
      </v-dialog>
    </v-row>
  </v-container>
</template>

<script>
  import axios from "axios";

  export default {
    name: 'ListaOperativos',
  
    data: () => ({
      // Lista de misiones planificadas
      misionesPlanificadas: [],

      // Lista de operativos
      listaOperativos: [],

      // Nombre y rol dentro del formulario de añadir operativo
      nombreAñadir: '',
      rolAñadir: '',
      // Lista de misiones seleccionadas al añadir operativo
      misionesSeleccionadasAñadir: [],

      // Booleano para abrir el menu de editar operativo
      editar: false,
      // Operativo que editar
      operativoEditar: null,
      // Nombre y rol dentro del formulario de editar operativo
      nombreEditar: '',
      rolEditar: '',
      // Lista de misiones seleccionadas al editar operativo
      misionesSeleccionadasEditar: [],
      // Lista de misiones disponibles al editar operativo
      misionesDisponiblesEditar: []
    }),

    methods: {
      // Funcion para abrir el menu de edicion de un operativo
      editarOperativo(operativo) {
        // Asignamos el operativo que vamos a editar
        this.operativoEditar = operativo;
        // Cambiamos el valor de nombre del menu al del operativo
        this.nombreEditar = operativo.nombre;
        // Cambiamos el valor de rol del menu al del operativo
        this.rolEditar = operativo.rol;
        // Cambiamos el valor de las misiones seleccionadas del menu a las del operativo
        this.misionesSeleccionadasEditar = operativo.misionesDTO;
        // Cambiamos la lista de misiones disponibles al editar operativo
        this.misionesDisponiblesEditar = operativo.misionesDTO.concat(this.misionesPlanificadas);
        // Cambiamos el bool "editar" para abrir el menu de edicion
        this.editar = true;
      },
      // Funcion asincrona para conseguir los operativos
      async getOperativos() {
        // Hacemos la llamada HTTP GET para obtener la lista de operativos
        await axios.get("https://localhost:7057/api/Operativos")
          .then(response => { console.log(response);
          // Actualizamos la lista de operativos con la respuesta obtenida
          this.listaOperativos = response.data;
        })
      },
      // Funcion asincrona para añadir un operativo a la lista
      async addOperativo() {
        // Comprobamos si el formulario de añadir operativo se ha rellenado correctamente
        const { valid } = await this.$refs.formularioAñadir.validate();
        if(valid) {
          // Hacemos la llamada HTTP POST creando el nuevo operativo
          await axios.post("https://localhost:7057/api/Operativos", {
            nombre: this.nombreAñadir,
            rol: this.rolAñadir,
            misionesDTO: this.misionesSeleccionadasAñadir
          }).then(response => { console.log(response); })
          .catch(error => { console.log(error); });
          // Conseguimos la lista de operativos actualizada y de misiones planificadas
          this.getOperativos();
          this.getMisionesPlanificadas();
          // Reseteamos el formulario
          this.$refs.formularioAñadir.reset();
        }
      },
      // Funcion asincrona para actualizar un operativo
      async updateOperativo() {
        // Comprobamos si el formulario de editar equipo se ha rellenado correctamente
        const { valid } = await this.$refs.formularioEditar.validate();
        if(valid) {
          // Obtenemos el ID del operativo
          var id = this.operativoEditar.id;
          // Hacemos la llamada HTTP PUT para actualizar el operativo
          await axios.put("https://localhost:7057/api/Operativos/"+id, {
            ID: id,
            nombre: this.nombreEditar,
            rol: this.rolEditar,
            misionesDTO: this.misionesSeleccionadasEditar
          }).then(response => { console.log(response); })
          .catch(error => { console.log(error); });
          // Conseguimos la lista de operativos y misiones planificadas actualizada
          this.getOperativos();
          this.getMisionesPlanificadas();
          // Se oculta el menu de edicion de operativo
          this.editar = false;
        }
      },
      // Funcion asincrona para eliminar un operativo de la lista
      async removeOperativo(operativo) {
        // Obtenemos el id del operativo
        var id = operativo.id;
        // Hacemos la llamada HTTP DELETE para eliminar el operativo
        await axios.delete("https://localhost:7057/api/Operativos/"+id)
          .then(response => { console.log(response); })
          .catch(error => { console.log(error); });
        // Conseguimos la lista de operativos y misiones planificadas actualizada
        this.getOperativos();
        this.getMisionesPlanificadas();
      },
      // Funcion asincrona para obtener las misiones planificadas
      async getMisionesPlanificadas()
      {
        // Hacemos la llamada HTTP GET para obtener la lista de misiones planificadas
        await axios.get("https://localhost:7057/api/Misiones/Planificadas")
          .then(response => { console.log(response);
          // Actualizamos la lista de misiones planificadas con la respuesta obtenida
          this.misionesPlanificadas = response.data;
        })
      }
    },

    created: function() {
      // Obtenemos la lista de operativos y misiones planificadas
      this.getOperativos();
      this.getMisionesPlanificadas();
    }
  }
</script>
