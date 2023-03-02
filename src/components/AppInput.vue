<script lang="ts">
import { defineComponent, ref, onMounted, computed, useAttrs } from 'vue';
import type { InputState } from '@/composables/use-input-state';

export default defineComponent({
    inheritAttrs: false,
});
</script>

<script setup lang="ts">
const props = defineProps<{
    focusOnMount?: boolean;
    errors?: string[];
    label?: string;
    modelValue?: string | number;
    state?: InputState<string | number>;
}>();

const attrs = useAttrs();

const emit = defineEmits(["update:modelValue", "blur", "focus"]);

const inputRef = ref<HTMLInputElement | null>(null);

onMounted(() => {
    if (props.focusOnMount) {
        inputRef.value?.focus()
    }
});

const labelClassName = computed(() => ({
    "before:content-['*'] before:text-red-500 before:mr-1": Boolean(attrs.required)
}));


const errors = computed(() =>
    [...(props.errors ?? []), ...(props.state?.errors ?? [])]
);

const isErrors = computed(() => errors.value.length > 0);

function onFocus(event: FocusEvent) {
    emit("focus");
}

function onBlur(event: FocusEvent) {
    emit("blur");
    props.state?.onBlur(event);
}

function onInput(event: Event) {
    const { value } = (event.target as HTMLInputElement)
    if (props.state) {
        props.state.value = value
    } else {
        emit("update:modelValue", (event.target as HTMLInputElement).value);
    }
}

/*
TODO
if attrs.type === "password" && props.allowUnmask {
    show unmask button
}
*/
</script>

<template>
    <div class="flex flex-col max-w-xs">
        <label
            v-if="label"
            :for="($attrs.id as string)"
            class="text-sm mx-2 mb-1 font-sans"
            :class="labelClassName"
        >{{ label }}</label>
        <input
            v-bind="$attrs"
            class="p-2 rounded border"
            :class="{ 'border-red-500': isErrors }"
            :value="state?.value ?? modelValue"
            ref="inputRef"
            @blur="onBlur"
            @focus="onFocus"
            @input="onInput"
        >

        <div v-if="errors" class="text-xs font-sans mx-2 mt-[2px] text-red-500">
            {{ errors[0] }}
        </div>
    </div>
</template>