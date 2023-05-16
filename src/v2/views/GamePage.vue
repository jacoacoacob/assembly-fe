<script setup lang="ts">
import { ref, onUnmounted, onMounted } from "vue";
import { useRoute } from "vue-router";

import OwnerView from "@/v2/components/game-page/owner-view.vue"
import GuestView from "@/v2/components/game-page/guest-view.vue"
import GInput from "@/v2/components/lib/GInput.vue";
import { socket, connectSocket } from "@/socket";
import { useSessionStore } from "../stores/session-store";

const session = useSessionStore();

connectSocket();

onUnmounted(() => {    
    socket.disconnect();
});

const clientName = ref("");

</script>

<template>
    <div class="min-h-screen w-full px-4 flex flex-col">
        <div class="p-1">
            <ul class="flex space-x-2">
                <li v-for="x in session.allSessions">{{ x.clientId }}</li>
            </ul>
        </div>
        <div class="flex-1 flex justify-center items-center">
            <OwnerView v-if="session.clientSession?.role === 'owner'" />
            <GuestView v-if="session.clientSession?.role === 'guest'" />
        </div>
    </div>
</template>