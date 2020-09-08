import { open } from "ez:sqlite3";
import { send } from "ez:formui";
import {
	executeCommand,
	registerCommand,
	registerOverride
} from "ez:command";

var playersServer1 = []; //array of player information from server 1
var dbServer1 = open("../server1/active_players.db"); //database location for server 1

var playersServer2 = []; //array of player information from server 2
var dbServer2 = open("../server2/active_players.db"); //database location for server 2

//var playersServer3 = []; //array of player information from server 3 (not in use)
//var dbServer3 = open("../server3/active_players.db"); //database location for server 3 (not in use)


function getPlayers(dbName, dbArray) {
    let playersQuery = dbName.prepare("SELECT * FROM players");
    playersQuery.forEach((pid,xid,pname) =>{
        let player = {player_id: pid, player_xuid: xid, player_name: pname};
        console.log("dbArray:" + JSON.stringify(dbArray));
        dbArray.push(player);
    });
};

//-Load player arrays from databases
getPlayers(dbServer1, playersServer1); //dbServer1 -> playersServer1
getPlayers(dbServer2, playersServer2); //dbServer2 -> playersServer2
//getPlayers(dbServer3, playersServer3); //dbServer3 -> playersServer3 (not in use)

registerCommand("serverinfo", "Open server selection panel.", 0); //Create a custom server command '/serverinfo'
registerOverride("serverinfo", [], function () { //When '/serverinfo' is executed send a FormUI to the player
    if (this.player) {
        //-Refresh the player arrays 
        playersServer1 = [];
        playersServer2 = [];
        //playersServer3 = [];
        getPlayers(dbServer1, playersServer1);
        getPlayers(dbServer2, playersServer2);
        //getPlayers(dbServer3, playersServer3);
        //-----------------------------------
        //-Start FormUI content
        send(this.player, {
			"type": "form",
			"title": "§l§6Server Info",
			"content": "Server to Transfer",
			"buttons": [
				{
					"text": `§1§lSERVER 1 §r(${playersServer1.length}/10)` //Button with active player count from Server1
					
                },
                {
					"text": `§4§lSERVER 2 §r(${playersServer2.length}/10)` //Button with active player count from Server2
					
                },
                //{
				//   "text": `§1§lSERVER 3 §r(${playersServer3.length}/10)` //Button with active player count from Server3 (not in use)
				//	
                //},
			]
		}, data => {
            let playerName = this.player.name
            if (data == null) return; 
            if (data == 0) executeCommand(`execute ${playerName} ~ ~ ~ transferserver @s server.address 19134`); //Button command for Server1
            if (data == 1) executeCommand(`execute ${playerName} ~ ~ ~ transferserver @s server.address 19136`); //Button command for Server2
            //if (data == 2) executeCommand(`execute ${playerName} ~ ~ ~ transferserver @s server.address 19138`); //Button command for Server3 (not in use) 
        }
        //-End FormUI content
	);
    return null
  }
  throw ["error, this command can only be used in game!", "/serverinfo"]