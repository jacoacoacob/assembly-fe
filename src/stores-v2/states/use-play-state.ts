import { sumDict } from "@/utils/sum";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useEventsStore } from "../events.store";
import { useGameDataStore } from "../game-data.store";
import { usePlayersStore } from "../players.store";
import { useScoresStore } from "../scores.store";
import { useTilesStore } from "../tiles.store";
import { useTokensStore } from "../tokens.store";
import { useScoring } from "../composables/use-scoring";
import { usePlayerActionsStore, type PlayerAction } from "../player-actions.store";
import { useMoveTokenStore } from "../move-token.store";


const usePlayState = defineStore("play-state", () => {
    const gameData = useGameDataStore();
    const events = useEventsStore();
    const tokens = useTokensStore();
    const tiles = useTilesStore();
    const scores = useScoresStore();
    const players = usePlayersStore();
    const actions = usePlayerActionsStore();
    
    const scoring = useScoring();
    const moveToken = useMoveTokenStore();

    const selectedAction = ref<PlayerAction | null>(null);

    const availableActions = computed(
        (): PlayerAction[] => [
            actions.canPlaceToken && "place_token",
            actions.canMoveToken && "move_token",
            actions.canRemoveToken && "remove",
        ].filter(Boolean) as PlayerAction[]
    );

    const isLastTurnInRound = computed(
        () => players.activePlayerIndex === gameData.players.length - 1
    );

    function endRound() {
        events.send("scores:set_points", sumDict(scores.points, scoring.calculatePoints()));
    }

    function endTurn() {
        if (isLastTurnInRound.value) {
            endRound();
        }
        events.send("players:next");
        players.viewActivePlayer();
        moveToken.commit();
    }

    function startMove(tokenId: string) {
        moveToken.pickup(tokenId);
        // switch (selectedAction.value) {
        //     case "move_token":
        //     case "place_token": 
        //     case "remove_token": move.pickupToken(tokenId);
        // }
        // if (tokenId !== tokens.candidateTokenId) {
        //     events.send("tokens:set_candidate_token_id", tokenId);
        // }
    }

    function endMove(tokenId: string, tileIndex: number) {
        if (selectedAction.value === "place_token") {
            moveToken.drop(tileIndex);
            // const droppedToken = 
        }
        // switch (selectedAction.value) {
        //     case "move_token": return;
        //     case "place_token": actions.placeToken.dropToken(tileIndex);
        //     case "remove_token": return;
        // }
        // const token = gameData.tokens[tokenId];
        // if (token.tileIndex === -1 && token.tileIndex === tileIndex) {
        //     events.send("tokens:set_candidate_token_id", "");
        // }
        // if (token.tileIndex !== tileIndex) {
        //     events.send("tokens:move_token", { tokenId, tileIndex });
        //     if (tileIndex === -1) {
        //         events.send("tokens:set_candidate_token_id", "");
        //     }
        // }
        // tokens.draggedTokenId = "";
    }

    return { startMove, endMove, endRound, endTurn, availableActions };
});

export { usePlayState };
