<script setup lang="ts">
import { eRef } from '@/v2/composables/use-socket-ref';
import GInput from '../lib/GInput.vue';
import GButton from '../lib/GButton.vue';
import IconCheckmarkVue from '../icon/IconCheckmark.vue';

const { data, emitWithAck } = eRef({
    event: "game:add_player",
    initialValue: {
        name: "",
        assignToSender: true,
    },
});

async function onSubmit() {
    try {
        const { success, message } = await emitWithAck();
        if (!success) {
            alert(message);
        } else {
            data.value.name = "";
        }
    } catch (error) {
        console.error(error);
    }
}

</script>

<template>
    <form @submit.prevent="onSubmit">
        <GInput v-model="data.name" label="Add a player">
            <template v-slot:right>
                <GButton type="submit" class="border-none rounded-none px-2 bg-black text-white">
                    <IconCheckmarkVue />
                </GButton>
            </template>
        </GInput>
    </form>
</template>