<script setup lang="ts">
import { inject, watch } from "vue";
import type { Ref } from "vue";
import { useGameStore } from "../stores/game-store";
import { drawPolygon } from "@/v2/canvas/draw-polygon";

const game = useGameStore();

// const ctx = inject<Ref<CanvasRenderingContext2D>>("ctx");

// watch(ctx!, (current) => {
//     if (current) {
//         drawPolygon(current, { nSides: 3, x: 50, y: 50, r: 20, strokeStyle: "black", fillStyle: "pink" });
//         drawPolygon(current, { nSides: 4, x: 100, y: 100, r: 20, strokeStyle: "black", fillStyle: "green"  });
//         drawPolygon(current, { nSides: 5, x: 150, y: 150, r: 20, strokeStyle: "black", fillStyle: "orange"  });
//         drawPolygon(current, { nSides: 6, x: 200, y: 200, r: 20, strokeStyle: "black", fillStyle: "purple"  });
//     }
// });

</script>

<template></template>