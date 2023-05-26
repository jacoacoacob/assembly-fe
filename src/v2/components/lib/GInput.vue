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
    errors?: string[];
}>();

defineEmits(["update:modelValue"]);

const isFocused = ref(false);

</script>

<template>
    <div class="flex flex-col items-start relative">
        <label
            v-if="label"
            :for="($attrs.id as string)"
            class="text-xs"
        >
            {{ label }}
        </label>
        <div
            class="border border-slate-400 rounded flex items-center relative"
            :class="{ 'ring-2 ring-blue-500 border-blue-500': isFocused }"
        >
            <slot name="left"></slot>
            <input
                v-bind="$attrs"
                class="p-1 px-2 rounded focus:outline-none"
                :value="modelValue"
                @focus="isFocused = true"
                @blur="isFocused = false"
                @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
            >
            <slot name="right"></slot>
        </div>
        <!-- <slot name="below"></slot> -->
        <div v-if="errors?.length" class="text-xs text-red-500">
            {{ errors[0] }}
        </div>

    </div>
</template>