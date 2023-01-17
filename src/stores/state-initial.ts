import { stateMachine } from "./state-machine";
import type { Event } from "./events";
import type { SetState, State } from "./state-machine";
import type { Player } from "./game-data";

type InitialStateEvent = Event<"create_game", { players: Player[], name: string; }>;

// type 

export {};