<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    inheritAttrs: false,
});
</script>

<script setup lang="ts">
defineProps<{
    label?: string;
    modelValue: string | number;
}>();

defineEmits(["update:modelValue"]);
</script>

<template>
    <div class="flex flex-col space-y-1">
        <label
            v-if="label"
            :for="($attrs.id as string)"
            class="text-xs"
        >
            {{ label }}
        </label>
        <input
            v-bind="$attrs"
            class="border border-slate-400 p-1 rounded focus:ring-1"
            :value="modelValue"
            @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
        >
    </div>
</template>