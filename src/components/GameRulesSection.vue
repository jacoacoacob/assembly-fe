<script setup lang="ts">
defineProps<{ heading: string }>();
</script>

<template>
    <div
        class="space-y-4"
        :id="heading.replace(/\s{2,}/g, ' ').replace(/\s/g, '-').toLowerCase()"
    >
        <h2 class="font-semibold text-2xl">
            {{ heading }}
        </h2>
        <slot></slot>
    </div>
</template>