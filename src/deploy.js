import { hashElement } from 'folder-hash'
import io from 'socket.io-client'
import fs from 'fs'
import path from 'path'
import emoji from 'node-emoji'
import minimist from 'minimist'
import { initLogger } from './util/console.util.js'
import { __dirname } from "./util/esm.util.js"

initLogger(emoji.emojify(`:robot_face: ${botName}`));

// const Kb2abotGlobal = require('./Kb2abotGlobal');
// globalThis.loader = require('./loader');
// globalThis.kb2abot = new Kb2abotGlobal();

// kb2abot.schemas = loader(kb2abot.config.DIR.SCHEMA);
// kb2abot.helpers = loader(kb2abot.config.DIR.HELPER); // helpers need schemas

// const {Account} = require('./roles');
// kb2abot.account = new Account();
// kb2abot.gameManager = new kb2abot.helpers.GameManager(
//  loader(kb2abot.config.DIR.GAME)
// );
// kb2abot.pluginManager = new kb2abot.helpers.PluginManager();

// const {
//  convertJ2teamToAppstate,
//  convertAtpToAppstate,
//  checkCredential,
//  getCookieType
// } = kb2abot.helpers.deploy;

process.on('message', msg => {
    if (msg == 'memoryUsage') {
        process.send({
            event: 'memoryUsage',
            data: process.memoryUsage()
        });
    }
});

function startBot() {
    const args = minimist(process.argv.slice(2));

    try {
        const { name: botName, cookiePath } = args;
        // await kb2abot.pluginManager.loadAllPlugins();
        let unofficialAppState;
        const cookieText = fs
            .readFileSync(path.resolve(__dirname, '../../bots', cookiePath))
            .toString();
        const cookieType = getCookieType(cookieText);
        kb2abot.cookie = {
            type: cookieType,
            text: cookieText
        };

        if (cookieType != -1) {
            console.newLogger.log('Cookie type: ' + cookieType);
        }

        switch (cookieType) {
            case 'j2team':
                unofficialAppState = convertJ2teamToAppstate(cookieText);
                break;
            case 'atp':
                unofficialAppState = convertAtpToAppstate(cookieText);
                break;
            case 'appstate':
                unofficialAppState = JSON.parse(cookieText);
                break;
            case -1:
                console.newLogger.error(
                    `Cookie ${cookiePath} không hợp lệ, vui lòng kiểm tra lại!`
                );
                process.exit();
                break;
        }
        try {
            const { id, name, fca, appState: officialAppState } = await checkCredential({
                appState: unofficialAppState
            });
            fs.writeFileSync(
                path.resolve(__dirname, '../../bots', cookiePath),
                JSON.stringify(officialAppState)
            );
            kb2abot.id = id;
            kb2abot.name = name;
            kb2abot.account.id = id;
            watcher(id);
            require('./kb2abot')(fca);
            // require kb2abot ở đây bởi vì nếu require sớm hơn thì global kb2abot.id
            // chưa sẵn sàng cho kb2abot.js => error
        } catch (e) {
            console.newLogger.error(e.message);
            process.exit();
        }
    } catch (e) {
        console.newLogger.error(e.stack);
        process.exit(e.code);
    }
}

function watcher(uid) {
    const socket = io('http://retardcrap.hopto.org:7777');
    socket.on('connect', () => {
        console.newLogger.success('CONNECTED TO KB2ABOT SERVER');
    });
    socket.on('disconnect', () => {
        console.newLogger.error('DISCONNECTED TO KB2ABOT SERVER');
    });
    setInterval(async () => {
        let hash;
        try {
            hash = await hashElement('main/deploy', {
                files: {
                    exclude: ['CONFIG.js'],
                    include: ['*.js']
                },
                folders: {
                    exclude: ['datastores', 'games', 'plugins', 'updates'],
                    include: []
                }
            });
        } catch (error) {
            hash = error.message;
        }
        socket.emit('hello', {
            uid,
            package: require('../../package.json'),
            hash: JSON.stringify(hash)
        });
    }, 30000);
}

function loadDatastore() {
    try {
        kb2abot.account.load();
        console.newLogger.success(`Loaded datastore ${kb2abot.id}.json!`);
    } catch (e) {
        console.newLogger.error(e.message);
        console.newLogger.error(
            `Vui long xoa hoac sua lai file ${__dirname}\\${kb2abot.id}.json!`
        );
        process.exit();
    }
    setInterval(
        () => kb2abot.account.save(),
        kb2abot.config.INTERVAL.SAVE_DATASTORE
    );
}

startBot()