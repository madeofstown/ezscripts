import { open } from "ez:sqlite3";
import {
    onPlayerInitialized,
    onPlayerLeft,
    getOfflinePlayerByXUID
} from "ez:player";
import { executeCommand } from "ez:command";

const system = server.registerSystem(0, 0);

system.initialize = function() {
    let playersDB = open("players.db");
    playersDB.exec("DELETE FROM players");
    getPlayers();
}

var players = [];

try{
    var playersDB = open("players.db");
    playersDB.exec("CREATE TABLE IF NOT EXISTS players (" +
                   "player_id INTEGER PRIMARY KEY, " +
                   "player_xuid TEXT NOT NULL, " +
                   "player_name TEXT NOT NULL, " +
                   "online INTEGER NOT NULL);");
    var playersQuery = playersDB.prepare("SELECT * FROM players");
    getPlayers();
} catch (err) {
    console.error(err);
}

function getPlayers() {
    players=[];
    playersQuery.forEach((pid,xid,pname,on)=>{
        let player = {player_id: pid, player_xuid: xid, player_name: pname, online: on};
        players.push(player);
        
    });
    console.log(JSON.stringify(players) + players.length)
}

onPlayerInitialized(playerObj => {
    //let activePlayer = getOfflinePlayerByXUID(playerObj.xuid);
    console.log(`${playerObj.name} ${playerObj.xuid}`);
    for(let player of players){
        if(player.player_xuid == playerObj.xuid){ 
            getPlayers()
            return; 
        }
    }
    try{
        playersDB.exec(`INSERT INTO players(player_xuid, player_name, online) VALUES(${playerObj.xuid}, "${playerObj.name}", 1);`);
        getPlayers();
    } catch(err) {
        console.error(err);
    }
})

onPlayerLeft(playerObj => {
    playersDB.exec(`DELETE FROM players WHERE player_xuid='${playerObj.xuid}'`);
    console.log(`*REMOVE* ${playerObj.name} ${playerObj.xuid}`)
    getPlayers();
})



