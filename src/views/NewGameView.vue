<script setup lang="ts">
import { computed, ref, nextTick } from 'vue';
import type { VNodeRef } from 'vue';

const colors = {
    red: "bg-red-400",
    blue: "bg-blue-400",
    green: "bg-green-400",
    orange: "bg-orange-400",
};

interface Player {
    name: string;
    color?: keyof typeof colors,
}

const players = ref<Player[]>([
    { name: "p1", color: "blue" },
    { name: "p2", color: "green" },
    { name: "p3", color: "red" },
    { name: "p4", color: "orange" },
]);


const availableColors = computed(
    () => {
        const claimedColors = players.value.map(player => player.color);
        return Object.keys(colors).filter(color => !claimedColors.includes(color as Player["color"]));
    }
);

const editingPlayerIndex = ref(-1);
const playerFormValidation = computed(() => {
    const errors: { name: string }[] = []
    
    const player = players.value[editingPlayerIndex.value];
    if (player) {
        const name = player.name.trim();
        if (name.length === 0) {
            errors.push({ name: "Please enter a name." });
        }
        if (name.length > 16) {
            errors.push({ name: "Name must be less than or equal to 16 characters in length." });
        }
        if (!/^[\w-]$/.test(name)) {
            errors.push({ name: "Name may only contain letters, numbers, hyphens, and underscores" });
        }
    }

    return {
        errors,
        isValid: errors.length === 0,
    };
});

const playerNameInput = ref<VNodeRef | null>(null);

function addPlayer() {
    if (playerFormValidation.value.isValid) {
        players.value.push({ name: "", color: undefined });
        editingPlayerIndex.value = players.value.length - 1;
        
        nextTick(() => {    
            (playerNameInput.value as HTMLInputElement).focus();
        });
    }
}   

function savePlayer() {
    if (playerFormValidation.value.isValid) {
        editingPlayerIndex.value = -1;
    }
}

</script>

<template>
    <div class="space-y-6">
        <h1 class="font-bold text-2xl">Start a new game</h1>
        <div class="space-y-2 w-64">
            <h2 class="text-lg font-bold">Players</h2>
            <ul>
                <li v-for="player, i in players" :key="i">
                    <form v-if="editingPlayerIndex === i" @submit.prevent="savePlayer">
                        <div class="w-">
                            <input
                                class="w-full"
                                placeholder="Enter a player name"
                                type="text"
                                v-model="players[i].name"
                                :ref="(el) => playerNameInput = el"
                            >
                            <span v-if="playerFormValidation.errors.length" class="text-xs inline-block text-red-500">
                                {{ playerFormValidation.errors[0].name }}
                            </span>
                        </div>
                    </form>
                    <div v-else class="flex items-center space-x-2">
                        <div v-if="player.color" class="h-[16px] w-[16px] rounded-full" :class="colors[player.color]"></div>
                        <div>
                           {{ player.name }}
                       </div>
                    </div>
                </li>
            </ul>
            <button @click="addPlayer" class="button button-dense">Add player</button>
        </div>
    </div>
</template>