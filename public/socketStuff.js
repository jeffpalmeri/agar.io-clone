let socket = io.connect('http://localhost:3000');

// This function is called when the user clicks on the start button
function init() {
  // Start drawing the screen
  draw();
  // console.log(orbs);
  // Call the init event when the client is ready for the data
  socket.emit('init', {
    playerName: player.name
  })
}

socket.on('initReturn', (data) => {
  // console.log(player);
  // console.log(data.orbs);
  orbs = data.orbs;
  setInterval(() => {
    if(player.xVector) {
      socket.emit('tick', {
        xVector: player.xVector,
        yVector: player.yVector
      });
    }
    // console.log(player);
  }, 33);
});

socket.on('tock', (data) => {
  // console.log(data);
  players = data.players
});

socket.on('tickTock', (data) => {
  player.locX = data.playerX,
  player.locY = data.playerY
});

socket.on('orbSwitch', (data) => {
  // console.log(data);
  orbs.splice(data.orbIndex, 1, data.newOrb);
});

socket.on('updateLeaderBoard', (data) => {
  // console.log(data);
  document.querySelector('.leader-board').innerHTML = "";
  data.forEach((curPlayer) => {
    document.querySelector('.leader-board').innerHTML += `
    <li class="leaderboard-player">${curPlayer.name} - ${curPlayer.score}</li>
    `
  });
});