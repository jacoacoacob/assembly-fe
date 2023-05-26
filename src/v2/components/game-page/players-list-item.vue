<script setup lang="ts">
import { ref } from "vue";
import GInput from "../lib/GInput.vue";
import { useGameStore, type GamePlayer } from "@/v2/stores/game-store";
import { useSessionStore } from "@/v2/stores/session-store";
import GButton from "../lib/GButton.vue";
import IconCheckmark from "../icon/IconCheckmark.vue";
import { useValidation, maxLen, noSpaces } from "@/v2/composables/use-validation";
import { useWatchedRef } from "@/v2/composables/use-watched-ref";
import { useEmitWithAck } from "@/v2/composables/use-emitters";

const props = defineProps<{
    player: GamePlayer;
}>();

const session = useSessionStore();
const game = useGameStore();

const isEditing = ref(false);

const playerName = useWatchedRef("", () => props.player.display_name);
const playerNameErrors = useValidation({
    ref: playerName,
    validators: [maxLen(16), noSpaces],
});

const { emit } = useEmitWithAck("game:update_player_name");

function onSubmit() {
    emit({
        playerId: props.player.id,
        name: playerName.value
    });
}

</script>

<template>
    <li class="flex space-x-2 justify-between">
        <template v-if="isEditing">
            <form @submit.prevent="onSubmit">
                <GInput v-model="playerName">
                    <template v-slot:right>
                        <GButton type="submit" class="border-none rounded-none px-2 bg-black text-white">
                            <IconCheckmark />
                        </GButton>
                    </template>
                    <template v-slot:below>
                        <div v-if="playerNameErrors.length" class="text-sm text-red-500">
                            {{ playerNameErrors[0] }}
                        </div>
                    </template>
                </GInput>
            </form>
            <GButton @click="isEditing = false">
                cancel
            </GButton>
        </template>
        <template v-else>
            <span class="font-semibold">
                {{ player.display_name }}
            </span>
            <div v-if="session.isOwner || session.clientSession?.clientId === player.client_id" class="flex space-x-2">
                <GButton @click="isEditing = true">
                    edit
                </GButton>
                <GButton @click="() => game.removePlayer(player.id)">
                    delete
                </GButton>
            </div>
        </template>
    </li>
</template>