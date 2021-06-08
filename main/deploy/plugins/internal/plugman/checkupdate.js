const fs = require('fs');
const recursive = require('recursive-readdir');
const path = require('path');
const axios = require('axios');
const {validURL, downloadFile} = kb2abot.helpers;

module.exports = {
	keywords: ['checkupdate'],

	name: 'Cập nhật',

	description: 'Kiểm tra cập nhật của các plugin',

	guide: '',

	childs: [],

	permission: {
		'*': 'superAdmin'
	},

	datastoreDesign: {
		account: {
			global: {},
			local: {}
		},
		thread: {
			global: {},
			local: {}
		}
	},

	async onLoad() {
		const checkupdate = async () => {
			console.newLogger.debug('PLUGINS - Dang kiem tra update . . .');
			const files = (await recursive(kb2abot.config.DIR.PLUGIN)).filter(
				file =>
					path.basename(file) == 'manifest.json' &&
					validURL(require(file).update.manifest) &&
					validURL(require(file).update.plugin)
			);
			let newVer = false;
			for (const file of files) {
				const manifest = require(file);
				const {data: tmp_manifest} = await axios.get(manifest.update.manifest);

				const outputFileName = `${manifest.name} ${tmp_manifest.version}.zip`;
				const output = path.join(kb2abot.config.DIR.UPDATE, outputFileName);

				if (
					!fs.existsSync(output) &&
					manifest.version != tmp_manifest.version
				) {
					newVer = true;
					console.newLogger.warn(
						`PLUGINS - Phat hien phien ban moi, dang tai ${manifest.name} [${tmp_manifest.version}]!`
					);
					await downloadFile(manifest.update.plugin, output);
					console.newLogger.debug(
						`PLUGINS - Da tai ${manifest.name} [${tmp_manifest.version}] tai ${output}!`
					);
				}
			}
			if (!newVer) {
				console.newLogger.debug('PLUGINS - khong tim thay phien ban moi!');
			}
		};
		setInterval(() => checkupdate(), kb2abot.config.INTERVAL.CHECK_UPDATE);
		await checkupdate();
	},

	hookType: 'none',

	async onMessage(message, reply) {},

	async onCall(message, reply) {
		const files = fs
			.readdirSync(kb2abot.config.DIR.UPDATE)
			.filter(filename => filename.split('.').pop() == 'zip');
		if (files.length > 0)
			reply(
				'Đường dẫn file updates: /main/deploy/updates\nVui lòng tự update (có thể move, delete hoặc extract)\nDanh sách file updates:\n' +
					files.join(', ')
			);
		else reply('Không tìm thấy bản cập nhật nào!');
	}
};
