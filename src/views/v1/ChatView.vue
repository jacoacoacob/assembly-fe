<script setup lang="ts">
import { ref, onMounted } from 'vue';

// import { socket, authenticatedSocket } from '@/socket';
import AppInput from '@/components/AppInput.vue';

const API = import.meta.env.VITE_API;

async function login() {
    const username = "captain";
    const password = "yarrr";
    const url = `/api/login?username=${username}&password=${password}`;
    await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
    });
}

async function logout() {
    await fetch("/api/logout", { method: "POST" });
}

function connect() {
    // socket.connect();

    // socket.on("hello", (name: string) => {
    //     console.log("[authenticatedSocket] hello", name);
    // })
}

async function ping() {
    const response = await fetch("/api/ping");
    const json = await response.json();
    console.log(json)
}

onMounted(async () => {
    const res = await fetch("/api");
    const json = await res.json();
    console.log(json)
});

</script>

<template>
    <div class="space-y-2">
        <button class="button button-shadow" @click="login">
            Login
        </button>
        <button class="button button-shadow" @click="logout">
            Logout
        </button>
        <button class="button button-shadow" @click="connect">
            Connect
        </button>
        <button class="button button-shadow" @click="ping">
            Ping
        </button>
        <AppInput />
    </div>
</template>