export default class Piece {
    render: (x: any, y: any, sprite: any) => any;
    playerPiece: (player: any) => any;
    constructor(scene){
        this.render = (x,y,sprite) => {
            let piece = scene.add.image(x,y,sprite).setScale(.75,.75).setInteractive();
            scene.input.setDraggable(piece);
            return piece;
        }
    }
}