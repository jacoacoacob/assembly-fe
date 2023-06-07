<script setup lang="ts">
import IconCheckmark from '../icon/IconCheckmark.vue';
import IconClipboardDocument from '../icon/IconClipboardDocument.vue';
import IconPencilSquare from '../icon/IconPencilSquare.vue';
import IconSpinner from '../icon/IconSpinner.vue';
import IconTrash from '../icon/IconTrash.vue';
import IconUserMinus from '../icon/IconUserMinus.vue';
import IconUserPlus from '../icon/IconUserPlus.vue';
import IconXCircle from '../icon/IconXCircle.vue';

type IconName =
    "Checkmark" |
    "ClipboardDocument" |
    "PencilSquare" |
    "Spinner" |
    "Trash" |
    "UserMinus" |
    "UserPlus" |
    "XCircle";

const icons = {
    IconCheckmark,
    IconClipboardDocument,
    IconPencilSquare,
    IconSpinner,
    IconTrash,
    IconUserMinus,
    IconUserPlus,
    IconXCircle,
};

defineProps<{ icon: IconName }>();
</script>

<template>
    <button class="
        cursor-pointer rounded-full p-2 bg-slate-200
        hover:bg-slate-300
        disabled:opacity-40 disabled:cursor-auto disabled:hover:bg-slate-200
    ">
        <component :is="icons[`Icon${icon}`]"></component>
    </button>
</template>