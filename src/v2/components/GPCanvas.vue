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

        if (width < 340) {
            board.tilesCamera.resizeTile(28);
        }
        else if (width < 480) {
            board.tilesCamera.resizeTile(32);
        }
        else if (width < 550) {
            board.tilesCamera.resizeTile(44);
        }
        else if (width < 660) {
            board.tilesCamera.resizeTile(48);
        }
        else if (width < 768) {
            board.tilesCamera.resizeTile(64);
        }
        else if (width < 880) {
            board.tilesCamera.resizeTile(78);
        }
        else if (width < 980) {
            board.tilesCamera.resizeTile(84);
        }
        else {
            board.tilesCamera.resizeTile(88);
        } 

        board.tilesCamera.canvasY = Math.floor((height - board.tilesCamera.height) / 2);
        board.tilesCamera.canvasX = Math.floor((width - board.tilesCamera.width) / 2);
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