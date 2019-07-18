// Where all our main socket stuff will go
const io = require('../servers').io;
const checkForOrbCollisions = require('./checkCollisions').checkForOrbCollisions;
const checkForPlayerCollisions = require('./checkCollisions').checkForPlayerCollisions;

const Player = require('./classes/Player');
const PlayerData = require('./classes/PlayerData');
const PlayerConfig = require('./classes/PlayerConfig');
const Orb = require('./classes/Orb');
let orbs = [];
let players = [];
let settings = {
  defaultOrbs: 50,
  defaultSpeed: 5,
  defaultSize: 6,
  // As a player gets bigger, the zoom needs to go out
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500
}

initGame();

// Issue a message ro EVERY connected socket 30 fps
setInterval(() => {
  // console.log('tock');
  if(players.length > 0) {
    io.to('game').emit('tock', {
      players
    });
  }
}, 33);

io.sockets.on('connect', (socket) => {
  let player = {};
  player.tickSent = false;
  // a player has connected
  socket.on('init', (data) => {
    // add the player to the 'game' namespace
    socket.join('game');
    // make a player config object
    let playerConfig = new PlayerConfig(settings);
    // make a player data object
    let playerData = new PlayerData(data.playerName, settings);
    // make a master player object to hold both
    player = new Player(socket.id, playerConfig, playerData);

    // Issue a message to THIS client with it's loc 30/sec
    setInterval(() => {
      // console.log('tock');
      if(player.tickSent) {
        socket.emit('tickTock', {
          playerX: player.playerData.locX,
          playerY: player.playerData.locY,
        });
        player.tickSent = false;
      }
    }, 33);

    socket.emit('initReturn', {
      orbs
    });
    players.push(playerData);
  });
  
  // The client sent over the tick, that means we know what direction to move the socket/player
  socket.on('tick', (data) => {
    player.tickSent = true;
    if (data.xVector && data.yVector) {
      speed = player.playerConfig.speed;
      // Update the playerConfig object with the new direction in data
      // and at the same time create a local variable for this callback for readability
      xV = player.playerConfig.xVector = data.xVector;
      yV = player.playerConfig.yVector = data.yVector;

      if((player.playerData.locX < 5 && player.playerData.xVector < 0) || (player.playerData.locX > settings.worldWidth) && (xV > 0)){
          player.playerData.locY -= speed * yV;
      }else if((player.playerData.locY < 5 && yV > 0) || (player.playerData.locY > settings.worldHeight) && (yV < 0)){
          player.playerData.locX += speed * xV;
      }else{
          player.playerData.locX += speed * xV;
          player.playerData.locY -= speed * yV;
      }
      player.tickSent = true;
      // ORB COLLISION!!!
      let capturedOrb = checkForOrbCollisions(player.playerData, player.playerConfig, orbs, settings);
      capturedOrb.then((data) => {
        // then runs if resolve runs! A collision happened!
        // console.log(`Orb collision! at ${data}`);
        // emit to all socketsthe orb to replace
        const orbData = {
          orbIndex: data,
          newOrb: orbs[data]
        }
        // console.log(orbData);
        // Every socket needs to know the leaderboard has changed
        io.sockets.emit('updateLeaderBoard', getLeaderBoard());
        io.sockets.emit('orbSwitch', orbData);
      }).catch(() => {
        // catch runs if reject runs! No collisions.
        // console.log('No collision!');
      });

      // PLAYER COLLISION!!!
      let playerDeath = checkForPlayerCollisions(player.playerData, player.playerConfig, players, player.socketId);
      playerDeath.then((data) => {
        // console.log('player collision!');
        // Every socket needs to know the leaderboard has changed
        io.sockets.emit('updateLeaderBoard', getLeaderBoard());
      }).catch(() => {

      })
    }
  });
});

function getLeaderBoard() {
  // sort players in descending order
  players.sort((a, b) => {
    return b.score - a.score;
  });
  let leaderBoard = players.map((curPlayer) => {
    return {
      name: curPlayer.name,
      score: curPlayer.score
    }
  });
  return leaderBoard;
}

// Run at the beginning of a new game
function initGame() {
  for(let i = 0; i < settings.defaultOrbs; i++) {
    orbs.push(new Orb(settings));
  }
}

module.exports = io;