import type { Components } from "./component";

interface Entity<
    EntityKind extends string,
    EntityComponent extends Components
> {
    kind: EntityKind;
    id: string;
    components: {
        [C in EntityComponent as C["kind"]]: C["value"];
    };
}


function createEntity<
    EntityKind extends string,
    EntityComponent extends Components
>(
    kind: EntityKind,
    id: string,
    components: EntityComponent[]
): Entity<EntityKind, EntityComponent> {
    return {
        kind,
        id,
        components: components.reduce(
            (
                accum: Entity<EntityKind, EntityComponent>["components"],
                component
            ) => {
                (accum as any)[component.kind] = component.value;
                return accum;
            },
            {} as Entity<EntityKind, EntityComponent>["components"]),
    }
}


// function createSprite(id: string) {
//     return createEntity("sprite", id, [
//         component.dimension(),
//         component.position(),
//         component.veloctiy(),
//     ]);
// }

// type Sprite = ReturnType<typeof createSprite>;


export { createEntity };
export type { Entity };
