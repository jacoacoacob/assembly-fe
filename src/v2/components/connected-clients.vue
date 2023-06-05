<script setup lang="ts">
import { useSessionStore } from '../stores/session-store';
import GTooltip from './lib/GTooltip.vue';
import GTooltipTrigger from './lib/GTooltipTrigger.vue';
import GTooltipContent from './lib/GTooltipContent.vue';

const session = useSessionStore();

</script>

<template>
    <ul class="flex space-x-2 p-2 justify-end">
        <li v-for="(sess, i) in session.allSessions" :key="sess.clientId">
            <GTooltip :id="`user-${i}`">
                <GTooltipTrigger
                    class="
                        cursor-default border border-slate-300
                        rounded-full bg-slate-200 px-2 py-2 
                        font-mono font-bold text-center text-sm 
                        min-w-[36px]
                    "
                >
                    {{ sess.clientDisplayName.slice(0, 2) || "?" }}
                </GTooltipTrigger>
                <GTooltipContent class="right-0">
                    {{ sess.clientDisplayName || "no name" }}
                </GTooltipContent>
            </GTooltip>
        </li>
    </ul>
</template>