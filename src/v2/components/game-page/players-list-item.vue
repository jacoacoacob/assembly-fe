<script setup lang="ts">
import { watch, ref } from "vue";
import { eRef } from "@/v2/composables/use-socket-ref";
import GInput from "../lib/GInput.vue";
import { useGameStore, type GamePlayer } from "@/v2/stores/game-store";
import { useSessionStore } from "@/v2/stores/session-store";
import GButton from "../lib/GButton.vue";
import IconCheckmark from "../icon/IconCheckmark.vue";
import { useValidation, maxLen } from "@/v2/composables/use-validated-ref";
import { emitWithAck } from "@/socket";

const props = defineProps<{
    player: GamePlayer;
}>();

const session = useSessionStore();
const game = useGameStore();

const isEditing = ref(false);

const playerName = useValidation({
    initalValue: "",
    validators: [
        maxLen("player name", 32),
    ],
});

watch(
    () => props.player.display_name,
    (currentDisplayName) => {
        playerName.data = currentDisplayName;
    },
    { immediate: true }
);

async function onSubmit() {
    try {
        const { success, message } = await emitWithAck("game:update_player_name", {
            playerId: props.player.id,
            name: playerName.data,
        })
        if (!success) {
            alert(message);
        } else {
            isEditing.value = false;
        }
    } catch (error) {
        console.error(error);
    }
}

</script>

<template>
    <li class="flex space-x-2 justify-between">
        <template v-if="isEditing">
            <form @submit.prevent="onSubmit">
                <GInput v-model="playerName.data">
                    <template v-slot:right>
                        <GButton type="submit" class="border-none rounded-none px-2 bg-black text-white">
                            <IconCheckmark />
                        </GButton>
                    </template>
                    <template v-slot:below>
                        <div v-if="!playerName.isValid" class="text-sm pl-2 text-red-500">
                            {{ playerName.errors[0] }}
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
            <div v-if="session.isOwner" class="flex space-x-2">
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