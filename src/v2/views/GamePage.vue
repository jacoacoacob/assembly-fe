<script setup lang="ts">
import { RouterView, RouterLink, useRoute } from 'vue-router';
import { onUnmounted } from "vue";

import ConnectedClients from '../components/ConnectedClients.vue';
import { socket, connectSocket } from "@/socket";

connectSocket();

onUnmounted(() => {    
    socket.disconnect();
});

const route = useRoute();

</script>

<template>
    <div class="min-h-screen">
        <div class="flex justify-between">
            <div></div>
            <div class="flex space-x-2">
                <ConnectedClients />
                <!-- <RouterLink :to="`/${route.params.gameLinkId}/play`">
                    Game
                </RouterLink> -->
            </div>
        </div>
        <RouterView></RouterView>
    </div>
</template>