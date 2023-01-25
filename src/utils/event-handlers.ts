import type { EventHandlers, EventDomain, Event, EventHandler } from "@/stores-v2/events.types";

function eventHandlers<Domain extends EventDomain, E extends Event<Domain, string>>(handlers: EventHandlers<Domain, E>) {
    return {
        handleEvent(event: E) {
            const handler = handlers[event.name as E["name"]] as unknown as EventHandler<Domain, E>;
            if (handler) {
                return handler(event.data);
            }
            console.warn("No handler registerred for event:", event);
        }
    }
}

export { eventHandlers };
