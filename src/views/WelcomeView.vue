<script setup lang="ts">
import { RouterLink } from 'vue-router';
</script>

<template>
    <div class="space-y-8">
        <h1 class="font-semibold text-4xl">Welcome</h1>
        <nav>
            <ul class="space-y-6 flex flex-col items-center">
                <li class="w-full">
                    <RouterLink class="button w-full" to="new-game">
                        New Game
                    </RouterLink>
                </li>
                <li class="w-full">
                    <RouterLink class="button w-full" to="saved-games">
                        Saved Games
                    </RouterLink>
                </li>
            </ul>
        </nav>
    </div>
</template>
