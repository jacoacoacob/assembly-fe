<script setup lang="ts">
import SetClientDisplayName from "./set-client-display-name.vue";
import AddPlayer from "./add-player.vue";
import { useGameStore } from "@/v2/stores/game-store";
import { useSessionStore } from "@/v2/stores/session-store";
import PlayersList from "./players-list.vue";

const game = useGameStore();
const session = useSessionStore();

</script>

<template>
    <div class="space-y-6 flex flex-col">
        <p>
            Welcome to the setup phase. This is the time to
            for players to join.
        </p>
        <SetClientDisplayName />
        <AddPlayer />
        <PlayersList />
    </div>
</template>