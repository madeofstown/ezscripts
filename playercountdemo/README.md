# playercountdemo
Display player counts from multiple server instances!

This is a demonstration of ez:formui, ez:sqlite3 and the custom command feature from ez:command. 

This demo is meant for people who are running multiple ElementZero instances from the same machine with a folder structure similar to this:

    <ez bds>
        |
        |--<hubserver>
        |
        |--<server1>
        |
        |--<server2>
        |
        +--<server3>
## Install
**HubWorld Server** 

Place the `activePlayersLoad.js` file in the `/<hubserver>/scripts/` folder.

Edit `activePlayersLoad.js` to point to the proper databases for your other servers and for any other changes you want to make(file is comment). **SCRIPT WILL NOT WORK if not properly edited for your servers!**

Edit (or create if missing) `/<hubserver>/scripts/index.js/` to include:
```
import "./activePlayersLoad.js"
```

**Server**

Place the `activePlayersSave.js` file in the `/<server>/scripts/` folder.

Edit (or create if missing) `/<server>/scripts/index.js/` to include:
```
import "./activePlayersSave.js"
```

