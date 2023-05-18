<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
    inheritAttrs: false,
});
</script>

<script setup lang="ts">
defineProps<{
    label?: string;
    modelValue?: string | number;
}>();

defineEmits(["update:modelValue"]);

const isFocused = ref(false);

</script>

<template>
    <div class="flex flex-col items-center space-y-1">
        <label
            v-if="label"
            :for="($attrs.id as string)"
            class="text-xs"
        >
            {{ label }}
        </label>
        <div class="border border-slate-400 rounded flex items-center" :class="{ 'ring-2 ring-blue-500': isFocused }">
            <slot name="input-left"></slot>
            <input
                v-bind="$attrs"
                class="p-1 focus:outline-none"
                :value="modelValue"
                @focus="isFocused = true"
                @blur="isFocused = false"
                @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            >
            <slot name="input-right"></slot>
        </div>
    </div>
</template>