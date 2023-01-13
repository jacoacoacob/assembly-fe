<script setup lang="ts">
defineProps({
    isRoot: Boolean,
});
defineEmits(["go-back"]);
</script>

<template>
    <div class="flex flex-col flex-1 justify-center items-center">
        <button
            v-if="!isRoot"
            class="button button-dense absolute top-3 left-3"
            @click="$emit('go-back')"
        >
            Back
        </button>
        <slot></slot>
    </div>
</template>