<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/vue";

import { useGameDataStore } from "@/stores-v2/game-data.store";
import { useScoresStore } from "@/stores-v2/scores.store";
import { useTilesStore } from "@/stores-v2/tiles.store";
import { usePlayersStore } from "@/stores-v2/players.store";

const gameData = useGameDataStore();
const tiles = useTilesStore();
const players = usePlayersStore();
const scores = useScoresStore();

defineEmits(["click"]);

const props = defineProps<{
    tileIndex: number;
    isOpen: boolean;
}>();

const tileCapacity = computed(() => gameData.tiles[props.tileIndex].capacity);
const tilePlayerScore = computed(() =>
    scores.tileScores[props.tileIndex][players.viewedPlayer.id]
);
const explanation = computed(() => scores.tileScoresExplanation[props.tileIndex]);

</script>

<template>
    <Popover v-slot="{ open }: { open: boolean; }">
        <div class="relative" :class="{ 'z-20': open, 'z-10': !open }">
            <PopoverButton class="cursor-pointer p-1 rounded z-10" @click="$emit('click')">
                {{ tileCapacity }}
            </PopoverButton>
            <Transition
                enter-active-class="transition duration-75 ease-out"
                enter-from-class="translate-y-1 opacity-0"
                enter-to-class="translate-y-0 opacity-100"
                leave-active-class="transition duration-75 ease-in"
                leave-from-class="translate-y-0 opacity-100"
                leave-to-class="translate-y-1 opacity-0"
            >
                <PopoverPanel class="absolute z-10 bg-slate-50 p-4 shadow-lg rounded text-sm max-h-80 w-56 overflow-auto">
                    <div class="space-y-2">
                        <p>
                            If the tokens in this tile remain as they are at the end of the round, this 
                            tile will contribute  <span class="font-semibold">{{ tilePlayerScore }}</span> 
                            points to <span class="font-semibold">{{ players.viewedPlayer.name }}</span>'s
                            score.
                        </p>
                        <p>
                            Here is how the points are calculated for this tile.
                        </p>
                        <!-- <div class="space-y-2">
                            <div>
                                <h4 class="font-semibold">Player Scores</h4>
                                <ul>
                                    <li v-for="x in explanation.playerScores">
                                        {{ x.player }} {{ x.total }}
                                    </li>
                                </ul>
                            </div>
                        </div> -->
                    </div>
                </PopoverPanel>
            </Transition>
        </div>
    </Popover>
</template>