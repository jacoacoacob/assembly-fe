<script setup lang="ts">
import { useRoute } from "vue-router";

import { useSocket } from "@/socket";
import { onMounted } from "vue";


onMounted(() => {
    const { socket } = useSocket();

    socket.connect();
});

</script>

<template>
    <div>

    </div>
</template>