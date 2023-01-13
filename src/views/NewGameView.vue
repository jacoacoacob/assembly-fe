<script setup lang="ts">
import { computed, ref, reactive } from 'vue';

// const colors = ["red", "blue", "green", "orange"] as const;
const colors = {
    red: "bg-red-400",
    blue: "bg-blue-400",
    green: "bg-green-400",
    orange: "bg-orange-400",
};

interface Player {
    name: string;
    color: keyof typeof colors
}

const name = ref("");

const players = reactive<Player[]>([
    { name: "p1", color: "blue" },
    { name: "p2", color: "green" },
    { name: "p3", color: "red" },
    { name: "p4", color: "orange" },
]);

const availableColors = computed(
    () => {
        const claimedColors = players.map(player => player.color);
        return Object.keys(colors).filter(color => !claimedColors.includes(color as Player["color"]));
    }
);

</script>

<template>
    <div class="flex-1">
        <h1 class="font-bold text-2xl">Create New Game</h1>
        <ul class="bg-blue-400">
            <li v-for="player in players" :key="player.name" class="flex items-center space-x-2">
               <div class="h-[20px] w-[20px] rounded-full" :class="colors[player.color]"></div>  {{ player.name }}
            </li>
        </ul>
    </div>
</template>