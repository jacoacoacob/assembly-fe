<script setup lang="ts">
import SetClientDisplayName from "./set-client-display-name.vue";
import AddPlayer from "./add-player.vue";
import PlayersList from "./players-list.vue";
import InviteLinks from "./invite-links.vue";

</script>

<template>
    <div class="space-y-6 flex flex-col">
        <p>
            Welcome to the setup phase. This is the time to
            for players to join.
        </p>
        <InviteLinks />
        <SetClientDisplayName />
        <AddPlayer />
        <PlayersList />
    </div>
</template>