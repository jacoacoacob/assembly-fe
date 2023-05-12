<script setup lang="ts">
import { useRouter } from "vue-router";

import { fetchCreateGame } from "@/v2/api/fetchers.js";
import type { CreateGameResponse } from "@/v2/api/types";

const router = useRouter();

async function createGame() {
    const response = await fetchCreateGame();
    const data = await response.json() as CreateGameResponse;
    router.push(`/${data.ownerLink.id}`);
}

</script>

<template>
    <div class="space-y-8">
        <button class="button button-shadow block" @click="createGame">
            Create Game
        </button>
    </div>
</template>