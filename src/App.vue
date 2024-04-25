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

  export default {
    name: 'App',
    components: {
      HeaderComponent,
      FooterComponent
    }
  }
</script>