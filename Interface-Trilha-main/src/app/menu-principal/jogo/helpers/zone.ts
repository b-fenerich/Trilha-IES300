export default class Zone {
    renderZone: () => any;
    renderOutline: (dropZone: any) => void;
    constructor(scene) {
        this.renderZone = () => {
            let dropZone11 = scene.add.zone(100,100,50,50).setRectangleDropZone(50,50);
            dropZone11.setData({ occupied: false })
            let dropZone14 = scene.add.zone(100,400,50,50).setRectangleDropZone(50,50);
            dropZone14.setData({ occupied: false })

            let dropZone18 = scene.add.zone(100,700,50,50).setRectangleDropZone(50,50);
            dropZone18.setData({ occupied: false })

            let dropZone22 = scene.add.zone(200,200,50,50).setRectangleDropZone(50,50);
            dropZone22.setData({ occupied: false })
            let dropZone24 = scene.add.zone(200,400,50,50).setRectangleDropZone(50,50);
            dropZone24.setData({ occupied: false })
            let dropZone27 = scene.add.zone(200,600,50,50).setRectangleDropZone(50,50);
            dropZone27.setData({ occupied: false })

            let dropZone33 = scene.add.zone(300,300,50,50).setRectangleDropZone(50,50);
            dropZone33.setData({ occupied: false })
            let dropZone34 = scene.add.zone(300,400,50,50).setRectangleDropZone(50,50);
            dropZone34.setData({ occupied: false })
            let dropZone35 = scene.add.zone(300,500,50,50).setRectangleDropZone(50,50);
            dropZone35.setData({ occupied: false })

            let dropZone53 = scene.add.zone(500,300,50,50).setRectangleDropZone(50,50);
            dropZone53.setData({ occupied: false })
            let dropZone54 = scene.add.zone(500,400,50,50).setRectangleDropZone(50,50);
            dropZone54.setData({ occupied: false })
            let dropZone55 = scene.add.zone(500,500,50,50).setRectangleDropZone(50,50);
            dropZone55.setData({ occupied: false })

            let dropZone62 = scene.add.zone(600,200,50,50).setRectangleDropZone(50,50);
            dropZone62.setData({ occupied: false })
            let dropZone64 = scene.add.zone(600,400,50,50).setRectangleDropZone(50,50);
            dropZone64.setData({ occupied: false })
            let dropZone67 = scene.add.zone(600,600,50,50).setRectangleDropZone(50,50);
            dropZone67.setData({ occupied: false })

            let dropZone71 = scene.add.zone(700,100,50,50).setRectangleDropZone(50,50);
            dropZone71.setData({ occupied: false })
            let dropZone74 = scene.add.zone(700,400,50,50).setRectangleDropZone(50,50);
            dropZone74.setData({ occupied: false })
            let dropZone78 = scene.add.zone(700,700,50,50).setRectangleDropZone(50,50);
            dropZone78.setData({ occupied: false })

            let dropZone41 = scene.add.zone(400,100,50,50).setRectangleDropZone(50,50);
            dropZone41.setData({ occupied: false })
            let dropZone42 = scene.add.zone(400,200,50,50).setRectangleDropZone(50,50);
            dropZone42.setData({ occupied: false })
            let dropZone43 = scene.add.zone(400,300,50,50).setRectangleDropZone(50,50);
            dropZone43.setData({ occupied: false })

            let dropZone45 = scene.add.zone(400,500,50,50).setRectangleDropZone(50,50);
            dropZone45.setData({ occupied: false })
            let dropZone46 = scene.add.zone(400,600,50,50).setRectangleDropZone(50,50);
            dropZone46.setData({ occupied: false })
            let dropZone47 = scene.add.zone(400,700,50,50).setRectangleDropZone(50,50);
            dropZone47.setData({ occupied: false })

            return {
                dropZone11, 
                dropZone14, 
                dropZone18, 
                dropZone22, 
                dropZone24, 
                dropZone27, 
                dropZone33,
                dropZone34, 
                dropZone35,
                dropZone53,
                dropZone54,
                dropZone55,
                dropZone62,
                dropZone64,
                dropZone67,
                dropZone71,
                dropZone74,
                dropZone78,
                dropZone41,
                dropZone42,
                dropZone43,
                dropZone45,
                dropZone46,
                dropZone47
            };
        }
        this.renderOutline = (dropZone) => {
            let dropZoneOutline = scene.add.graphics();
            dropZoneOutline.lineStyle(4, 0xff69b4);
            dropZoneOutline.strokeRect(dropZone.x - dropZone.input.hitArea.width/2, dropZone.y - dropZone.input.hitArea.height/2, dropZone.input.hitArea.width, dropZone.input.hitArea.height)
        }
    }
}