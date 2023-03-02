<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import { supabase } from '@/supabase';
import AppInput from '@/components/AppInput.vue';
import { isAuthError } from '@supabase/gotrue-js';
import type { AuthError, Session, User } from '@supabase/gotrue-js';

import { useInputState, type InputState } from '@/composables/use-input-state';
import { router } from '@/router';

const pwInput = useInputState({
    value: "",
    validatedOnBlur: true,
    isRequired: true,
});
const pwVerifyInput = useInputState({
    value: "",
    validatedOnBlur: true,
    isRequired: true,
    validators: [
        (value) => {
            if (value !== pwInput.value) {
                return "Passwords must match.";
            }
        } 
    ],
});

function reset(inputState: InputState<string | number>) {
    inputState.isDirty = false;
    inputState.errors = [];
}

const setPasswordError = ref<AuthError | null>(null);

async function setPassword() {
    console.log("[setPassword] start");
    if (pwInput.errors.length === 0 && pwVerifyInput.errors.length === 0) {
        console.log("[setPassword] no errors");
        try {
            await supabase.auth.updateUser({ password: pwInput.value });
            router.push({ path: "/" });
        } catch (error) {
            if (isAuthError(error)) {
                setPasswordError.value = error;
            }
        }
    }
}

</script>

<template>
    <div class="p-8 rounded bg-white border space-y-8 max-w-sm">
        <div class="space-y-4">
            <h1 class="font-bold text-3xl">Welcome</h1>
            <p>
                Your email has been verified.
            </p>
        </div>
        <form @submit.prevent="setPassword" >
            <fieldset class="space-y-6 flex flex-col items-end">
                <legend>
                    Create a password for future logins.
                </legend>
                <div class="space-y-2 w-full">
                    <AppInput
                        label="new password"
                        type="password"
                        v-model="pwInput.value"
                        :errors="pwInput.errors"
                        :required="pwInput.isRequired"
                        @blur="pwInput.onBlur"
                        @focus="() => reset(pwInput)"
                    />
                    <AppInput
                        label="type it again"
                        type="password"
                        v-model="pwVerifyInput.value"
                        :errors="pwVerifyInput.errors"
                        :required="pwVerifyInput.isRequired"
                        @blur="pwVerifyInput.onBlur"
                        @focus="() => reset(pwVerifyInput)"
                        autocomplete="off"
                    />
                </div>
                <button class="button button-shadow" type="submit">Submit</button>
            </fieldset>
        </form>
        {{ setPasswordError }}

    </div>
</template>
