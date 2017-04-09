/**
 * Created by Spencer on 4/8/17.
 */
var emuctrl = angular.module('emu', ['ngAnimate', 'ngSanitize']);
var scope;

var goal = 41;
var alreadyWon = false;

function resizeCanvas() {
    $(function () {
        var div = $('#canvases');
        var width = div.width();

        div.css('height', width * 224 / 256);
        document.getElementById("overlay").width = 256;
        document.getElementById("overlay").height = 224;
        document.getElementById("canvas").width = 256;
        document.getElementById("canvas").height = 224;
    });
}

window.addEventListener('resize', resizeCanvas);

emuctrl.controller('emuctrl', function ($scope) {
    scope = $scope;
    $scope.lost = false;
    $scope.won = false;
    $scope.games = [{
            'name': 'Super Mario World',
            'image': 'images/Super Mario World (U).png',
            'sha256': '0838e531fe22c077528febe14cb3ff7c492f1f5fa8de354192bdff7137c27f5b'
        },
        {
            'name': 'Super Metroid',
            'image': 'images/Super_Metroid_title.png',
            'sha256': '0838e531fe22c077528febe14cb3ff7c492f1f5fa8de354192bdff7137c37f5b'
        },
        {
            'name': 'The Legend of Zelda: A Link to the Past',
            'image': 'images/zelda.gif',
            'sha256': '66871d66be19ad2c34c927d6b14cd8eb6fc3181965b6e517cb361f7316009cfb'
        }
    ]
    $scope.filteredGames = $scope.games;
    $scope.inGame = false;
    $scope.uploadedROM = false;
    $scope.inlobby = false;
    $scope.createdLobbyName = '';
    $scope.isCreatingLobby = false;
    $scope.createdLobby = false;
    $scope.createLobby = function () {
        isCreatingLobby = true;
        $scope.inlobby = true;
        $scope.isCreatingLobby = true;
        $scope.$apply();
        Window.createdLobby = true;
    };

    $scope.generateLobby = function (name) {
        $scope.isCreatingLobby = false;
        $scope.createdLobbyName = name;
        $scope.createdLobby = true;
        $scope.$apply();
        $.get("http://172.16.130.56/create?hash=" + Window.hash + "&id=" + Window.pid + "&name=" + name, function (data) {

        });
    }
    $scope.join = function (id) {
        Window.conn = Window.peer.connect(id);
        initConn();
        $scope.inlobby = true;

        $scope.$apply();
        $.get("http://172.16.130.56/destroy?id=" + id, function (data) {});
    }

    $scope.single = function () {
        Window.startEmu();
        $scope.inlobby = true;
    }
});

function initConn() {

    Window.conn.on('open', function () {
        scope.inGame = true;
        scope.$apply();
        // Receive messages
        Window.conn.on('data', function (data) {
            if (data.type == "update") {
                Window.lastPartnerPacket = data;
            }
            if (data.type == "win") {
                if (data.level == goal && !alreadyWon) {
                    scope.lost = true;
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                }
            }
        });

        // Send messages
        Window.startEmu();

    });
}

function initPeerStuff() {
    Window.peer.on('connection', function (connection) {
        scope.createdLobby = false;
        scope.inGame = true;
        scope.$apply();
        Window.conn = connection;
        initConn();
    });
}