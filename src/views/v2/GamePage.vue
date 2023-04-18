<script setup lang="ts">
import GButton from "@/components-v2/GButton.vue";
import GInput from "@/components-v2/GInput.vue";
import { useSocket } from "@/socket";
import { ref } from "vue";

const { socket } = useSocket();

socket.connect();

socket.on("clients", (clients) => {
    console.log(clients)
});

const clientName = ref("");

const isBusy = ref(false);

</script>

<template>
    <div>
        <GButton @click="isBusy = !isBusy">
            Toggle busy
        </GButton>
        <GInput v-model="clientName" label="Client Name" />
    </div>
</template>