<script setup lang="ts">
import { eRef } from "@/v2/composables/use-socket-ref";
import GInput from "../lib/GInput.vue";
import { useGameStore, type GamePlayer } from "@/v2/stores/game-store";
import { useSessionStore } from "@/v2/stores/session-store";
import { watch } from "vue";
import { ref } from "vue";
import GButton from "../lib/GButton.vue";
import IconCheckmark from "../icon/IconCheckmark.vue";

const props = defineProps<{
    data: GamePlayer;
}>();

const session = useSessionStore();
const game = useGameStore();

const isEditing = ref(false);

const { data: updatePlayer, emitWithAck } = eRef({
    event: "game:update_player_name",
    initialValue: {
        playerId: props.data.id,
        name: "",
    }
})

watch(
    () => props.data.display_name,
    (currentDisplayName) => {
        updatePlayer.value.name = currentDisplayName;
    },
    { immediate: true }
);

async function onSubmit() {
    try {
        const { success, message } = await emitWithAck();
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
                <GInput v-model="updatePlayer.name">
                    <template v-slot:input-right>
                        <GButton type="submit" class="border-none rounded-none px-2 bg-black text-white">
                            <IconCheckmark />
                        </GButton>
                    </template>
                </GInput>
            </form>
            <button class="px-2 bg-gray-200" @click="isEditing = false">
                cancel
            </button>
        </template>
        <template v-else>
            <span class="font-semibold">
                {{ data.display_name }}
            </span>
            <div v-if="session.isOwner" class="flex space-x-2">
                <button class="px-2 bg-gray-200" @click="isEditing = true">
                    edit
                </button>
                <button class="px-2 bg-gray-200" @click="() => game.removePlayer(data.id)">
                    delete
                </button>
            </div>
        </template>
    </li>
</template>