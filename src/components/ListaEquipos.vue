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
                    <v-list-item @click="editarEquipo(equipo)">
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
            {{ equipo.estado }}
          </v-card-text>
        </v-card>
      </v-col>
      <!-- Formulario para añadir nuevo equipo -->
      <v-col cols="12" sm="6" md="4" lg="3">
        <!-- Cuadro con el formulario -->
        <v-sheet :elevation="5" class="ma-2">
          <v-form ref="formularioAñadir">
            <!-- Campo para seleccionar tipo -->
            <v-select v-model=tipoElegidoAñadir label="Tipo" :items=tipo required class="my-2"
            :rules="[value => value && value.length >= 1 || 'Es obligatorio seleccionar un elemento']" />
            <!-- Campo de texto para la descripcion -->
            <v-text-field v-model=descripcionAñadir label="Descripcion" required class="my-2"
            :rules="[value => value && value.length >= 1 || 'Es obligatorio rellenar este campo']" />
            <!-- Boton de añadir -->
            <v-btn @click=addEquipo class="mt-2" block>Añadir</v-btn>
          </v-form>
        </v-sheet>
      </v-col>
    </v-row>
    <!-- Formulario para editar un equipo, solo se muestra si "editar" es verdadero -->
    <v-dialog v-model="editar" class="flex justify-center align-center">
      <!-- Cuadro con el formulario -->
      <v-sheet :elevation="5" style="max-width: 50%; margin-left: 25%;">
        <v-form ref="formularioEditar">
          <!-- Campo para seleccionar tipo -->
          <v-select v-model=tipoElegidoEditar label="Tipo" :items=tipo required
          :rules="[value => value && value.length >= 1 || 'Es obligatorio seleccionar un elemento']" />
          <!-- Campo de texto para la descripcion -->
          <v-text-field v-model=descripcionEditar label="Descripcion" required
          :rules="[value => value && value.length >= 1 || 'Es obligatorio rellenar este campo']" />
          <!-- Boton de editar -->
          <v-btn @click="updateEquipo" class="mt-2" block>Editar</v-btn>
        </v-form>
      </v-sheet>
    </v-dialog>
  </v-container>
</template>

<script>
  import axios from "axios";

  export default {
    name: 'ListaEquipos',
  
    data: () => ({
      // Lista de equipos
      listaEquipos: [],
      // Opciones dentro del menu de cada equipo
      opciones: ["Editar", "Eliminar"],
      
      // Tipos de equipo posibles
      tipo: ["Hardware", "Software"],
      
      // Descripcion y tipo dentro del formulario de añadir equipo
      tipoElegidoAñadir: '',
      descripcionAñadir: '',

      // Booleano para abrir el menu de editar equipo
      editar: false,
      // Equipo que editar
      equipoEditar: null,
      // Descripcion y tipo dentro del formulario de editar equipo
      tipoElegidoEditar: '',
      descripcionEditar: ''
    }),

    methods: {
      // Funcion para abrir el menu de edicion de un equipo
      editarEquipo(equipo) {
        // Asignamos el equipo que vamos a editar
        this.equipoEditar = equipo;
        // Cambiamos el valor de tipo del menu al del equipo
        this.tipoElegidoEditar = equipo.tipo;
        // Cambiamos el valor de descripcion del menu al del equipo
        this.descripcionEditar = equipo.descripcion;
        // Cambiamos el bool "editar" para abrir el menu de edicion
        this.editar = true;
      },
      // Funcion asincrona para conseguir los equipos
      async getEquipos() {
        // Hacemos la llamada HTTP GET para obtener la lista de equipos
        await axios.get("https://localhost:7057/api/Equipos")
          .then(response => { console.log(response);
          // Actualizamos la lista de equipos con la respuesta obtenida
          this.listaEquipos = response.data;
        })
      },
      // Funcion asincrona para añadir un equipo a la lista
      async addEquipo() {
        // Comprobamos si el formulario de añadir equipo se ha rellenado correctamente
        const { valid } = await this.$refs.formularioAñadir.validate();
        if(valid) {
          // Hacemos la llamada HTTP POST creando el nuevo equipo
          await axios.post("https://localhost:7057/api/Equipos", {
            tipo: this.tipoElegidoAñadir,
            descripcion: this.descripcionAñadir,
            estado: "Disponible"
          }).then(response => { console.log(response); })
          .catch(error => { console.log(error); });
          // Conseguimos la lista de equipos actualizada
          this.getEquipos();
          // Reseteamos el formulario
          this.$refs.formularioAñadir.reset();
        }
      },
      // Funcion asincrona para actualizar un equipo
      async updateEquipo() {
        // Comprobamos si el formulario de editar equipo se ha rellenado correctamente
        const { valid } = await this.$refs.formularioEditar.validate();
        if(valid) {
          // Obtenemos el ID del equipo
          var id = this.equipoEditar.id;
          // Hacemos la llamada HTTP PUT para actualizar el equipo
          await axios.put("https://localhost:7057/api/Equipos/"+id, {
            ID: id,
            tipo: this.tipoElegidoEditar,
            descripcion: this.descripcionEditar,
            estado: this.equipoEditar.estado
          }).then(response => { console.log(response); })
          .catch(error => { console.log(error); });
          // Conseguimos la lista de equipos actualizada
          this.getEquipos();
          // Se oculta el menu de edicion de equipo
          this.editar = false;
        }
      },
      // Funcion asincrona para eliminar un equipo de la lista
      async removeEquipo(equipo) {
        // Obtenemos el id del equipo
        var id = equipo.id;
        // Hacemos la llamada HTTP DELETE para eliminar el equipo
        await axios.delete("https://localhost:7057/api/Equipos/"+id)
          .then(response => { console.log(response); })
          .catch(error => { console.log(error); });
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
