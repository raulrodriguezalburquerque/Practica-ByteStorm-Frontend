<template>
    <!-- Footer -->
    <v-footer dark padless style="padding: 0%;" class="text-center flex justify-end align-end">
        <v-card flat tile style="width: 100%; margin: 0;" color="teal-accent-4">
            <!-- Botones con enlaces a redes -->
            <v-card-text style="width: 100%; margin: 0;">
                <v-btn v-for="link in links" :key="link" :icon="link.icon" :href="link.link" class="mx-2" />
            </v-card-text>
            <!-- Aviso de copyright -->
            <v-card-text class="pt-2" style="width: 100%; margin: 0;">
                <p>&copy; 2024 ByteStorm</p>
            </v-card-text>
        </v-card>
    </v-footer>
</template>

<script>
    export default {
        name: 'FooterComponent',
        data: () => ({
            // Lista de enlaces
            links: [
                {link: "tel:123 45 67 89", icon: "mdi-dialpad"},
                {link: "mailto:info@bytestorm.com", icon: "mdi-email"},
                {link: "https://www.linkedin.com/company/bytestorm/about/", icon: "mdi-linkedin"},
                {link: "https://www.instagram.com/bytestormllc/?utm_source=ig_embed", icon: "mdi-instagram"}
            ]
        })
    }
</script>