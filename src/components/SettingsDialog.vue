<script setup lang="ts">
import { Dialog, DialogTitle, DialogDescription, DialogPanel } from '@headlessui/vue';

import { useSettingsStore } from '@/stores-v2/settings.store';

const settings = useSettingsStore();

</script>

<template>
    <Dialog class="absolute top-0 z-10 w-full h-full flex justify-center items-center">
        <DialogPanel class="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
            <DialogTitle>Settings</DialogTitle>
            <DialogDescription>
                Turn some knobs and flick some switches :)
            </DialogDescription>
        </DialogPanel>
    </Dialog>
</template>
