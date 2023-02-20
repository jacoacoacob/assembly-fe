import { shuffle } from "@/utils/rand";
import { headToTail } from "@/utils/head-to-tail";
import { useSettingsStore } from "@/stores-v2/settings.store";
import { usePlayersStore } from "@/stores-v2/players.store";

function useUpdatePlayerOrder() {
    const settings = useSettingsStore();
    const players = usePlayersStore();

    return () => {
        switch (settings.playerSortMethod) {
            case "rotate": return headToTail(players.playerOrder);
            case "shuffle": return shuffle(players.playerOrder);
            case "static": return players.playerOrder;
        }
    }
}

export { useUpdatePlayerOrder };
