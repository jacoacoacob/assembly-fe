<script setup lang="ts">
import { computed, ref, watchEffect, onBeforeMount } from "vue";
import { onBeforeRouteLeave } from "vue-router";

import { PLAYER_COLOR_OPTIONS, type PlayerColor, type Player } from "@/stores/game-data";
import { checkMaxLength, checkMinLength, checkSepecialChars  } from "@/utils/validators";
import { useGameDataStore } from "@/stores/game-data.store";
import AppInput from "@/components/AppInput.vue";
import { listGames, saveGame } from "@/api/game-api";
import { randId } from "@/utils/rand";

const game = useGameDataStore();

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

const existingGames = listGames();

const gameName = ref("");
const gamePlayers = ref<Player[]>([]);

const gameNameErrors = computed(() => {
    const errors = gameNameValidator(gameName.value);
    if (existingGames.some(game => game.name === gameName.value)) {
        errors.push(`A game with name "${gameName.value}" already exists.`);
    }
    return errors;
});


const gameFormError = ref<string>("");

const maxPlayers = 4;

const editingPlayerIndex = ref(-1);

const availableColors = computed(() => {
    const claimedColors = gamePlayers.value.map(player => player.color).filter((_, i) => i !== editingPlayerIndex.value);
    return Object.keys(PLAYER_COLOR_OPTIONS).filter(color => !claimedColors.includes(color as PlayerColor))
})



const playerNameErrors = computed(() => {
    const player = gamePlayers.value[editingPlayerIndex.value];
    if (player) {
        return playerNameValidator(player.name);
    }
    return [];
});

onBeforeMount(() => {
    // gameData.$reset();
});

onBeforeRouteLeave((to) => {
    if (to.name === "game") {
        if (gameName.value.length === 0) {
            gameFormError.value = "Please enter a valid name for this game.";
            return false;
        }
        if (gamePlayers.value.length < 2) {
            gameFormError.value = "You need between 2 and 4 players to start.";
            return false;
        }
        if (gameNameErrors.value.length || playerNameErrors.value.length) {
            gameFormError.value = "Please fix any form errors.";
            return false;
        }
        game.pushEvent({
            type: "create_game",
            data: {
                players: gamePlayers.value,
                name: gameName.value
            }
        });
    }
    return true;
});

const playerColorSelect = ref<HTMLSelectElement | null>(null);

watchEffect(() => {
    if (playerColorSelect.value) {
        playerColorSelect.value.focus();
    }
});


function addPlayer() {
    if (playerNameErrors.value.length === 0) {
        const player: Player = { id: randId(8), name: "", color: availableColors.value[0] as PlayerColor };
        if (gamePlayers.value.some(p => p.id === player.id)) {
            addPlayer();
        } else {
            gamePlayers.value.push(player);
            editingPlayerIndex.value = gamePlayers.value.length - 1;
        }
    }
}   

function savePlayer() {
    if (playerNameErrors.value.length === 0) {
        editingPlayerIndex.value = -1;
    }
}



</script>

<template>
    <div class="space-y-16 w-64">
        <div class="space-y-10 ">
            <h1 class="font-bold text-2xl">Start a new game</h1>
            <div class="space-y-12">
                <div class="space-y-4">
                    <h2 class="text-lg font-bold" id="game-name-heading">Name</h2>
                    <AppInput
                        :errors="gameNameErrors"
                        v-model="gameName"
                        placeholder="Name your game"
                        aria-labelledby="game-name-heading"
                    />
                </div>
                <div class="space-y-4">
                    <h2 class="text-lg font-bold">Players</h2>
                    <ul v-if="gamePlayers.length" class="space-y-4">
                        <li v-for="player, i in gamePlayers" :key="i">
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
                                    <button class="button button-text button-dense text-red-500" @click="gamePlayers.splice(i, 1)">
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
                    <button :disabled="gamePlayers.length > 3" @click="addPlayer" class="button w-full">
                        <span v-if="gamePlayers.length >= maxPlayers">
                            No more players
                        </span>
                        <span v-else>
                            Add player
                        </span>
                    </button>
                </div>
            </div>
        </div>
        <div>
            <RouterLink
                :to="{ name: 'game', params: { name: gameName } }"
                class="button button-text w-full bg-slate-900 text-slate-50"
            >
                Start
            </RouterLink>
            <span class="text-xs text-red-500 inline-block">{{ gameFormError }}</span>
        </div>
    </div>
</template>