<script setup lang="ts">
import { ref } from "vue";

import GInput from "@/v2/components/lib/GInput.vue";
import { useSocket } from "@/socket";
import { useConnectedClientsStore } from "../stores/connected-clients-store";

const connectedClients = useConnectedClientsStore();
const { socket } = useSocket();

socket.connect();

const clientName = ref("");

</script>

<template>
    <div>
        <GInput v-model="clientName" id="client-name" label="Client Name" />
        <ul class="max-w-lg">
            <li v-for="x in connectedClients.data">
                <pre>
{{ JSON.stringify(x, null, 4) }}
                </pre>
            </li>
        </ul>
    </div>
</template>