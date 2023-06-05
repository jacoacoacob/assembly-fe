<script setup lang="ts">
import { watch } from "vue";
import { ref, provide } from "vue";

const props = defineProps<{
    id: string;
    delay?: number;
}>();

const OPEN_DELAY = props.delay ?? 500;
const CLOSE_DELAY = 100;

const show = ref(false);

provide("id", props.id);
provide("show", show);
provide("doOpen", doOpen);
provide("doClose", doClose);

watch(show, (current) => {
    if (current) {
        window.addEventListener("keydown", closeOnEscapeKeydown);
    } else {
        window.removeEventListener("keydown", closeOnEscapeKeydown);
    }
});

function closeOnEscapeKeydown(ev: KeyboardEvent) {
    if (ev.key === "Escape") {
        show.value = false;
    }
}

let closeTimer: number;
let openTimer: number;

function doClose() {
    clearTimeout(closeTimer);
    clearTimeout(openTimer);
    closeTimer = setTimeout(() => {
        show.value = false;
    }, CLOSE_DELAY)
}

function doOpen() {
    clearTimeout(closeTimer);
    clearTimeout(openTimer);
    openTimer = setTimeout(() => {
        show.value = true;
    }, OPEN_DELAY);
}

</script>

<template>
    <div class="relative">
        <slot></slot>
    </div>
</template>