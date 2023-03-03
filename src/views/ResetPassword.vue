<script setup lang="ts">
import LInput from '@/components/lib/LInput.vue';
import { useInputState, isValid } from '@/composables/use-input-state';
import { supabase } from '@/supabase';
import { isEmail } from '@/utils/validators';

const pw = useInputState({
    value: "",
    isRequired: true,
    validatedOnBlur: true,
});

const pwVerify = useInputState({
    value: "",
    isRequired: true,
    validatedOnBlur: true,
    validators: [
        (value) => value !== pw.value ? "Passwords must match." : undefined,
    ],
})

async function resetPassword() {
    if (!isValid(pw, pwVerify)) {
        return;
    }
    try {
        const { data, error } = await supabase.auth.updateUser({ password: pw.value });
        console.log("[resetPassword]", { data, error });
    } catch (error) {
        console.log("[resetPassword] catch error", error);
    }
}

</script>

<template>
    <div class="p-8 rounded bg-white border space-y-8 max-w-sm">
        <h1 class="font-bold text-3xl">
            Create new password
        </h1>
        <form class="flex flex-col items-end space-y-4" @submit.prevent="resetPassword">
            <LInput
                placeholder="Enter your new password"
                :state="pw"
                type="password"
            />
            <LInput
                placeholder="Type it again"
                :state="pwVerify"
                type="password"
            />
            <button class="button button-dense button-shadow w-1/2" type="submit">
                Set Password
            </button>
            <RouterLink class="text-sm" to="/login">back to login</RouterLink>
        </form>
    </div>
</template>