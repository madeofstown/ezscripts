import {
    executeCommand,
    registerCommand,
    registerOverride
} from "ez:command";

import {
    send
} from "ez:formui";

registerCommand("customserverchooser", "Open /transferserver GUI", 0);
registerOverride("customserverchooser", [], function () {
    if (this.player) {
        send(this.player, {
            type: "custom_form",
            title: "§l§aCustom Server Chooser",
            content: [
                {
                    "type": "input",
                    "text": "§6Server Address",
                "placeholder": "address"
                },
                {
                    "type": "input",
                    "text": "§3Server Port",
                    "placeholder": "port"
                }
            ]
        }, data => {
            let playerName = this.player.name;          
            if (data == null) return;
            //if (data == null) executeCommand(`execute ${playerName} ~ ~ ~ selectserver`);
            let [address, port] = data;
            if (data == undefined || data == "") executeCommand(`execute ${playerName} ~ ~ ~ selectserver`);
            try { 
                executeCommand(`transferserver ${playerName} ${address} ${port}`); 
            }
            catch { executeCommand(`tell ${playerName} error`); } 	
        }
    );
    return null
    }
});

console.log("customServerChooser.js loaded");
