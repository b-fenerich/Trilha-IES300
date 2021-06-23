window.addEventListener('mousedown', handleGrab);
window.addEventListener('mousemove', handleOnPieceMove);
window.addEventListener('mouseup', handleOnDropPiece);


var activePiece = null;
//var activePiece = null as HTMLElement;

function handleGrab(event) {
    //const element = event.target as HTMLElement;
    const element = event.target;
    if(element.classList.contains('piece')) {
        const x = event.clientX - 25;
        const y = event.clientY - 25;
        element.style.position = 'absolute';
        element.style.left = x + 'px';
        element.style.top = y +'px';

        activePiece = element;

    }
}

function handleOnPieceMove(event) {


    if(activePiece) {
        const x = event.clientX - 25;
        const y = event.clientY - 25;
        activePiece.style.position = 'absolute';
        activePiece.style.left = x + 'px';
        activePiece.style.top = y +'px';       
    }
}

function handleOnDropPiece() {
    if(activePiece) {
        activePiece = null;
    }
}