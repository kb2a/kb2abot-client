const {execSync} = require('child_process');
try {
	require('puppeteer');
} catch {
	console.log('Ban dang su dung thuong phuc dang nhap an toan bang PC!');
	console.log('Dang cai dat dependency "puppeteer" . . .');
	execSync('npm i puppeteer');
}

const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');
const filename = process.argv.slice(2).join(' ');
if (filename.length == 0) {
	console.log('Ban chua nhap ten file! \n> node login <ten file>');
	process.exit();
}

(async () => {
	const browser = await puppeteer.launch({
		headless: false
	});
	const context = browser.defaultBrowserContext();
	context.overridePermissions('https://www.facebook.com', [
		'geolocation',
		'notifications'
	]);

	const page = await browser.newPage();

	await page.goto('https://facebook.com/login', {
		waitUntil: ['load', 'networkidle2']
	});

	while (1) {
		const response = await page.waitForNavigation({
			timeout: 0,
			waitUntil: ['load']
		});
		if (!response) continue;
		if (response.url() == 'https://www.facebook.com/') {
			const cookies = await page.cookies(response.url());
			fs.writeFileSync(
				path.join(__dirname, 'bots', `${filename}.json`),
				`{"url":"https://www.facebook.com","cookies":${JSON.stringify(
					cookies
				)}}`
			);
			console.log(`Thanh cong, da tao file cookie: ${filename}.txt tại /bots`);
			process.exit();
		}
	}
})();
