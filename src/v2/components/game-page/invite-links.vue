<script setup lang="ts">
import { computed, ref } from "vue";

import { useGameStore } from "@/v2/stores/game-store";
import { useSessionStore } from "@/v2/stores/session-store";
import LIconButton from "../lib/LIconButton.vue";

const game = useGameStore();
const session = useSessionStore();

const gameLinks = computed(() => {
    if (session.isOwner) {
        return game.links.map((link) => ({
            url: `${location.origin}/${link.id}`,
            role: link.role,
            description: link.role === "guest"
                ? `Share this link to invite anyone to join this game.`
                : `Anyone with access to this link will have admin privileges with this game.`
        }));
    }
    return [];
});

const successfulCopy = ref<string | null>(null);

async function copyToClipboard(url: string) {
    try {
        await navigator.clipboard.writeText(url);
        successfulCopy.value = url;
        setTimeout(() => {
            successfulCopy.value = null;
        }, 2000);
    } catch (error) {
        console.warn(error);   
    }
}

</script>

<template>
    <ul class="space-y-4">
        <li v-for="link in gameLinks" class="bg-slate-100 rounded p-4 space-y-2">
            <div>
                <h3 class="p-1 bg-slate-300 inline rounded font-bold">{{ link.role }}</h3>
                <p>{{ link.description }}</p>
            </div>
            <div class="flex items-center space-x-2">
                <p class="">{{ link.url }}</p>
                <LIconButton
                    :icon="successfulCopy === link.url ? 'Checkmark' : 'ClipboardDocument'"
                    @click="() => copyToClipboard(link.url)"
                />
            </div>
        </li>
    </ul>
</template>