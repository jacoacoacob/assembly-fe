<script setup lang="ts">
import { onMounted, ref } from "vue";

const canvas = ref<HTMLCanvasElement>();
let ctx: CanvasRenderingContext2D;

onMounted(() => {
    ctx = canvas.value?.getContext("2d") as CanvasRenderingContext2D;
});

function onMouseDown(ev: MouseEvent) {
    console.log(ev.offsetX, ev.offsetY);
}

function onMouseUp(ev: MouseEvent) {

}


</script>

<template>
    <div>
        <canvas
            ref="canvas"
            height="600"
            width="600"
            class="bg-blue-100"
            @mousedown="onMouseDown"
            @mouseup="onMouseUp"
        ></canvas>
    </div>
    <slot></slot>
</template>