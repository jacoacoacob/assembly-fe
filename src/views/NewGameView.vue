<script setup lang="ts">
import { computed, ref, nextTick, watchEffect } from 'vue';
import type { VNodeRef } from 'vue';

import AppInput from '@/components/AppInput.vue';

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
    // { name: "p1", color: "blue" },
    // { name: "p2", color: "green" },
    // { name: "p3", color: "red" },
    // { name: "p4", color: "orange" },
]);


const editingPlayerIndex = ref(-1);

const availableColors = computed(
    () => {
        const claimedColors = players.value.map(player => player.color).filter((_, i) => i !== editingPlayerIndex.value);
        return Object.keys(colors).filter(color => !claimedColors.includes(color as Player["color"]));
    }
);

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
        if (!/^[\w-]*$/.test(name)) {
            errors.push({ name: "Name may only contain letters, numbers, hyphens, and underscores" });
        }
    }

    return {
        errors,
        isValid: errors.length === 0,
    };
});

const playerColorSelect = ref<HTMLSelectElement | null>(null);

watchEffect(() => {
    if (playerColorSelect.value) {
        playerColorSelect.value.focus();
    }
})


function addPlayer() {
    if (playerFormValidation.value.isValid) {
        players.value.push({ name: "", color: availableColors.value[0] as Player["color"] });
        editingPlayerIndex.value = players.value.length - 1;
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
        <div class="space-y-8 w-64">
            <div class="space-y-4">
                <h2 class="text-lg font-bold">Players</h2>
                <ul v-if="players.length" class="space-y-4">
                    <li v-for="player, i in players" :key="i">
                        <form v-if="editingPlayerIndex === i" @submit.prevent="savePlayer" class="flex flex-col space-y-2">
                            <div class="flex flex-col flex-1">
                                <label for="player-color" class="text-sm mx-2 font-sans mb-1">Color</label>
                                <select
                                    id="player-color"
                                    :ref="el => playerColorSelect = (el as HTMLSelectElement)"
                                    class="flex-1 p-2 rounded border bg-white"
                                    v-model="player.color"
                                >
                                    <option disabled value="">Choose a color</option>
                                    <option v-for="color in availableColors" :value="color">{{ color }}</option>
                                </select>
                            </div>
                            <AppInput
                                :errors="playerFormValidation.errors.map(e => e.name)"
                                v-model="player.name"
                                @keydown.enter="savePlayer"
                                id="player-name"
                                class="flex-1 w-full"
                                placeholder="Enter a name"
                                label="Name"
                            />
                            <div class="flex justify-end space-x-2">
                                <button class="button button-text button-dense text-red-500" @click="players.splice(i, 1)">
                                    Remove
                                </button>
                                <button class="button button-dense" type="submit">
                                    Save
                                </button>
                            </div>
                        </form>
                        <div v-else class="flex justify-between ">
                            <div class="flex items-center space-x-2">
                                <div v-if="player.color" class="h-[16px] w-[16px] rounded-full" :class="colors[player.color]"></div>
                                <div>
                                {{ player.name }}
                            </div>
                            </div>
                            <div>
                                <button class="button button-dense" @click="editingPlayerIndex = i">
                                    edit
                                </button>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <button :disabled="players.length > 3" @click="addPlayer" class="button w-full">Add player</button>
        </div>
    </div>
</template>