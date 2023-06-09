import { watch } from "vue";
import { useGameStore } from "../stores/game-store";
import { useEntitiesStore } from "../stores/entities-store";
import { setupCanvasListeners } from "./setup-canvas-listeners";

function setupCanvas(ctx: CanvasRenderingContext2D) {
    const { canvas } = ctx;

    setupCanvasListeners(canvas);

    canvas.height = 800;
    canvas.width = 800;

    canvas.classList.add("border", "shadow-lg")

    const game = useGameStore();
    const entities = useEntitiesStore();

    watch(() => entities.sprites, (sprites) => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        Object.values(sprites).forEach((sprite) => {
            const { shape, strokeStyle, fillStyle } = sprite;
            ctx.beginPath();
            ctx.strokeStyle = strokeStyle;
            ctx.fillStyle = fillStyle;
            if (shape.kind === "circle") {
                ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
            } else {
                ctx.rect(shape.x, shape.y, shape.w, shape.h);
            }
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
        })
    }, { immediate: true, deep: true });
}

export { setupCanvas };
