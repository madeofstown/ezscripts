import { open } from "ez:sqlite3";
import {
    onPlayerInitialized,
    onPlayerLeft
} from "ez:player";

var players = []; //dbArray
var playersDB = open("active_players.db"); //dbName

function getPlayers(dbName, dbArray) {
    let playersQuery = dbName.prepare("SELECT * FROM players");
    dbArray = [];
    playersQuery.forEach((pid,xid,pname) =>{
        let player = {player_id: pid, player_xuid: xid, player_name: pname}
        dbArray.push(player);
    });
    console.log(JSON.stringify(dbArray) + dbArray.length)
}

function removeAll(dbName) {
    dbName.exec("DELETE FROM players");
}

function createDB(dbFileLoc) {
    let dbFile = open(dbFileLoc);
    dbFile.exec("CREATE TABLE IF NOT EXISTS players (" +
                "player_id INTEGER PRIMARY KEY, " +
                "player_xuid TEXT NOT NULL, " +
                "player_name TEXT NOT NULL);");
}


try {
    createDB("active_players.db");
} catch (err) {
    console.error(err);
}

removeAll(playersDB);
getPlayers(playersDB, players);

onPlayerInitialized(playerObj => {
    console.log(`${playerObj.name} ${playerObj.xuid}`);
    for(let player of players){
        if(player.player_xuid == playerObj.xuid){ 
            getPlayers(playersDB, players);
            return; 
        }
    }
    try{
        playersDB.exec(`INSERT INTO players(player_xuid, player_name) VALUES(${playerObj.xuid}, "${playerObj.name}");`);
        console.log(`*ADD* ${playerObj.name} ${playerObj.xuid}`)
        getPlayers(playersDB, players);
    } catch(err) {
        console.error(err);
    }
})

onPlayerLeft(playerObj => {
    playersDB.exec(`DELETE FROM players WHERE player_xuid='${playerObj.xuid}'`);
    console.log(`*REMOVE* ${playerObj.name} ${playerObj.xuid}`)
    getPlayers(playersDB, players);
})