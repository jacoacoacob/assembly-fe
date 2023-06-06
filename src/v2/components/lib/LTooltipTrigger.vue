<script setup lang="ts">
import { inject } from "vue";
import type { Ref } from "vue";

const show = inject<Ref<boolean>>("show");
const id = inject<string>("id");
const doOpen = inject<() => void>("doOpen");
const doClose = inject<() => void>("doClose");

</script>

<template>
    <div
        @mouseenter="doOpen"
        @mouseleave="doClose"
        @focus="show = true"
        @blur="show = false"
        tabindex="0"
        :aria-describedby="id"
    >
        <slot></slot>
    </div>
</template>