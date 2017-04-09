var over_ctx;
var over_canvas;

var readEmulatorByte;

var marioSheet = new Image();
marioSheet.src = "MarioPoses.png";
var marioSheetFlipped = new Image();
marioSheetFlipped.src = "MarioPosesFlipped.png";

var wonLevel = false;

function updateFrame(){
    if(!over_ctx){
        over_canvas = document.getElementById("overlay");
        over_ctx = over_canvas.getContext('2d');
        readEmulatorByte = Module.cwrap('readEmulatorByte', 'number', ['number'])
    }
    over_ctx.clearRect(0, 0, over_canvas.width, over_canvas.height);
    if(Window.conn){
        switch(Window.hash){

            case "0838e531fe22c077528febe14cb3ff7c492f1f5fa8de354192bdff7137c27f5b":{
                var screenX = readEmulatorByte(0x7e007f) & 0xff;
                screenX <<= 8;
                screenX |= readEmulatorByte(0x7e007e) & 0xff;

                var screenY = readEmulatorByte(0x7e0081) & 0xff;
                screenY <<= 8;
                screenY |= readEmulatorByte(0x7e0080) & 0xff;

                var playerX = readEmulatorByte(0x7e00d2) & 0xff;
                playerX <<= 8;
                playerX |= readEmulatorByte(0x7e00d1) & 0xff;

                var playerY = readEmulatorByte(0x7e00d4) & 0xff;
                playerY <<= 8;
                playerY |= readEmulatorByte(0x7e00d3) & 0xff;

                var playerLevel = readEmulatorByte(0x7e13bf) & 0xff;
                var sublevel = readEmulatorByte(0x7e141a) & 1;
                var levelState = readEmulatorByte(0x7e0100) & 0xff;
                var inLevel = (levelState == 0x14) || (levelState == 0x13);

                var drumState = readEmulatorByte(0x7e13d6) & 0xff;

                var animState = readEmulatorByte(0x7e13e0) & 0xff;
                var facing = readEmulatorByte(0x7e0076) & 0xff;
                if(!inLevel){
                    wonLevel = false;
                }

                if((drumState < 80) && inLevel && !wonLevel){
                    var submap = readEmulatorByte(0x7e1f11) & 0xff;
                    var level = playerLevel;
                    wonLevel = true;
                    alreadyWon = (level == goal);
                    if(!scope.lost && alreadyWon){
                        scope.won = true;
                        if(!scope.$$phase) {
                            scope.$apply();
                        }
                    }
                    console.log("won " + level);
                    Window.conn.send({
                        type: "win",
                        level: level
                    });
                }

                Window.conn.send({
                    type: "update",
                    x: playerX,
                    y: playerY,
                    anim: animState,
                    facing: facing,
                    inLevel: inLevel,
                    sublevel: sublevel,
                    playerLevel: playerLevel
                });

                if(Window.lastPartnerPacket != undefined){
                    if(Window.lastPartnerPacket.inLevel && (Window.lastPartnerPacket.playerLevel == playerLevel) && (Window.lastPartnerPacket.sublevel == sublevel) && inLevel) {
                        var psx = screenX - (playerX - Window.lastPartnerPacket.x);
                        var psy = screenY - (playerY - Window.lastPartnerPacket.y);
                        over_ctx.fillStyle = "#FF0000";
                        //console.log("(" + psx + ", " + psy + ")");
                        var sheetx = Window.lastPartnerPacket.anim & 0xf;
                        var sheety = (Window.lastPartnerPacket.anim & 0xf0) / 0x10;
                        if (Window.lastPartnerPacket.facing == 0) {
                            sheetx = 15 - sheetx;
                            over_ctx.drawImage(marioSheetFlipped, 1 + sheetx * 32, 26 + 34 * sheety, 31, 33, psx, psy + 1, 31, 33);
                        }
                        else {
                            over_ctx.drawImage(marioSheet, 53 + sheetx * 32, 26 + 34 * sheety, 31, 33, psx, psy + 1, 31, 33);
                        }
                    }
                }
            }; break;
            case "66871d66be19ad2c34c927d6b14cd8eb6fc3181965b6e517cb361f7316009cfb": {
                var linkx = ((readEmulatorByte(0x7e0023) & 0xff) << 8) | ((readEmulatorByte(0x7e0022) & 0xff));
                var linky = ((readEmulatorByte(0x7e0021) & 0xff) << 8) | ((readEmulatorByte(0x7e0020) & 0xff));

                var screenx = ((readEmulatorByte(0x7e00e3) & 0xff) << 8) | ((readEmulatorByte(0x7e00e2) & 0xff));
                var screeny = ((readEmulatorByte(0x7e0123) & 0xff) << 8) | ((readEmulatorByte(0x7e0122) & 0xff));

                var anim = readEmulatorByte(0x7e002f);

                Window.conn.send({
                    type: "update",
                    x: linkx,
                    y: linky,
                    screenx: screenx,
                    screeny: screeny,
                    anim: anim
                });

                //console.log("(" + linkx + ", " + linky + "), (" + screenx + ", " + screeny + ")");
                //console.log("(" + (linkx - screenx) + ", " + (linky - screeny) + ")");

                if(Window.lastPartnerPacket != undefined){
                    over_ctx.fillStyle="#FF0000";
                    //var x = ()
                    var partX = Window.lastPartnerPacket.x - screenx;
                    var partY = Window.lastPartnerPacket.y - screeny;
                    over_ctx.fillRect(partX,partY,16,16);
                }
            }
        }
    }


}
