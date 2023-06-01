<script setup lang="ts">
import { computed } from "vue";

import GButton from "../lib/GButton.vue";
import type { GamePlayer } from "@/v2/stores/game-store";
import { useSessionStore } from "@/v2/stores/session-store";
import { useEmit } from "@/v2/composables/use-emitters";

const props = defineProps<{
    playerId: GamePlayer["id"];
}>();

const session = useSessionStore();

const isClaimed = computed(
    () => session.claimedPlayerIds.includes(props.playerId)
);

const isClaimedBySelf = computed(
    () => session.clientSession?.playerIds.includes(props.playerId) ?? false
);

const claimPlayer = useEmit("session:claim_player");
const unclaimPlayer = useEmit("session:unclaim_player");

function onClick() {
    const { playerId } = props;
    if (isClaimedBySelf.value) {
        unclaimPlayer({ playerId });
    } else if (isClaimed.value) {
        console.log(playerId + " already claimed");
    } else {
        claimPlayer({ playerId });
    }
}

</script>

<template>
    <GButton @click="onClick">
        <template v-if="isClaimedBySelf">
            unclaim
        </template>
        <template v-else-if="isClaimed">
            is claimed
        </template>
        <template v-else>
            claim
        </template>
    </GButton>
</template>