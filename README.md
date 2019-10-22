# agar.io-clone

![GamePicture](https://res.cloudinary.com/jeffpalmeri/image/upload/v1571758326/single_player.png)

The aim of this project was to create a replica of the popular multiplayer game agar.io. My personal goal was to gain experience with socket.io
and game development mechanics. 

Specifically, I wanted to get practice using socket.io in a
more advanced implimentation than the typical 'chat app' used to learn the basics of socket.io. Also, I had some basic experience with JavaScript game development, canvas animations, and collision detection (which I learned through this great mdn tutorial: https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript),
but wanted to impliment these techniques in a more challenging fashion. 

# Technologies
* NodeJS
* ExpressJS
* Socket.io

* All animations are done on HTML5 canvas

# Instructions
1. Clone this repo to your computer
2. ```cd``` into the root directory and run the command ```npm install```
3. Run the command ```node index.js```
4. Go to localhost:3000 in your browser to play the game!
5. Enter a username and click "Play as Guest"
6. Click the "Play Solo" button to play the game!
7. Move around and absorb orbs! The more orbs that you absorb, the larger and slower your player gets.

8. Then to view the multi-player capabilites of the game, open a second broswer tab, go to localhost:3000 and follow the same steps listed above to start playing the game on this tab as well. 

9. You can see both players moving around in real-time! 
![TwoPlayers](https://res.cloudinary.com/jeffpalmeri/image/upload/v1571757907/both_players.png)

10. If the two players collide, the bigger player absorbs the other and wins :)
![Collision!](https://res.cloudinary.com/jeffpalmeri/image/upload/v1571758154/absorbed.png)

Currently, the size of the world in the game is very small so it's easy to find both of your players. You can edit this in the ```socketMain.js```file located in the ```sockets``` directory. Near the top of the file there is the ```settings``` object:

``` 
let settings = {
  defaultOrbs: 50,
  defaultSpeed: 5,
  defaultSize: 6,
  // As a player gets bigger, the zoom needs to go out
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500
}
```
Change the ```worldWidth``` and ```worldHeight``` to larger values, (5000 x 5000 perhaps) for a larger world.
