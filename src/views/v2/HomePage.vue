<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useSessionStore } from "@/stores-v2/session.store";

const session = useSessionStore();

async function createGame() {
/*
    if logged in:
        create game
    else:
        create account
*/    
}

</script>

<template>
    <div class="space-y-8">
        <button class="button button-shadow block" @click="createGame">
            Create Game
        </button>
        <template v-if="!session.isLoggedIn">
            <RouterLink to="/login" class="block">
                Login 
            </RouterLink>
            <RouterLink to="/register">
                Create account
            </RouterLink>
        </template>
    </div>
</template>