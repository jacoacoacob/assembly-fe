import { defineStore } from "pinia";

function initialState() {
    return {
        name: "frederik"
    }
}

const useSetupBoardStore = defineStore("setup-board", {
    state: initialState,
    actions: {
        sayHi() {
            this.name === ""
        }
    }
})

export { useSetupBoardStore };
