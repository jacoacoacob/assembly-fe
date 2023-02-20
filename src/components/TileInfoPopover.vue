<script setup lang="ts">
import { computed, ref, watchEffect } from "vue";
import {
    Popover,
    PopoverButton,
    PopoverPanel,
    RadioGroup,
    RadioGroupOption,
} from "@headlessui/vue";

import { useGameDataStore } from "@/stores-v2/game-data.store";
import { useScoresStore } from "@/stores-v2/scores.store";
import { PLAYER_COLOR_OPTIONS, usePlayersStore } from "@/stores-v2/players.store";
import type { Player } from "@/stores-v2/game-data.types";
import { useTilesStore } from "@/stores-v2/tiles.store";

const gameData = useGameDataStore();
const players = usePlayersStore();
const scores = useScoresStore();
const tiles = useTilesStore();

const props = defineProps<{ tileIndex: number; }>();

const tilePlayerPoints = computed(() => {
    const { tilePlayerIds } = tiles.tileTokenGraph[props.tileIndex];
    return Object.keys(scores.tileScores[props.tileIndex]).reduce(
        (accum: Record<Player["id"], number>, playerId) => {
            if (tilePlayerIds.includes(playerId)) {
                accum[playerId] = scores.tileScores[props.tileIndex][playerId];
            }
            return accum;
        },
        {}
    );
});

const explainedPlayerId = ref<string>("");

const explainedPlayer = computed(() => {
    return {
        name: gameData.players[explainedPlayerId.value]?.name,
        score: tilePlayerPoints.value[explainedPlayerId.value],
    }
});

watchEffect(() => {
    const { tilePlayerIds } = tiles.tileTokenGraph[props.tileIndex];
    if (tilePlayerIds.includes(players.viewedPlayer.id)) {
        explainedPlayerId.value = players.viewedPlayer.id;
    } else if (tilePlayerIds.length > 0) {
        explainedPlayerId.value = tilePlayerIds[0];
    }
});

</script>

<template>
    <Popover v-slot="{ open }: { open: boolean; }">
        <div class="relative" :class="{ 'z-20': open, 'z-10': !open }">
            <PopoverButton class="cursor-pointer p-1 rounded z-10">
                {{ tiles.seasonalTileCapacities[tileIndex] }}
            </PopoverButton>
            <Transition
                enter-active-class="transition duration-75 ease-out"
                enter-from-class="translate-y-1 opacity-0"
                enter-to-class="translate-y-0 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="translate-y-0 opacity-100"
                leave-to-class="translate-y-1 opacity-0"
            >
                <PopoverPanel class="absolute z-10 bg-slate-50 shadow-lg rounded text-sm w-56 max-h-[28rem] overflow-auto">
                    <div class="bg-slate-50 p-4 sticky top-0">
                        <RadioGroup v-model="explainedPlayerId" class="space-y-2">
                            <RadioGroupOption
                                v-for="score, playerId in tilePlayerPoints"
                                :key="playerId"
                                :value="playerId"
                                v-slot="{ checked }: { checked: boolean }"
                                class="cursor-pointer"
                            >
                                <div class="flex items-center justify-between p-1 rounded border border-black" :class="{ 'bg-black text-white': checked }">
                                    <div class="flex items-center space-x-1">
                                        <span class="h-3 w-3 rounded-full" :class="`${PLAYER_COLOR_OPTIONS[gameData.players[playerId].color]}`"></span>
                                        <span>
                                            {{ gameData.players[playerId].name }}
                                        </span>
                                    </div>
                                    <span>
                                        {{ score }}
                                    </span>
                                </div>
                            </RadioGroupOption>
                        </RadioGroup>
                    </div>
                    <div class="space-y-2 px-4 pb-4">
                        <p v-if="explainedPlayerId">
                            If the tokens in this tile remain as they are at the end of the round, this
                            tile will add <span class="font-semibold">{{ explainedPlayer.score }}</span>
                            points to <span class="font-semibold">{{ explainedPlayer.name }}</span>'s score.
                        </p>
                        <p v-else>
                            No players have tokens in this tile.
                        </p>
                        <p v-if="tiles.degredation.degradingTiles.includes(tileIndex)">
                            Also, this is a degrading tile. It has so far lost
                            <span class="font-semibold">{{ tiles.degredation.tileCapacityModifiers[tileIndex] }}</span> 
                            capacity.
                        </p>
                        <p v-if="tiles.degredation.recoveringTiles.includes(tileIndex)">
                            Also, this tile is recovering from degradation. It will recover its full capacity
                            after <span class="font-semibold">{{ tiles.degredation.tileCapacityModifiers[tileIndex] }}</span>
                            more round completions.
                        </p>
                    </div>
                </PopoverPanel>
            </Transition>
        </div>
    </Popover>
</template>

/*


1. find the sum of each player's token values
2. for each player in the tile
    - compare player

for each player in tile:
    1. calculate each player's 

tile_capacity_modifier

*/