//!======This script is intended for use with ElementZero======!
//      Skyblock Multiplayer Spawn Script made for:
//      https://mcpedl.com/fisherblock-skyblock-updated/
//
//      Feel free to edit for your own maps
//!============================================================!
import {
	onPlayerInitialized
} from "ez:player";
 
import {
    getPlayerByNAME
} from "ez:player";

let system = server.registerSystem(0, 0);
console.log("loaded skySpawn.js");

// Random Start Location Boundary-|
let xMax = 10000;               //|
let xMin = -10000;              //|
let yMax = 200;                 //|
let yMin = 20;                  //|
let zMax = 10000;               //|
let zMin = -10000;              //|
// -------------------------------|

onPlayerInitialized(player => {
	let playerName = player.name;
    let xRand = parseInt((Math.random() * (xMax - xMin + 1)), 10) + xMin;   //define random x spawn
    let yRand = parseInt((Math.random() * (yMax - yMin + 1)), 10) + yMin;   //define random y spawn
    let zRand = parseInt((Math.random() * (zMax - zMin + 1)), 10) + zMin;   //define random z spawn
        
    function spawnIsland() {    //clones a spawn island to an offset from the players random spawn location
        let xPos = xRand - 1;   //offset from player x position
        let yPos = yRand - 3;   //offset from player y location
        let zPos = zRand;       //offset from player z location
        system.executeCommand(`clone 1 65 0 -1 62 2 ${xPos} ${yPos} ${zPos} replace`, {});
    }
    
    function setSpawn() {       //activates a command block (execute @p[r=10] ~ ~ ~ execute @s ~ ~ ~ spawnpoint @s ~ ~ ~) in spawn island with redstone block
        let xPos = xRand + 1;   
        let yPos = yRand - 2;
        let zPos = zRand;
        system.executeCommand(`setblock ${xPos} ${yPos} ${zPos} redstone_block`, {});  
    }

    function cleanUp() {        //removes command block and redstone block by filling an area offset from the player with air
        let startX = xRand + 1;
        let startY = yRand - 2;
        let startZ = zRand;
        let endX = xRand;
        let endY = yRand - 2;
        let endZ = zRand;
        system.executeCommand(`fill ${startX} ${startY} ${startZ} ${endX} ${endY} ${endZ} air`, () => {})
    }

    system.executeCommand(`tellraw @a[name="${playerName}",tag=!joined] {"rawtext":[{"text":"§l§6Welcome to Fisher SkyBlock Online ${playerName}"}]}`, () => {});
    system.executeCommand(`tellraw @a[name="${playerName}",tag=joined] {"rawtext":[{"text":"§l§6Welcome back to FSBOnline ${playerName}"}]}`, () => {});
    //teleports a new player to a random location within the defined boundaries
    system.executeCommand(`tp @a[name="${playerName}",tag=!joined] ${xRand} ${yRand} ${zRand}`, () => {});
    //console.log(`skySpawn.js telported ${playerName} to ${xRand}, ${yRand}, ${zRand}`);  <--- Logs every time a player joins regardless of successfull telleport
    setTimeout(spawnIsland, 6); //runs spawnIsland funtion after 6 ticks of delay
    setTimeout(setSpawn, 10);
    setTimeout(cleanUp, 14);
    system.setTimeout(system.executeCommand(`tag @p[name="${playerName}",tag=!joined] add joined`, () => {}), 25);
});



