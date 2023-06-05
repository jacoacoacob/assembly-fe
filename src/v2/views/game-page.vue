<script setup lang="ts">
import { onUnmounted } from "vue";

import { socket, connectSocket } from "@/socket";
import { useGameStore } from "../stores/game-store";
import GameSetup from "../components/game-page/game-setup.vue";
import ConnectedClients from "../components/connected-clients.vue";

const game = useGameStore();

connectSocket();

onUnmounted(() => {    
    socket.disconnect();
});
</script>

<template>
    <div class="min-h-screen w-full px-4 flex flex-col">
        <div class="flex justify-between">
            <div class="flex-1 bg-blue-100">

            </div>
            <ConnectedClients class="flex-0" />
        </div>
        <div class="flex-1">
            <GameSetup v-if="game.meta.phase === 'setup'" />
        </div>
    </div>
</template>