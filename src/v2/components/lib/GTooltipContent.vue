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
        v-show="show"
        @mouseenter="doOpen"
        @mouseleave="doClose"
        :id="id"
        role="tooltip"
        class="
            absolute z-10
            whitespace-nowrap
            bg-slate-100
            border shadow rounded
            p-2 mt-[2px]
        "
    >
        <slot></slot>
    </div>
</template>