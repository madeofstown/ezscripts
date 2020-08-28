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
                    "placeholder": "19132"
                }
            ]
        }, data => {
            let playerName = this.player.name;
            //if (data == null) return;
            if (data == null) {
                executeCommand(`execute ${playerName} ~ ~ ~ selectserver`);
                return;
            }
            let [address, port] = data;
            if (port == null) { port = 19132; }
            if (address == null || address == "") { executeCommand(`execute ${playerName} ~ ~ ~ customserverchooser`); }
            else { try {
                executeCommand(`transferserver ${playerName} ${address} ${port}`);
                executeCommand(`execute ${playerName} ~ ~ ~ customserverchooser`);
                console.log(`${playerName} **TRANSFERED TO** ${address}:${port}`);
            }
            catch { executeCommand(`tell ${playerName} error`); }
            }
        }
    );
    return null
    }
});

console.log("customServerChooser.js loaded");
