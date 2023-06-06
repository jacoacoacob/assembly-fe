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
    <RadioGroup v-if="session.isOwner" v-model="gamePhase" class="border border-slate-300 rounded p-4 space-y-4">
        <div>
            <RadioGroupLabel as="h2" class="font-bold">
                Game phase
            </RadioGroupLabel>
            <RadioGroupDescription class="text-sm">
                this a thing
            </RadioGroupDescription>
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
        {{ gamePhase }}
    </div>
</template>