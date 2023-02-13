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

const props = defineProps<{
    tileIndex: number;
    isOpen: boolean;
}>();

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
                {{ gameData.tiles[tileIndex].capacity }}
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
                    <div class="space-y-6 px-4 pb-4">
                        <div class="space-y-2">
                            <p>
                                If the tokens in this tile remain as they are at the end of the round, this
                                tile will add <span class="font-semibold">{{ explainedPlayer.score }}</span>
                                points to <span class="font-semibold">{{ explainedPlayer.name }}</span>'s score.
                            </p>
                            <!-- <h4 class="italic">How does scoring work</h4>
                            <p>
                                In this game, as in the rest of life, survival isn't a winner takes all brawl
                                but a constant negotiation in relationship with others.
                            </p>
                            <p>
                                Players earn points for each tile in which they have tokens.
                            </p>
                            <p v-if="explanation.tilePlayerIds.length === 1">
                                If a tile contains only one player's tokens, that player will lose 1 point.
                            </p>
                            <div v-else class="space-y-2 w-full">
                                <p>
                                    If you have 
                                    
                                    score points by being in relationship
                                    If a tile contains tokens belonging to two or more players, each player will
                                    earn points. The points earned by <span class="font-semibold">{{ explainedPlayer.name }}</span>,
                                    are calculated using the following steps.

                                    Points are earned
                                </p>

                                <ol class="list-disc pl-3">
                                    <li>
                                        Sum the total value of each player's tokens:
                                        <ul class="list-disc pl-3">
                                            <li v-for="score, playerId in explanation.tokenValueTotals" :key="playerId">
                                                {{ gameData.players[playerId].name }} {{ score }}
                                            </li>
                                        </ul>
                                    </li>
                                </ol> -->
                                <!-- <p>
                                    If a tile contains the tokens of two or more players, each player's points
                                    will be calculated as follows.
                                </p>
                                <h5 class="italic">Variables</h5>
                                <ul class="list-disc pl-4 space-y-2">
                                    <li>
                                        <code class="p-1 text-xs bg-slate-200 rounded">player_token_total</code>: the total 
                                        value of all of a player's tokens in the tile.
                                    </li>
                                    <li>
                                        <code class="p-1 text-xs bg-slate-200 rounded">tile_capacity_modifier</code>: the
                                        tile's capacity minus the total value of all the tokens in the tile divided by 2 and
                                        rounded to the nearest whole number.
                                    </li>
                                </ul>
                                <h5 class="italic">Steps</h5>
                                <p>
                                    To calculate <span class="font-semibold">{{ explainedPlayer.name }}</span>'s points,
                                    do the following: 
                                </p>
                                <ol class="list-decimal pl-4 spacey-y-2">
                                    <li>
                                        Find the <code class="p-1 text-xs bg-slate-200 rounded">tile_capacity_modifier</code>. Here,
                                        this is <span class="font-semibold">{{ explanation.tileCapacityRemainder }}</span>.
                                    </li>
                                    <li>
                                        Find the <code class="p-1 text-xs bg-slate-200 rounded">player_token_total</code>
                                        of the player whose points you're calculating. Here, this is
                                        <span class="font-semibold">{{ explainedPlayer.tokenValue }}</span>.
                                    </li>
                                    <li class="break-words">

                                        Keep a running total of the results of for each other player with tokens in the tile, 
                                        subtract that player's <code class="p-1 text-xs bg-slate-200 rounded">player_token_total</code>
                                        from <span class="font-semibold">{{ explainedPlayer.name }}</span>'s and then 
                                        add the <code class="p-1 text-xs bg-slate-200 rounded break-words">tile_capacity_modifier</code>.
                                    </li>
                                </ol> -->

                                <!-- <p>
                                    This is calculated by first, subtracting the total value of each other player's tokens on this tile
                                    from the total value of <span class="font-semibold">{{ explainedPlayer.name }}</span>'s tokens
                                    on this tile.
                                </p>
                                <ol class="list-decimal pl-6 space-y-2">
                                    <li>
                                        Sum the total value of all of <span class="font-semibold">{{ explainedPlayer.name }}</span>'s
                                        tokens (<span class="font-semibold">{{ explainedPlayer.tokenValue }}</span>).
                                    </li>
                                    <li>
                                        Subtract the total value of all tokens on the tile (<span class="font-semibold"> {{ explanation.tileTokenValuesSum }}</span>)
                                        from the tile's capacity (<span class="font-semibold"> {{ explanation.tileCapacity }}</span>), divide by 2 and round
                                        to the nearest whole number (<span class="font-semibold"> {{ explanation.tileCapacityRemainder }}</span>).
                                    </li>
                                    <li>
                                        For each 
                                    </li>
                                </ol> -->

                            <!-- </div> -->
                        </div>

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