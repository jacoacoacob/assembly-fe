<script setup lang="ts">
import GLSetPhase from "../components/GLSetPhase.vue";
import AddPlayer from "../components/game-page/add-player.vue";
import InviteLinks from "../components/game-page/invite-links.vue";
import GLPlayersList from "../components/GLPlayersList.vue";
import SetClientDisplayName from "../components/game-page/set-client-display-name.vue";
import { useGameStore } from "../stores/game-store";
import { useSessionStore } from "../stores/session-store";

const game = useGameStore();
const session = useSessionStore();

</script>

<template>
    <div class="space-y-8 flex flex-col">
        <SetClientDisplayName />
        <GLSetPhase />
        <AddPlayer v-if="game.meta.phase === 'setup'" />
        <GLPlayersList />
        <InviteLinks v-if="session.isOwner" />
    </div>
</template>