<script setup lang="ts">
import { eRef } from "../../composables/use-socket-ref";
import { useSessionStore } from "../../stores/session-store";
import GInput from "../lib/GInput.vue";
import GButton from "../lib/GButton.vue";
import IconCheckmark from "../icon/IconCheckmark.vue";

const session = useSessionStore();

const { data, emit } = eRef({
    event: "session:set_client_display_name",
    initialValue: "",
    watch: {
        source: () => session.clientSession?.clientDisplayName ?? "",
        immediate: true,
    },
});
</script>

<template>
    <form @submit.prevent="emit">
        <GInput v-model="data" label="Name client">
            <template v-slot:input-right>
                <GButton type="submit" class="border-none rounded-none px-2 bg-black text-white">
                    <IconCheckmark />
                </GButton>
            </template>
        </GInput>
    </form>
</template>