<script setup lang="ts">
import { eRef } from "../../composables/use-socket-ref";
import { useSessionStore } from "../../stores/session-store";
import LInput from "../lib/LInput.vue";
import LButton from "../lib/LButton.vue";
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
        <LInput v-model="data" label="Device name" placeholder="Give your device a name">
            <template v-slot:right>
                <LButton type="submit" class="border-none rounded-none px-2 bg-black text-white">
                    <IconCheckmark />
                </LButton>
            </template>
        </LInput>
    </form>
</template>