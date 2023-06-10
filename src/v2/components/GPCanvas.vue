<script setup lang="ts">
import { onMounted, ref } from "vue";

import { setupCanvas } from "@/v2/canvas/setup-canvas";

const canvas = ref<HTMLCanvasElement>();

onMounted(() => {
    setupCanvas(canvas.value?.getContext("2d")!);
});

</script>

<template>
    <canvas ref="canvas" width="600" height="600"></canvas>
</template>