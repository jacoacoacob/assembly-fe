<script setup lang="ts">
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
        (value) => isEmail(value),
    ],
});

const isBusy = ref(false);

async function requestPasswordReset() {
    if (!isValid(email)) {
        return;
    }
    isBusy.value = true;
    try {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email.value);
        console.log("[requestPasswordReset]", { data, error });
    } catch (error) {
        console.log("[requestPasswordReset] catch error", error);
    } finally {
        isBusy.value = false;
    }
}

</script>

<template>
    <div class="p-8 rounded bg-white border space-y-8 max-w-sm">
        <h1 class="font-bold text-3xl">
            Password troubles?
        </h1>
        <p>
            Enter your email and we'll send you a link for you to create a new password.
        </p>
        <form class="flex flex-col items-end space-y-4" @submit.prevent="requestPasswordReset">
            <LInput
                placeholder="Enter your email"
                :state="email"
                type="email"
            />
            <LButton :isBusy="isBusy" class="button-dense button-shadow w-1/2" type="submit">
                Send Link
            </LButton>
            <RouterLink class="text-sm" to="/login">back to login</RouterLink>
        </form>
    </div>
</template>