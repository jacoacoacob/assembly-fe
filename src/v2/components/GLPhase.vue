<script setup lang="ts">
import { computed } from "vue";
import { RadioGroup, RadioGroupDescription, RadioGroupLabel, RadioGroupOption } from "@headlessui/vue";

import { useGameStore, type GameMeta } from "../stores/game-store";
import { socket } from "@/socket";
import { useSessionStore } from "../stores/session-store";

const game = useGameStore();
const session = useSessionStore();

interface PhaseOption {
    value: GameMeta["phase"];
    text: string;
}

const options: PhaseOption[] = [
    {
        value: "setup",
        text: "Players can be added and claimed. No game actions can be taken.",
    },
    {
        value: "play",
        text: "Unclaimed players can be claimed. Game actions can be taken.",
    },
    {
        value: "complete",
        text: "The game is finished. No more actions of any kind may be taken.",
    },
];

const gamePhase = computed({
    get() {
        return game.meta.phase;
    },
    set(value) {
        socket.emit("game_meta:set_phase", value);
    },
});

</script>

<template>
    <div class="border border-slate-300 rounded p-4 bg-slate-100">
        <template v-if="session.isOwner">
            <div v-if="gamePhase === 'setup'" class="space-y-2">
                <button
                    class="p-2 shadow bg-slate-900 text-white rounded"
                    @click="gamePhase = 'play'"
                >
                    Start game
                </button>
                <p>
                    Once started, no more players may be added.
                    Players may still be claimed and unclaimed.
                </p>
                <p class="font-semibold">
                    This action cannot be reversed.
                </p>
            </div>
            <template v-else-if="gamePhase === 'play'">
                The game is in progress.
            </template>
            <template v-else>
                The game has ended.
            </template>
        </template>
        <template v-else>
            
        </template>
    </div>
</template>

<!-- <template>
    <RadioGroup v-if="session.isOwner" v-model="gamePhase" class="border border-slate-300 rounded p-4 space-y-4">
        <div>
            <RadioGroupLabel as="h2" class="font-bold text-lg">
                Game phase
            </RadioGroupLabel>
        </div>
        <div class="space-y-2">
            <RadioGroupOption
                v-for="{ value, text } in options"
                :key="value"
                :value="value"
                v-slot="{ checked }: { checked: boolean }"
            >
                <div
                    class="rounded p-2 cursor-pointer border border-slate-300"
                    :class="{ 'ring bg-blue-100': checked }"
                >
                    <p class="font-bold">
                        {{ value }}
                    </p>
                    <p>
                        {{ text }}
                    </p>
                </div>
            </RadioGroupOption>
        </div>
    </RadioGroup>
    <div v-else>
        <div v-if="gamePhase === 'setup'">
            The game not begun.
        </div>
        <div v-else-if="gamePhase === 'play'">
            The game is in progress.
        </div>
        <div v-else>
            The game has ended.
        </div>
    </div>
</template> -->