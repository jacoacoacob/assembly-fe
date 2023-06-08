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
import { useEmit, useEmitWithAck } from "@/v2/composables/use-emitters";
import ClaimPlayerButton from "@/v2/components/game-page/claim-player-button.vue"
import { computed } from "vue";
import IconPencilSquare from "./icon/IconPencilSquare.vue";
import IconTrash from "./icon/IconTrash.vue";
import LTooltip from "./lib/LTooltip.vue";
import LTooltipTrigger from "./lib/LTooltipTrigger.vue";
import LTooltipContent from "./lib/LTooltipContent.vue";
import IconXCircle from "./icon/IconXCircle.vue";
import LCheckbox from "./lib/LCheckbox.vue";

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

const claimPlayer = useEmit("session:claim_player");
const unclaimPlayer = useEmit("session:unclaim_player");

const isClaimed = computed(
    () => session.claimedPlayerIds.includes(props.player.id)
);

const isClaimedBySelf = computed(
    () => session.clientSession?.playerIds.includes(props.player.id) ?? false
);

const playerController = computed({
    get() {
        return isClaimedBySelf.value;
    },
    set(checked) {
        const { id: playerId } = props.player;
        checked ? claimPlayer({ playerId }) : unclaimPlayer({ playerId });
    }
})

</script>

<template>
    <li class="flex justify-between items-center space-x-2">
        <div class="flex items-center w-full">
            <div class="w-20 px-4 flex justify-center">
                <LCheckbox
                    v-model="playerController"
                    :disabled="isClaimed && !isClaimedBySelf"
                />
            </div>
            <template v-if="isEditing">
                <form @submit.prevent="onUpdatePlayerName" class="flex-1 flex items-center justify-between w-full space-x-2">
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
                                <LIconButton class="p-2" icon="Checkmark" type="submit" />
                            </LTooltipTrigger>
                            <LTooltipContent>
                                Save changes
                            </LTooltipContent>
                        </LTooltip>
                        <LTooltip :id="`discard-changes-${player.id}`">
                            <LTooltipTrigger :is="LIconButton" icon="XCircle" @click="isEditing = false">
                                <LIconButton class="p-2" icon="XCircle" @click="isEditing = false" />
                            </LTooltipTrigger>
                            <LTooltipContent>
                                Discard changes
                            </LTooltipContent>
                        </LTooltip>
                    </div>
                </form>
            </template>
            <template v-else>
                <div>{{ player.display_name }}</div>
            </template>
        </div>
        <div v-if="!isEditing" class="flex justify-end space-x-2">
            <LTooltip
                v-if="canEditOrDelete"
                :id="`edit-player-${player.id}`"
                :delay="1000"
            >
                <LTooltipTrigger>
                    <LIconButton class="p-2" icon="PencilSquare" @click="isEditing = true" />
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
                    <LIconButton class="p-2" icon="Trash" @click="() => deletePlayer.emit({ playerId: player.id })" />
                </LTooltipTrigger>
                <LTooltipContent>
                    Delete player &quot;{{ player.display_name }}&quot;
                </LTooltipContent>
            </LTooltip>
        </div>
    </li>
</template>