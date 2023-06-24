<script setup lang="ts">
import { computed, onUnmounted, watch, onMounted, ref } from "vue";

import { useBoardStore } from "../stores/board-store";
import { useCanvasListeners } from "../canvas/use-canvas-listeners";
import { useAnimationLoop } from "../canvas/use-animation-loop";
import { nextTick } from "vue";
import { usePositioning } from "../composables/use-positioning";

const container = ref<HTMLDivElement>();
const canvas = ref<HTMLCanvasElement>();

const ctx = computed(() => canvas.value?.getContext("2d"));

const animation = useAnimationLoop(ctx);
const canvasListeners = useCanvasListeners(canvas);
const positioning = usePositioning();

const board = useBoardStore();

watch([() => board.tiles.cols, () => board.tiles.rows], () => {
    onResize();
});

onUnmounted(() => {
    animation.stop();
    canvasListeners.teardown();

    window.removeEventListener("keydown", onKeydown);
    window.removeEventListener("resize", onResize);
});

onMounted(() => {
    animation.run();
    canvasListeners.setup();

    onResize();

    window.addEventListener("keydown", onKeydown);
    window.addEventListener("resize", onResize);
});

function onResize() {
    if (container.value && canvas.value) {

        let { width, height } = container.value.getBoundingClientRect();

        width = Math.round(width);
        height = Math.round(height);
        
        canvas.value.width = width;
        canvas.value.height = height;
        canvas.value.style.width = `${width}px`;
        canvas.value.style.height = `${height}px`;
        
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

        positioning.organizeTiles();
    }
}

function onKeydown(ev: KeyboardEvent) {
    if (ev.key === "ArrowLeft") {
        board.tilesCamera.move(1, -1, 0);
    }
    else if (ev.key === "ArrowDown") {
        board.tilesCamera.move(1, 0, 1);
    }
    else if (ev.key === "ArrowRight") {
        board.tilesCamera.move(1, 1, 0);
    }
    else if (ev.key === "ArrowUp") {
        board.tilesCamera.move(1, 0, -1);
    }
}

</script>

<template>
    <div
        ref="container"
        class="
            -mx-4 -xl:mx-8 -my-4
            relative w-full
        "
    >
        <canvas ref="canvas"></canvas>
    </div>
</template>