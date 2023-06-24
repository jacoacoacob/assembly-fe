// import { watch } from "vue";
// import { useGameStore } from "../stores/game-store";
// import { useEntitiesStore } from "../stores/entities-store.old";
// import { setupCanvasListeners } from "./use-canvas-listeners";
// import { isCollision } from "./collision";
// import { useTileMapsStore } from "../stores/tile-maps-store";
// import { useBoardStore } from "../stores/board-store";

// function setupCanvas(ctx: CanvasRenderingContext2D) {
//     const { canvas } = ctx;

//     const entities = useEntitiesStore();
//     const tileMaps = useTileMapsStore();
//     const board = useBoardStore();

//     // window.addEventListener("keydown", (ev: KeyboardEvent) => {
//     //     if (ev.key === "ArrowLeft") {
//     //         board.tilesCamera.move(1, -1, 0);
//     //     } else if (ev.key === "ArrowDown") {
//     //         board.tilesCamera.move(1, 0, 1);
//     //     } else if (ev.key === "ArrowRight") {
//     //         board.tilesCamera.move(1, 1, 0);
//     //     } else if (ev.key === "ArrowUp") {
//     //         board.tilesCamera.move(1, 0, -1);
//     //     }
//     //     // board.draw(ctx);
//     //     // tileMaps.boardCamera.draw(ctx);
//     // });
    
//     // tileMaps.boardCamera.draw(ctx);



//     function renderCanvas() {
//         ctx.clearRect(0, 0, canvas.width, canvas.height);

//         const spriteIds = Array.from(entities.spriteIds);

//         const didCollide: Record<string, boolean> = spriteIds.reduce(
//             (accum, spriteId) => ({
//                 ...accum,
//                 [spriteId]: false,
//             }), {}
//         );

//         for (let i = 0; i < spriteIds.length; i++) {
//             const sprite = entities.sprites[entities.spriteIds[i]];
            
//             if (didCollide[sprite.id]) {
//                 continue;
//             }

//             for (let k = 0; k < spriteIds.length; k++) {
//                 const other = entities.sprites[spriteIds[k]];
                
//                 if (sprite.id === other.id) {
//                     continue;
//                 }

//                 if (isCollision(sprite.shape, other.shape)) {
//                     didCollide[sprite.id] = true;
//                     didCollide[other.id] = true;
//                 }
//             }
//         }

//         for (let i = 0; i < entities.spriteIds.length; i++) {
//             const { shape, fillStyle, strokeStyle, id } = entities.sprites[entities.spriteIds[i]];
//             ctx.beginPath();
//             ctx.strokeStyle = strokeStyle;
//             ctx.fillStyle = didCollide[id] ? "red" : fillStyle;
//             if (shape.kind === "circle") {
//                 ctx.arc(shape.x, shape.y, shape.r, 0, Math.PI * 2);
//             } else {
//                 ctx.rect(shape.x, shape.y, shape.w, shape.h);
//             }
//             ctx.fill();
//             ctx.stroke();
//             ctx.closePath();
//         }
//     }

//     // watch(() => entities.sprites, () => {
//     //     // renderCanvas();
//     //     // tileMaps.boardCamera.draw(ctx);
//     // }, { immediate: true, deep: true });
// }

// export { setupCanvas };
