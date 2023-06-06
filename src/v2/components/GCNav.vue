<script setup lang="ts">
import { RouterLink, useRoute } from "vue-router";

const route = useRoute();

const links = [
    {
        to: `/${route.params.gameLinkId as string}`,
        text: "Lobby"
    },
    {
        to: `/${route.params.gameLinkId}/play`,
        text: "Game",
    },
    {
        to: `/${route.params.gameLinkId}/rules`,
        text: "Rules",
    },
];

</script>

<template>
    <nav class="flex items-center space-x-4">
        <RouterLink
            v-for="link in links"
            exact-active-class="font-bold underline"
            :key="link.to"
            :to="link.to"
        >
            {{ link.text }}
        </RouterLink>
    </nav>
</template>