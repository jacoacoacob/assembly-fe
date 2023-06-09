import { watch } from "vue";
import { useGameStore } from "../stores/game-store";
import { useEntitiesStore } from "../stores/entities-store";
import { setupCanvasListeners } from "./setup-canvas-listeners";
import { isCollision } from "./collision";

function setupCanvas(ctx: CanvasRenderingContext2D) {
    const { canvas } = ctx;

    setupCanvasListeners(canvas);

    canvas.height = 800;
    canvas.width = 800;

    canvas.classList.add("border", "shadow-lg")

    const game = useGameStore();
    const entities = useEntitiesStore();

    function renderCanvas() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const spriteIds = Array.from(entities.spriteIds);

        const didCollide: Record<string, boolean> = spriteIds.reduce(
            (accum, spriteId) => ({
                ...accum,
                [spriteId]: false,
            }), {}
        );

        for (let i = 0; i < spriteIds.length; i++) {
            const sprite = entities.sprites[entities.spriteIds[i]];
            
            if (didCollide[sprite.id]) {
                continue;
            }

            for (let k = 0; k < spriteIds.length; k++) {
                const other = entities.sprites[spriteIds[k]];
                
                if (sprite.id === other.id) {
                    continue;
                }

                if (isCollision(sprite.shape, other.shape)) {
                    didCollide[sprite.id] = true;
                    didCollide[other.id] = true;
                }
            }
        }

        for (let i = 0; i < entities.spriteIds.length; i++) {
            const { shape, fillStyle, strokeStyle, id } = entities.sprites[entities.spriteIds[i]];
            ctx.beginPath();
            ctx.strokeStyle = strokeStyle;
            ctx.fillStyle = didCollide[id] ? "red" : fillStyle;
            if (shape.kind === "circle") {
                ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
            } else {
                ctx.rect(shape.x, shape.y, shape.w, shape.h);
            }
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        }
    }

    watch(() => entities.sprites, () => {
        renderCanvas();
    }, { immediate: true, deep: true });
}

export { setupCanvas };
