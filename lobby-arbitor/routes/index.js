var express = require('express');
var router = express.Router();

var lobbies = [];

var createLobby = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var hash = req.query.hash;
  var name = req.query.name;
  var id   = req.query.id;
  if(lobbies[hash] == undefined){
    lobbies[hash] = [];
  }
  lobbies[hash].push({name: name, id: id});
  res.send("ok")
};

var destroyLobby = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var id = req.query.id;

  Object.keys(lobbies).forEach(function(lobbyName){
    var lobbyList = lobbies[lobbyName];
    for(var x = 0; x < lobbyList.length; lobbyList++){
      console.log(lobbyList[x].id + " != " + id);
      if(lobbyList[x].id == id){
        lobbyList.splice(x, 1);
        x--;
      }
    }
  });
  res.send("ok")
};

var getLobbies = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  var hash = req.query.hash;
  var ret = lobbies[hash];
  if(ret == undefined){
    ret = [];
  }
  res.send(ret);
};


module.exports = {
  create: createLobby,
  destroy: destroyLobby,
  getLobbies: getLobbies
};
