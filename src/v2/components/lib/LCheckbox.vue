<script setup lang="ts">
import IconCheckmark from '../icon/IconCheckmark.vue';

defineProps<{ modelValue: boolean }>();
defineEmits(["update:modelValue"]);

</script>

<template>
    <button
        class="
            rounded h-6 w-6 bg-slate-200 border border-slate-400
            disabled:opacity-40 disabled:cursor-auto disabled:hover:bg-slate-200
        "
        :class="{ 'bg-pink-500 text-white': modelValue }"
        role="checkbox"
        :aria-checked="modelValue"
        @click="$emit('update:modelValue', !modelValue)"
    >
        <IconCheckmark v-show="modelValue" class="h-5 w-5 font-bold" />
    </button>
</template>