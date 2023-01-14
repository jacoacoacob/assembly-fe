<script setup lang="ts">
import { RouterLink, type RouteParams } from 'vue-router';
</script>

<template>
    <div class="flex justify-center bg-slate-900">
        <div class="flex flex-col flex-1 justify-center items-center min-h-screen font-mono max-w-6xl relative bg-slate-50">
            <nav aria-label="breadcrumbs" class="absolute top-3 left-3">
                <ol class="flex space-x-2">
                    <li v-for="crumb, i in $route.meta.breadcrumbs">
                        <RouterLink v-if="crumb.to" :to="crumb.to" aria-current="location">
                            {{ typeof crumb.name === "function" ? crumb.name($route.params) : crumb.name }}
                        </RouterLink>
                        <span v-else class="font-semibold">
                            {{ typeof crumb.name === "function" ? crumb.name($route.params) : crumb.name }}
                        </span> 
                        <span v-if="i < $route.meta.breadcrumbs.length - 1" class="ml-2">/</span>
                    </li>
                </ol>
            </nav>
            <slot></slot>
        </div>
    </div>
</template>