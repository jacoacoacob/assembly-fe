<script setup lang="ts">
import { onMounted, ref } from "vue";

import { setupCanvasListeners } from "../canvas/setup-canvas-listeners";
import { useBoardStore } from "../stores/board-store";
import { useAnimationLoop } from "../canvas/use-animation-loop";

const _container = ref<HTMLDivElement>();
const _canvas = ref<HTMLCanvasElement>();

const board = useBoardStore();

onMounted(() => {
    const container = _container.value as HTMLDivElement;
    const canvas = _canvas.value as HTMLCanvasElement;
    const ctx = _canvas.value?.getContext("2d") as CanvasRenderingContext2D;

    const { animate } = useAnimationLoop(ctx);

    window.addEventListener("keydown", onKeydown);
    window.addEventListener("resize", onResize);

    animate();

    onResize();

    setupCanvasListeners(canvas);

    function onResize(ev?: UIEvent) {
        const { width, height } = container.getBoundingClientRect();

        canvas.width = width;
        canvas.height = height;

        let sizeMod: number;

        if (width < 340) {
            sizeMod = 60;
        }
        else if (width < 480) {
            sizeMod = 80;
        }
        else if (width < 550) {
            sizeMod = 100;
        }
        else if (width < 660) {
            sizeMod = 120;
        }
        else if (width < 768) {
            sizeMod = 140;
        }
        else if (width < 880) {
            sizeMod = 160;
        }
        else if (width < 980) {
            sizeMod = 180;
        }
        else {
            sizeMod = 200;
        }

        board.tilesCamera.resizeTile(
            Math.floor(
                (sizeMod / board.tiles.cols) * 4
            )
        );
        
        board.tilesCamera.canvasY = Math.floor(
            (height - board.tilesCamera.height) / 2
        );

        board.tilesCamera.canvasX = Math.floor(
            (width - board.tilesCamera.width) / 2
        );
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