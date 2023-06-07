<script setup lang="ts">
import { ref } from "vue";
import LInput from "./lib/LInput.vue";
import { useGameStore, type GamePlayer } from "@/v2/stores/game-store";
import { useSessionStore } from "@/v2/stores/session-store";
import LButton from "./lib/LButton.vue";
import LIconButton from "./lib/LIconButton.vue";
import IconCheckmark from "./icon/IconCheckmark.vue";
import { useValidation, maxLen, noSpaces } from "@/v2/composables/use-validation";
import { useWatchedRef } from "@/v2/composables/use-watched-ref";
import { useEmitWithAck } from "@/v2/composables/use-emitters";
import ClaimPlayerButton from "@/v2/components/game-page/claim-player-button.vue"
import { computed } from "vue";
import IconPencilSquare from "./icon/IconPencilSquare.vue";
import IconTrash from "./icon/IconTrash.vue";
import LTooltip from "./lib/LTooltip.vue";
import LTooltipTrigger from "./lib/LTooltipTrigger.vue";
import LTooltipContent from "./lib/LTooltipContent.vue";
import IconXCircle from "./icon/IconXCircle.vue";

const props = defineProps<{
    player: GamePlayer;
}>();

const game = useGameStore();
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
            <form @submit.prevent="onUpdatePlayerName" class="flex-1 flex justify-between space-x-2 ">
                <LInput v-model="playerName">
                    <template v-slot:below>
                        <div v-if="playerNameErrors.length" class="text-sm text-red-500">
                            {{ playerNameErrors[0] }}
                        </div>
                    </template>
                </LInput>
                <div class="flex space-x-2">
                    <LTooltip :id="`save-changes-${player.id}`">
                        <LTooltipTrigger>
                            <LIconButton icon="Checkmark" type="submit" />
                        </LTooltipTrigger>
                        <LTooltipContent>
                            Save changes
                        </LTooltipContent>
                    </LTooltip>
                    <LTooltip :id="`discard-changes-${player.id}`">
                        <LTooltipTrigger :is="LIconButton" icon="XCircle" @click="isEditing = false">
                            <LIconButton icon="XCircle" @click="isEditing = false" />
                        </LTooltipTrigger>
                        <LTooltipContent>
                            Discard changes
                        </LTooltipContent>
                    </LTooltip>
                </div>
            </form>
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
                <ClaimPlayerButton :player="player" />
                <LTooltip
                    v-if="canEditOrDelete"
                    :id="`edit-player-${player.id}`"
                    :delay="1000"
                >
                    <LTooltipTrigger>
                        <LIconButton icon="PencilSquare" @click="isEditing = true" />
                    </LTooltipTrigger>
                    <LTooltipContent>
                        Edit name for player "{{ player.display_name }}"
                    </LTooltipContent>
                </LTooltip>
                <LTooltip
                    v-if="game.meta.phase === 'setup' && canEditOrDelete"
                    :id="`delete-player-${player.id}`"
                    :delay="1000"
                >
                    <LTooltipTrigger>
                        <LIconButton icon="Trash" @click="() => deletePlayer.emit({ playerId: player.id })" />
                    </LTooltipTrigger>
                    <LTooltipContent>
                        Delete player &quot;{{ player.display_name }}&quot;
                    </LTooltipContent>
                </LTooltip>
            </div>
        </template>
    </li>
</template>