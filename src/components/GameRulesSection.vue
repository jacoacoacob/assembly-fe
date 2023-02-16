<script setup lang="ts">
defineProps<{ heading: string }>();
</script>

<template>
    <div
        class="space-y-2"
        :id="heading.replace(/\s{2,}/g, ' ').replace(/\s/g, '-').toLowerCase()"
    >
        <h2 class="font-semibold text-lg">
            {{ heading }}
        </h2>
        <slot></slot>
    </div>
</template>