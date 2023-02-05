import { sumDict } from "@/utils/sum";
import { defineStore } from "pinia";
import { computed, ref } from "vue";
import { useEventsStore } from "../events.store";
import { useGameDataStore } from "../game-data.store";
import { usePlayersStore } from "../players.store";
import { useScoresStore } from "../scores.store";
import { useTilesStore } from "../tiles.store";
import { useTokensStore } from "../tokens.store";
import { useScoring } from "../../composables/use-scoring";
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

    const helpMessage = computed(() => {
        if (!selectedAction.value) {
            return "Choose an action.";
        }
        if (selectedAction.value === "move_token") {
            return "Move any of your tokens currently on the board.";
        }
        if (selectedAction.value === "place_token") {
            return "Move a token from your reserve onto the board"
        }
        return "";
    })

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
        selectedAction.value = null;
    }

    const isMoveValid = computed(() => {
        if (selectedAction.value === "move_token") {
            
        }
        if (selectedAction.value === "place_token") {

        }
        if (selectedAction.value === "remove_token") {

        }
        return false;
    })


    function pickupToken(tokenId: string) {
        moveToken.pickup(tokenId);
    }

    function dropToken() {
        if (isMoveValid.value) {
            moveToken.drop();
        }
    }



    return { pickupToken, dropToken, endRound, endTurn, availableActions, selectedAction, helpMessage };
});

export { usePlayState };
