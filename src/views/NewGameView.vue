<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";

import { PLAYER_COLOR_OPTIONS, type PlayerColor } from "@/stores/game";
import { checkMaxLength, checkMinLength, checkSepecialChars  } from "@/utils/validators";
import { useGameStore } from "@/stores/game.store";
import AppInput from "@/components/AppInput.vue";

const game = useGameStore();

function createInputValidator(name: string, minLength: number, maxLength: number) {
    return (value: string) => {
        return [
            checkMinLength(value, minLength),
            checkMaxLength(value, maxLength),
            checkSepecialChars(value),
        ].reduce((accum: string[], message) => {
            if (message) {
                accum.push(message(name));
            }
            return accum;
        }, []);
    }
}

const gameNameValidator = createInputValidator("The game name", 1, 32);
const playerNameValidator = createInputValidator("name", 1, 32);

const gameNameErrors = computed(() => {
    return gameNameValidator(game.name);
})

const maxPlayers = 4;

const editingPlayerIndex = ref(-1);

const availableColors = computed(() => {
    const claimedColors = game.players.map(player => player.color).filter((_, i) => i !== editingPlayerIndex.value);
    return Object.keys(PLAYER_COLOR_OPTIONS).filter(color => !claimedColors.includes(color as PlayerColor))
})

const playerNameErrors = computed(() => {
    const player = game.players[editingPlayerIndex.value];
    if (player) {
        return playerNameValidator(player.name);
    }
    return [];
});

const playerColorSelect = ref<HTMLSelectElement | null>(null);

watchEffect(() => {
    if (playerColorSelect.value) {
        playerColorSelect.value.focus();
    }
})


function addPlayer() {
    if (playerNameErrors.value.length === 0) {
        game.players.push({ name: "", color: availableColors.value[0] as PlayerColor });
        editingPlayerIndex.value = game.players.length - 1;
    }
}   

function savePlayer() {
    if (playerNameErrors.value.length === 0) {
        editingPlayerIndex.value = -1;
    }
}
</script>

<template>
    <div class="space-y-6">
        <h1 class="font-bold text-2xl">Start a new game</h1>
        <div class="space-y-8 w-64">
            <div class="space-y-4">
                <h2 class="text-lg font-bold" id="game-name-heading">Name</h2>
                <AppInput
                    :errors="gameNameErrors"
                    v-model="game.name"
                    placeholder="Name your game"
                    aria-labelledby="game-name-heading"
                />
            </div>
            <div class="space-y-4">
                <h2 class="text-lg font-bold">Players</h2>
                <ul v-if="game.players.length" class="space-y-4">
                    <li v-for="player, i in game.players" :key="i">
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
                                :errors="playerNameErrors"
                                v-model="player.name"
                                @keydown.enter="savePlayer"
                                id="player-name"
                                class="flex-1 w-full"
                                placeholder="Enter a name"
                                label="Name"
                            />
                            <div class="flex justify-end space-x-2">
                                <button class="button button-text button-dense text-red-500" @click="game.players.splice(i, 1)">
                                    Remove
                                </button>
                                <button class="button button-dense" type="submit">
                                    Save
                                </button>
                            </div>
                        </form>
                        <div v-else class="flex justify-between ">
                            <div class="flex items-center space-x-2">
                                <div v-if="player.color" class="h-[16px] w-[16px] rounded-full" :class="PLAYER_COLOR_OPTIONS[player.color]"></div>
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
            <button :disabled="game.players.length > 3" @click="addPlayer" class="button w-full">
                <span v-if="game.players.length >= maxPlayers">
                    No more players
                </span>
                <span v-else>
                    Add player
                </span>
            </button>
        </div>
    </div>
</template>