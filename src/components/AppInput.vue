<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';

export default defineComponent({
    inheritAttrs: false,
});
</script>

<script setup lang="ts">
const props = defineProps<{
    focusOnMount?: boolean;
    errors?: string[];
    label?: string;
    modelValue?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
    if (props.focusOnMount) {
        inputRef.value?.focus()
    }
});

const isDirty = ref(false);

function onInput(event: Event) {
    isDirty.value = true;
    emit("update:modelValue", (event.target as HTMLInputElement).value);
}

</script>

<template>
    <div class="flex flex-col max-w-xs">
        <label v-if="label" :for="($attrs.id as string)" class="text-sm mx-2 mb-1 font-sans">{{ label }}</label>
        <input
            v-bind="$attrs"
            class="p-2 rounded border"
            :value="modelValue"
            ref="inputRef"
            @input="onInput"
        >
        <div v-if="errors?.length && isDirty" class="text-xs font-sans mx-2 mt-[2px]  text-red-500">
            {{ errors[0] }}
        </div>
    </div>
</template>