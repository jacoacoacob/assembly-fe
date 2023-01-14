import { isGame } from "@/stores/game";
import { remove, load } from "@/storage";

function deleteGame(name: string) {
    const game = load(name);
    if (isGame(game)) {
        remove(name);
    }
}

export { deleteGame };
