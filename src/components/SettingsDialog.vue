<script setup lang="ts">
import {
    Dialog,
    DialogTitle,
    DialogDescription,
    DialogPanel,
    RadioGroup,
    RadioGroupOption,
    Disclosure,
    DisclosureButton,
    DisclosurePanel,
} from '@headlessui/vue';

import { useSettingsStore } from '@/stores-v2/settings.store';
import AppInput from './AppInput.vue';

const settings = useSettingsStore();

</script>

<template>
    <Dialog class="absolute top-0 z-10 w-full h-full flex justify-center items-center">
        <DialogPanel class="w-full max-w-md transform overflow-auto max-h-[80%] border rounded bg-white p-4 text-left align-middle shadow-xl transition-all space-y-4">
            <button class="absolute right-4 top-4 button button-dense" @click="$emit('close')">
                close
            </button>
            <DialogTitle class="font-bold text-xl my-0 py-0">Settings</DialogTitle>
            <DialogDescription>
                Turn some knobs and flick some switches :)
            </DialogDescription>
            <div class="space-y-8">
                <section class="space-y-4 flex flex-col">
                    <h3 class="font-semibold text-lg">
                        Season Modifiers
                    </h3>
                    <p>Adjust the amounts that seasons modify tile capacity values.</p>
                    <AppInput
                        label="warm season (green)"
                        type="number"
                        v-model.number="settings.seasonalTileCapacityModifiers.warm"
                    />
                    <AppInput
                        label="mild season (orange)"
                        type="number"
                        v-model.number="settings.seasonalTileCapacityModifiers.mild"
                    />
                    <AppInput
                        label="cold season (blue)"
                        type="number"
                        v-model.number="settings.seasonalTileCapacityModifiers.cold"
                    />
                </section>
                <section class="space-y-4 flex flex-col">
                    <h3 class="font-semibold text-lg">
                        Tile Degradation
                    </h3>
                    <div class="text-sm">
                        <Disclosure v-slot="{ open }: { open: boolean }">
                            <DisclosureButton
                                class="button button-dense button-text"
                                :class="`bg-slate-${open ? '200' : '100'}`"
                            >
                                What is this?
                            </DisclosureButton>
                            <DisclosurePanel class=" text-slate-600 space-y-2 bg-slate-100 p-2">
                                <p>
                                    For each round-completion that a tile contains tokens belonging to only 1 player,
                                    that tile will degrade &dash; its capacity will decrease by the
                                    "<span class="font-semibold">degradation rate</span>".
                                </p>
                                <p>
                                    A degrading tile will begin recovering starting the first round-completion that 
                                    it is either empty or contains tokens belonging to 2 or more players &dash; its 
                                    capacity will increase by the "<span class="font-semibold">recovery rate</span>".
                                    This will continue each round-completion until that tile's capacity reaches its 
                                    original value.
                                </p>
                            </DisclosurePanel>
                        </Disclosure>
                    </div>
                    <p>Adjust the rates at which tile capacities degrade and recover.</p>
                    <AppInput
                        label="degration rate"
                        type="number"
                        v-model.number="settings.degradationRate"
                    />
                    <AppInput
                        label="recovery rate"
                        type="number"
                        v-model.number="settings.recoveryRate"
                    />
                </section>
                <section class="space-y-4 flex flex-col">
                    <h3 class="font-semibold text-lg">
                        Player Order
                    </h3>
                    <p>
                        Choose how player turn order changes (or doesn't) each round.
                    </p>
                    <RadioGroup v-model="settings.playerSortMethod" class="space-y-1">
                        <RadioGroupOption v-slot="{ checked }: { checked: boolean }" value="rotate">
                            <div
                                class="rounded p-2 border cursor-pointer"
                                :class="{ 'bg-slate-800 text-white': checked }"
                            >
                                <h4 class="font-semibold">Rotate</h4>
                                <p class="text-sm" :class="`text-slate-${checked ? '400' : '600'}`">
                                    player order shifts one position, from back to front, during each
                                    round-completion.
                                </p>
                            </div>                                
                        </RadioGroupOption>
                        <RadioGroupOption v-slot="{ checked }: { checked: boolean }" value="shuffle">
                            <div
                                class="rounded p-2 border cursor-pointer"
                                :class="{ 'bg-slate-800 text-white': checked }"
                            >
                                <h4 class="font-semibold">Random</h4>
                                <p class="text-sm" :class="`text-slate-${checked ? '400' : '600'}`">
                                    player order is shuffled randomly during each round-completion.
                                </p>
                            </div>                            
                        </RadioGroupOption>
                        <RadioGroupOption v-slot="{ checked }: { checked: boolean }" value="static">
                            <div
                                class="rounded p-2 border cursor-pointer"
                                :class="{ 'bg-slate-800 text-white': checked }"
                            >
                                <h4 class="font-semibold">Static</h4>
                                <p class="text-sm" :class="`text-slate-${checked ? '400' : '600'}`">
                                    player order stays the same from round to round.
                                </p>
                            </div>                            
                        </RadioGroupOption>
                    </RadioGroup>
                </section>
            </div>
        </DialogPanel>
    </Dialog>
</template>
