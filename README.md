# Speedfun
### Authors: Brandon Fan, Spencer Martin, Grant Martin, Juhyoung Lee
<div style="text-align:center"><img src ="https://challengepost-s3-challengepost.netdna-ssl.com/photos/production/software_photos/000/499/457/datas/gallery.jpg"/></div>

## To Run The Application
1. Clone the Repository
2. Run `python -m SimpleHTTPServer 4200` inside `em` folder
3. Run `node app.js` inside `lobby-arbitor` folder
4. Navigate to `localhost:4200` and upload your ROM file
5. Enjoy :smiley:

## Inspiration
Speedrunning has always been a common interest within our group. The high skill and precision exhibited by the runners has always been a joy to watch. Despite being interesting to watch, we felt that speed running would benefit from a more competitive feel, similar to Mario Kart. Seeing your enemy adds to the exhilaration and tension of the run. Thus, we have created a modified emulator which allows you to see your opponent in real time, and race against them in the same world.


## What it does
Speedfun examines specific memory addresses within the emulator to deduce information like player position, state, and map. This information is sent across a WebRTC connection to your partner, where it is used to render the competing player. You can create or join another person's lobby, and compete against them in real time. The system will take care of declaring a winner and loser automatically.

## How We Built it
A big concern was latency - especially with the spotty wifi here in the beginning of BitCamp. Thus, we elected to use the peer-to-peer standard of WebRTC, cutting out the middleman of a server. We modified the popular SNES emulator, Snes9X, to provide hooks into our Javascript code, allowing us to probe memory locations and update state every frame. We were able to translate the C++ code of Snes9X into Javascript using Emscripten.

## Challenges we ran into
It was challenging to find specific memory locations for player position, as many ROMs are poorly documented. We had to manually check numerous addresses in a debugger to find the right ones. Additionally, we found the WebRTC api to be initially somewhat confusing, however the service Peer.js made it quite easy.

## What's next for Speedfun
We'd like to introduce a recording feature, a leaderboard, and add support for more games.
