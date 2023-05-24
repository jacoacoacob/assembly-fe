<script setup lang="ts">
import { onUnmounted } from "vue";

import { socket, connectSocket } from "@/socket";
import { useSessionStore } from "../stores/session-store";
import { useGameStore } from "../stores/game-store";
import GameSetup from "../components/game-page/game-setup.vue";

const session = useSessionStore();
const game = useGameStore();

connectSocket();

onUnmounted(() => {    
    socket.disconnect();
});
</script>

<template>
    <div class="min-h-screen w-full px-4 flex flex-col">
        <div class="p-1">
            <ul class="flex space-x-2">
                <li
                    v-for="x in session.allSessions"
                    :key="x.clientId"
                    class="p-1 bg-slate-200 rounded"
                >
                    {{ x.clientDisplayName || "anonymous" }}
                </li>
            </ul>
        </div>
        <div class="flex-1">
            <GameSetup v-if="game.meta.phase === 'setup'" />
        </div>
        <!-- <div class="flex-1 whitespace-pre">
            {{ game }}
        </div> -->
    </div>
</template>