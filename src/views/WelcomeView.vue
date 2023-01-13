<script setup lang="ts">
import { ref } from 'vue';
import CreateGame from '@/components/CreateGame.vue';
import SavedGames from "@/components/SavedGames.vue";
import ViewContent from '@/components/ViewContent.vue';

const view = ref<"initial" | "load-game" | "new-game">("initial");
</script>

<template>
    <div class="min-h-screen flex font-mono">
        <ViewContent v-if="view === 'initial'" class=" space-y-10" isRoot>
            <h1 class="font-semibold text-4xl">Welcome</h1>
            <ul class="space-y-4 flex flex-col items-center">
                <li class="w-full">
                    <button class="button w-full" @click="view = 'load-game'">
                        Saved Games
                    </button>
                </li>
                <li class="w-full">
                    <button class="button w-full" @click="view = 'new-game'">
                        New Game
                    </button>
                </li>
            </ul>
        </ViewContent>
        <ViewContent v-if="view === 'new-game'" @go-back="view = 'initial'">
            <CreateGame />
        </ViewContent>
        <ViewContent v-if="view === 'load-game'" @go-back="view = 'initial'">
            <SavedGames />
        </ViewContent>
    </div>
</template>
