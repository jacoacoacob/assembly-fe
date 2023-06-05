<script setup lang="ts">
import AddPlayer from "../components/game-page/add-player.vue";
import InviteLinks from "../components/game-page/invite-links.vue";
import PlayersList from "../components/game-page/players-list.vue";
import SetClientDisplayName from "../components/game-page/set-client-display-name.vue";
import { useGameStore } from "../stores/game-store";
import { useSessionStore } from "../stores/session-store";

const game = useGameStore();
const session = useSessionStore();

</script>

<template>
    <div class="w-full px-4 flex flex-col">
        <div class="flex-1 space-y-8">
            <SetClientDisplayName />
            <AddPlayer v-if="game.meta.phase === 'setup'" />
            <PlayersList />
            <InviteLinks v-if="session.isOwner" />
        </div>
    </div>
</template>