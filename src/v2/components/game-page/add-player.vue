<script setup lang="ts">
import LInput from '../lib/LInput.vue';
import LButton from '../lib/LButton.vue';
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
        <LInput v-model="playerName" label="Add a player" :errors="playerNameErrors">
            <template v-slot:right>
                <LButton type="submit" class="border-none rounded-none px-2 bg-black text-white">
                    <IconCheckmarkVue />
                </LButton>
            </template>
        </LInput>
    </form>
    {{ addPlayer.message }}
</template>