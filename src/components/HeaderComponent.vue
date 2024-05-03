<template>
    <!-- Barra de navegacion o menu lateral segun tamaño de pantalla -->
    <!-- Barra de navegacion -->
    <v-toolbar v-if="toolBarView" color="teal-accent-4" :elevation="4" dark>
        <!-- Boton con imagen -->
        <v-btn height=60px to="/">
            <v-avatar>
                <v-img :src="require('@/assets/ByteStorm-Logo.png')" color="white"/>
            </v-avatar>
        </v-btn>
        <v-toolbar-title style="font-size:30px">ByteStorm</v-toolbar-title>
        <v-spacer />
        <!-- Lista de botones -->
        <v-btn to="/equipos">Equipos</v-btn>
        <v-btn to="/misiones">Misiones</v-btn>
        <v-btn to="/operativos">Operativos</v-btn>
    </v-toolbar>

    <!-- Barra para el menu lateral -->
    <v-app-bar v-else color="teal-accent-4" style="margin-bottom: 100px" dark>
        <v-btn icon="mdi-menu" class="bg-teal-accent-4" flat @click="navDrawer = !navDrawer" />
        <v-img :src="require('@/assets/ByteStorm-Logo.png')" color="white" max-height="40" max-width="40" contain />
        <v-toolbar-title style="font-size:30px">ByteStorm</v-toolbar-title>
    </v-app-bar>
    <!-- Menu lateral -->
    <v-navigation-drawer v-if="!toolBarView" color="teal-darken-2" v-model="navDrawer" style="width: 175px">
        <!-- Lista de botones -->
        <v-list-item link to="/" title="Inicio" />
        <v-list-item link to="/equipos" title="Equipos" />
        <v-list-item link to="/misiones" title="Misiones" />
        <v-list-item link to="/operativos" title="Operativos" />
    </v-navigation-drawer>
</template>

<script>
    import { watchEffect } from 'vue';

    export default {
        name: 'HeaderComponent',

        data: () => ({
            // Booleano para saber si mostramos la barra o el menu lateral de navegacion
            toolBarView: true,
            // Booleano para abrir y cerrar el menu de navegacion
            navDrawer: false
        }),

        methods: {
            // Funcion para comprobar el tamaño de pantalla y decidir que tipo de navegacion usar
            comprobarTamañoPantalla() {
                this.toolBarView = window.innerWidth >= 760;
            }
        },

        created: function() {
            // Comprobamos el tamaño de pantalla inicial
            this.comprobarTamañoPantalla();
            // Se añade un observador para que se compruebe el pantalla de pantalla al cambiar
            watchEffect(() => {
                window.addEventListener('resize', this.comprobarTamañoPantalla);
                return () => window.removeEventListener('resize', this.comprobarTamañoPantalla);
            });
        }
    }
</script>