<script setup lang="ts">

import { eRef } from "../../composables/use-socket-ref";

import GInput from "../lib/GInput.vue";
import GButton from "../lib/GButton.vue";
import IconCheckmark from "../icon/IconCheckmark.vue";
import { useSessionStore } from "../../stores/session-store";

const session = useSessionStore();

const { data: clientName, doEmit } = eRef({
    event: "session:set_client_display_name",
    initialValue: "",
    watch: {
        source: () => session.clientSession?.clientDisplayName ?? "",
        immediate: true
    },
});
</script>

<template>
    <div class="space-y-6">
        <p>
            Welcome to the setup phase. This is the time to
            for players to join.
        </p>

        <form @submit.prevent="doEmit" class="bg-cyan-300 p-4">
            <GInput v-model="clientName" label="Name client">
                <template v-slot:input-right>
                    <GButton type="submit" class="border-none rounded-none px-2 bg-black text-white">
                        <IconCheckmark />
                    </GButton>
                </template>
            </GInput>
        </form>
        <p>Add player</p>
    </div>
</template>