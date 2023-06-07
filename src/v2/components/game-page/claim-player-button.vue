<script setup lang="ts">
import { computed } from "vue";

import type { GamePlayer } from "@/v2/stores/game-store";
import { useSessionStore } from "@/v2/stores/session-store";
import { useEmit } from "@/v2/composables/use-emitters";
import LIconButton from "../lib/LIconButton.vue";
import LTooltip from "../lib/LTooltip.vue";
import LTooltipContent from "../lib/LTooltipContent.vue";
import LTooltipTrigger from "../lib/LTooltipTrigger.vue";

const props = defineProps<{
    player: GamePlayer;
}>();

const session = useSessionStore();

const isClaimed = computed(
    () => session.claimedPlayerIds.includes(props.player.id)
);

const isClaimedBySelf = computed(
    () => session.clientSession?.playerIds.includes(props.player.id) ?? false
);

const claimPlayer = useEmit("session:claim_player");
const unclaimPlayer = useEmit("session:unclaim_player");

function onClick() {
    const { player: { id: playerId } } = props;
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
    <LTooltip v-if="isClaimedBySelf" :id="`unclaim-player-${player.id}`" :delay="1000">
        <LTooltipTrigger>
            <LIconButton icon="UserMinus" @click="onClick" />
        </LTooltipTrigger>
        <LTooltipContent>
            Unclaim player "{{ player.display_name }}"
        </LTooltipContent>
    </LTooltip>
    <LTooltip v-else-if="isClaimed" :id="`claim-player-${player.id}`" :delay="1000">
        <LTooltipTrigger>
            <LIconButton disabled icon="UserPlus" @click="onClick" />
        </LTooltipTrigger>
        <LTooltipContent>
            Player "{{ player.display_name }}" has been claimed
        </LTooltipContent>
    </LTooltip>
    <LTooltip v-else :id="`claim-player-${player.id}`" :delay="1000">
        <LTooltipTrigger>
            <LIconButton icon="UserPlus" @click="onClick" />
        </LTooltipTrigger>
        <LTooltipContent>
            Claim player "{{ player.display_name }}"
        </LTooltipContent>
    </LTooltip>
</template>