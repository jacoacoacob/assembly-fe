<script setup lang="ts">
import IconEllipsisHorizontal from './LIconEllipsisHorizontal.vue';

defineProps<{
    isBusy?: boolean;
}>();
</script>

<template>
    <button class="button flex justify-center items-center" :disabled="isBusy">
        <template v-if="isBusy">
            <span class="sr-only">Loading</span>
            <IconEllipsisHorizontal class="animate-[pulse_1s_ease-in-out_infinite]" />
        </template>
        <div v-else>
            <slot ></slot>
        </div>
    </button>    
</template>