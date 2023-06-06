<script setup lang="ts">
import { ref } from "vue";
import LInput from "./lib/LInput.vue";
import type { GamePlayer } from "@/v2/stores/game-store";
import { useSessionStore } from "@/v2/stores/session-store";
import LButton from "./lib/LButton.vue";
import IconCheckmark from "./icon/IconCheckmark.vue";
import { useValidation, maxLen, noSpaces } from "@/v2/composables/use-validation";
import { useWatchedRef } from "@/v2/composables/use-watched-ref";
import { useEmitWithAck } from "@/v2/composables/use-emitters";
import ClaimPlayerButton from "@/v2/components/game-page/claim-player-button.vue"
import { computed } from "vue";

const props = defineProps<{
    player: GamePlayer;
}>();

const session = useSessionStore();

const isEditing = ref(false);

const playerName = useWatchedRef("", () => props.player.display_name);
const playerNameErrors = useValidation({
    ref: playerName,
    validators: [maxLen(16), noSpaces],
});

const updatePlayerName = useEmitWithAck("game:update_player_name");

async function onUpdatePlayerName() {
    await updatePlayerName.emit({
        playerId: props.player.id,
        name: playerName.value
    });
    isEditing.value = false;
}

const deletePlayer = useEmitWithAck("game:remove_player");

const canEditOrDelete = computed(
    () => (
        session.isOwner ||
        session.clientSession?.clientId === props.player.created_by
    )
);

</script>

<template>
    <li class="flex space-x-2 justify-between">
        <template v-if="isEditing">
            <form @submit.prevent="onUpdatePlayerName">
                <LInput v-model="playerName">
                    <template v-slot:right>
                        <LButton type="submit" class="border-none rounded-none px-2 bg-black text-white">
                            <IconCheckmark />
                        </LButton>
                    </template>
                    <template v-slot:below>
                        <div v-if="playerNameErrors.length" class="text-sm text-red-500">
                            {{ playerNameErrors[0] }}
                        </div>
                    </template>
                </LInput>
            </form>
            <LButton @click="isEditing = false">
                cancel
            </LButton>
        </template>
        <template v-else>
            <div class="font-semibold flex space-x-2">
                <IconCheckmark v-if="session.clientSession?.playerIds.includes(player.id)" class="w-4" />
                <div v-else class="w-4"></div>
                <span>
                    {{ player.display_name }}
                </span>
            </div>
            <div class="flex space-x-2">
                <ClaimPlayerButton :playerId="player.id" />
                <LButton v-if="canEditOrDelete" @click="isEditing = true">
                    edit
                </LButton>
                <LButton v-if="canEditOrDelete" @click="() => deletePlayer.emit({ playerId: player.id })">
                    delete
                </LButton>
            </div>
        </template>
    </li>
</template>