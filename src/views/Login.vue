<script setup lang="ts">
import { RouterLink } from 'vue-router';
import LInput from '@/components/lib/LInput.vue';
import LButton from '@/components/lib/LButton.vue';
import { useInputState, isValid } from '@/composables/use-input-state';
import { supabase } from '@/supabase';
import { isEmail } from '@/utils/validators';
import { ref } from 'vue';

const email = useInputState({
    value: "",
    isRequired: true,
    validatedOnBlur: true,
    validators: [
        isEmail
    ]
});

const password = useInputState({
    value: "",
    isRequired: true,
});

const isLoading = ref(false);

async function login() {
    if (!isValid(email, password)) {
        return;
    }
    try {
        isLoading.value = true;
        const { data, error } = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value,
        });
        console.log("[login]", { data, error });
    } catch (error) {
        console.log("[login] catch error", error);
    } finally {
        isLoading.value = false
    }
}

</script>

<template>
    <div class="p-8 rounded bg-white border space-y-8 w-96">
        <h1 class="font-bold text-3xl">
            Login
        </h1>
        <form
            class="space-y-4 flex flex-col items-end"
            @submit.prevent="login"
        >
            <LInput type="email" placeholder="Enter your email" :state="email" />
            <LInput type="password" placeholder="Enter your password" :state="password" />
            <LButton :isBusy="isLoading" class="button-dense button-shadow w-1/2" type="submit">
                Login
            </LButton>
            <RouterLink class="text-sm block" to="/forgot-password">forgot password</RouterLink>
        </form>
    </div>
</template>