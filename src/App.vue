<template>
  <v-app>
    <!-- Cabecera -->
    <HeaderComponent />

    <!-- Contenido -->
    <v-main>
      <router-view/>
    </v-main>
    
    <!-- Footer -->
    <FooterComponent />
  </v-app>
</template>

<script>
  import HeaderComponent from './components/HeaderComponent.vue'
  import FooterComponent from './components/FooterComponent.vue'
  import { useEquiposStore } from "@/stores/equipos";
  import { useMisionesStore } from "@/stores/misiones";
  import { useOperativosStore } from "@/stores/operativos";

  export default {
    name: 'App',

    data: () => ({
      // Stores para los equipos, misiones y operativos
      storeEquipos: useEquiposStore(),
      storeMisiones: useMisionesStore(),
      storeOperativos: useOperativosStore()
    }),

    components: {
      HeaderComponent,
      FooterComponent
    },

    created: function() {
      // Hacemos que las stores obtengan los equipos, misiones y operativos
      this.storeEquipos.getEquipos();
      this.storeMisiones.getMisiones();
      this.storeOperativos.getOperativos();
    }
  }
</script>