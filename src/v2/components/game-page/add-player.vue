<script setup lang="ts">
import GInput from '../lib/GInput.vue';
import GButton from '../lib/GButton.vue';
import IconCheckmarkVue from '../icon/IconCheckmark.vue';
import { useValidatedRef } from "@/v2/composables/use-validated-ref";
import { maxLen } from '@/v2/composables/use-validation';
import { noSpaces } from '@/v2/composables/use-validation';
import { useEmitWithAck } from '@/v2/composables/use-emitters';

const [playerName, playerNameErrors] = useValidatedRef({
    value: "",
    validators: [maxLen(16), noSpaces]
});

const addPlayer = useEmitWithAck("game:add_player");

function onSubmit() {
    addPlayer.emit({
        name: playerName.value,
        assignToSender: true
    });
}

</script>

<template>
    <form @submit.prevent="onSubmit">
        <GInput v-model="playerName" label="Add a player" :errors="playerNameErrors">
            <template v-slot:right>
                <GButton type="submit" class="border-none rounded-none px-2 bg-black text-white">
                    <IconCheckmarkVue />
                </GButton>
            </template>
        </GInput>
    </form>
    {{ addPlayer.message }}
</template>