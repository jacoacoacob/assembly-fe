<script setup lang="ts">
import IconSpinner from "@/components-v2/icon/IconSpinner.vue";

defineProps<{ isBusy?: boolean }>();
</script>

<template>
    <button
        :disabled="isBusy"
        class="
            relative border px-4 py-1 rounded bg-slate-50
            disabled:opacity-80
        "
    >
        <div
            v-if="isBusy"
            class="absolute top-0 left-0 w-full h-full flex justify-center items-center"
        >
            <IconSpinner v-if="isBusy" class="animate-spin" />
        </div>
        <div :class="{ 'invisible': isBusy }">
            <slot></slot>
        </div>
    </button>
</template>