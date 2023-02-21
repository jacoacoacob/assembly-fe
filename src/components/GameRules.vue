<script setup lang="ts">
import { computed, inject, type StyleValue } from 'vue';

import { useGameStateStore } from '@/stores-v2/game-state.store';
import GameRulesSection from './GameRulesSection.vue';

const gameState = useGameStateStore();

const boardStyle = inject<{ board: StyleValue, tile: StyleValue }>("boardStyle");

const className = computed(() => ({
    "border-2": gameState.currentState === "place_tokens",
}));
</script>

<template>
    <div
        class="border-2 border-slate-500 box-content"
        :class="className"
        :style="boardStyle?.board"
    >
        <div class="p-2 h-full flex space-x-4">
            <section class="space-y-4">
                <h1 class="font-bold text-slate-700">
                    Contents
                </h1>
                <nav class="flex flex-col space-y-3 w-32 font-semibold text-sm">
                    <a href="#introduction">Introduction</a>
                    <a href="#the-pieces">The Pieces</a>
                    <a href="#setup">Setup</a>
                    <a href="#gameplay">Gameplay</a>
                </nav>
            </section>
            <section class="flex flex-col space-y-6 overflow-auto px-4 flex-1">
                <h1 class="font-bold flex flex-col self-center">
                    <span class="text-3xl text-center">Assemblage</span>
                    <span class="text-xl text-center text-slate-700">a game of mutual survival</span>
                </h1>

                <GameRulesSection heading="Introduction">
                    <p>
                        In this game, as in the rest of life, survival isn't a winner take all
                        brawl but a constant negotiation in relationship with others.
                    </p>
                    <p>
                        Your goal is to get all of your tokens onto the board. Earning points
                        is key to success but be careful that your pursuit of points doesn't 
                        knock any other player out of the game. If this happens, it's game over
                        and everyone loses!
                    </p>
                </GameRulesSection>

                <GameRulesSection heading="The Pieces">
                    <p>
                        Each player controls 16 <span class="font-semibold">tokens</span>. Each
                        token displays a number in its center. This is its 
                        <span class="font-semibold">token value</span>.
                    </p>
                    <p>
                        Throughout the game, players will move their tokens between their 
                        <span class="font-semibold">token reserve</span> (off of the board) and 
                        the <span class="font-semibold">tiles</span> (on the board). Each tile 
                        displays a number in its center. This is its 
                        <span class="font-semibold">tile capacity</span>.
                    </p>
                    <p>
                        Gameplay is broken into rounds during which each player must take at least one
                        <span class="font-semibold">action</span>. 
                        
                        With one exception, each action will
                        either 
                    </p>
                    <p>
                        Gameplay is broken into rounds during which each player each player must
                        take at least one <span class="font-semibold">action</span>. An action
                        involves moving a token from one tile to another (<span class="italic">move token</span>),
                        moving a token from the token reserve and placing it on a tile
                        (<span class="italic">place token</span>), or removing a token from a tile
                        and putting it back into the token reserve (<span class="italic">remove token</span>).
                        When a player 
                    </p>
                </GameRulesSection>

                <GameRulesSection heading="Setup">
                    <p>
                        During setup, 6 tokens are randomly selected from each players' token reserve
                        to be placed onto the board.

                        Players take turns placing these tokens one at a time onto open tiles. 
                        
                        When they are finished, the game moves into normal 
                        <span class="font-semibold">gameplay</span>.
                    </p>
                </GameRulesSection>

                <GameRulesSection heading="Gameplay">
                    <p>
                        ...
                    </p>
                </GameRulesSection>


                <!-- <GameRulesSection heading="Materials">
                    The 
                </GameRulesSection>

                <GameRulesSection heading="Setup">
                    <p>
                        The setup phase begins with 6 tiles
                    </p>
                </GameRulesSection> -->

                <!-- <GameRulesSection heading="Points">
                    <p>
                        Each round, players 
                    </p>
                </GameRulesSection>
                 -->
                <!-- <div id="introduction" class="space-y-2">
                    <h2 class="font-semibold text-lg">  
                        Introduction
                    </h2>
                    <p>
                        In this game, as in the rest of life, survival isn't a winner-take-all brawl
                        but a constant negotiation in relationship with others.
                    </p>
        
                    <p>
                        Each player's goal is to be to move all of their tokens onto the board
                        while taking care to not eliminate other players. A player is eliminated if
                        all of their tokens are removed from the board. When this happens 
                    </p>
                    <p>
                        The primary objective for each player is to earn points so that they are able
                        to move their tokens onto the board. Points can be earned 
                        
                        to get all of their tokens onto the
                        board while ensuring that other players aren't eliminated.
                        If one or more players finish three consecutive rounds with all of their tokens 
                        on the board, the game is over and all players with any tokens on the board win.
                        If all of a players tokens leave the board, that player is eliminated from the 
                        game. If all players but one are eliminated, the game is over and everyone loses.
                    </p>
                </div> -->

                <!-- <div id="the-tokens" class="space-y-2">
                    <h2 class="font-semibold text-lg">
                        The Tokens
                    </h2>
                    <p>
                        Each player has 20 tokens. Each token has number displayed in its center. This is
                        its <span class="font-bold text-slate-700">value</span>.
                    </p>
                </div> -->

                <!-- <div id="the-board" class="space-y-2">
                    <h2 class="font-semibold text-lg">
                        The Board
                    </h2>
                    <p>
                        The board is made up of a 6x9 grid of tiles. Each tile has a number displayed in
                        the center. This is its <span class="font-bold text-slate-700">capacity</span>.
                        The sum of all token values in a tile must be less than or equal to the tile's 
                        capacity and each tile can hold a maximum of 4 tokens.
                    </p>
                </div>

                <div id="setup" class="space-y-2">
                    <h2 class="font-semibold text-lg">
                        Setup
                    </h2>
                    <p>
                        During the setup phase. Each player takes turns place 6 tokens, randomly selected 
                        from their pool of 20 tokens, one at a time onto the board.
                    </p>
                    <p>
                        When all of the initially selected tokens are on the board, the tiles are scored
                        and gameplay begins.
                    </p>
                </div>

                <div id="gameplay" class="space-y-2">
                    <h2 class="font-semibold text-lg">
                        Gameplay
                    </h2>
                    <p>
                        Gameplay unfolds in rounds where each player takes a turn.
                    </p>
                    <p>
                        At the end of each round, the scores for each player are calculated and added
                        to th
                    </p>
                    <p>
                        
                        During their turn, a
                        player must take at least one action.
                    </p>
                    <p>
                        During gameplay, each player works to manuveur their tokens on the board in
                        such a way as to earn them points at the end of the round.
                    </p>

                    <p>
                    </p>
                    <p>
                        Gameplay unfolds over rounds during which each player must take at least 1
                        action. At the end of each round, tile scores are calculated and added to 
                        each players running point total.
                    </p>
                    <p>
                        The actions a player might take during their turn are
                    </p>
                    <ul class="list-disc pl-4 space-y-2">
                        <li>
                            <span class="p-1 bg-slate-200 rounded font-semibold text-sm">
                                place token
                            </span>: Move a token from your token reserve onto the board. This action
                            costs the token's value in points.
                        </li>
                        <li>
                            <span class="p-1 bg-slate-200 rounded font-semibold text-sm">
                                move token
                            </span>: Move a token from one tile on the board to another tile. This
                            action costs the token's value in points divided by 2 
                        </li>
                        <li>
                            <span class="p-1 bg-slate-200 rounded font-semibold text-sm">
                                remove token
                            </span>
                        </li>
                        
                    </ul>
                </div>

                
                <div id="end-of-round-scoring" class="space-y-2">
                    <h2 class="font-semibold text-lg">
                        End-of-round Scoring
                    </h2>
                    <p>
                        Each player has a running point total whose value might fluctuate between
                        negative and positive numbers. If a player's points remain below zero for too
                        long, they will be knocked out
                    </p>
                </div> -->
            </section> 
        </div>
    </div>
</template>