<script setup lang="ts">
import { onMounted, ref } from "vue";

import { setupCanvasListeners } from "../canvas/setup-canvas-listeners";
import { useBoardStore } from "../stores/board-store";

const _container = ref<HTMLDivElement>();
const _canvas = ref<HTMLCanvasElement>();

const board = useBoardStore();

onMounted(() => {
    const container = _container.value as HTMLDivElement;
    const canvas = _canvas.value as HTMLCanvasElement;
    const ctx = _canvas.value?.getContext("2d") as CanvasRenderingContext2D;

    window.addEventListener("keydown", onKeydown);
    window.addEventListener("resize", onResize);

    setupCanvasListeners(canvas);

    function animate() {
        board.draw(ctx);
        requestAnimationFrame(animate);
    }

    animate();

    onResize();

    function onResize(ev?: UIEvent) {
        const { width, height } = container.getBoundingClientRect();

        canvas.width = width;
        canvas.height = height;

        if (width < 800) {
            board.tilesCamera.width = 500;
        } else if (width < 1000) {
            board.tilesCamera.width = 700;
        } else {
            board.tilesCamera.width = board.tiles.tileSize * board.tiles.cols;
        }
    }

    function onKeydown(ev: KeyboardEvent) {
        if (ev.key === "ArrowLeft") {
            board.tilesCamera.move(1, -1, 0);
        } else if (ev.key === "ArrowDown") {
            board.tilesCamera.move(1, 0, 1);
        } else if (ev.key === "ArrowRight") {
            board.tilesCamera.move(1, 1, 0);
        } else if (ev.key === "ArrowUp") {
            board.tilesCamera.move(1, 0, -1);
        }
    }

});

</script>

<template>
    <div
        ref="_container"
        class="
            -mx-4 -xl:mx-8 -my-4
            relative w-full
        "
    >
        <canvas ref="_canvas"></canvas>
        <slot></slot>
    </div>
</template>