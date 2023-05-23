<script setup lang="ts">
import SetClientDisplayName from "./set-client-display-name.vue";
import AddPlayer from "./add-player.vue";
import { useGameStore } from "@/v2/stores/game-store";

const game = useGameStore();

</script>

<template>
    <div class="space-y-6 flex flex-col">
        <p>
            Welcome to the setup phase. This is the time to
            for players to join.
        </p>
        <SetClientDisplayName />
        <AddPlayer />
        <ul class="space-y-2">
            <li v-for="player in game.players">
                {{ player.display_name }}
                <button
                    class="px-2 bg-gray-200"
                    @click="() => game.removePlayer(player.id)">
                    delete
                </button>
            </li>
        </ul>
    </div>
</template>