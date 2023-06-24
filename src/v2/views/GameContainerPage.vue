<script setup lang="ts">
import { onUnmounted } from "vue";
import { RouterView } from "vue-router";

import GCConnectedClients from "../components/GCConnectedClients.vue";
import GCNav from "../components/GCNav.vue";
import { socket, connectSocket } from "@/socket";
import { useGameStore } from "../stores/game-store";
import { useSessionStore } from "../stores/session-store";
import { useEntitiesStore } from "../stores/entities-store";

connectSocket();

onUnmounted(() => {    
    socket.disconnect();
});

useGameStore();
useSessionStore();
useEntitiesStore();

</script>

<template>
    <div class="
        w-full
        px-4 xl:px-8
        flex justify-between
        sticky top-0
        bg-slate-100 border-b border-slate-300
        z-10
    ">
        <GCNav />
        <GCConnectedClients />
    </div>
    <div class="min-h-[calc(100vh-56px)] flex justify-center w-full px-4 xl:px-8 py-4">
        <div class="flex justify-center w-full">
            <RouterView />
        </div>
    </div>
</template>