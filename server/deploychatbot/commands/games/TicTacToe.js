import os from "os";
import Game from "./Game.js";

const validNumber = ["11", "12", "13", "21", "22", "23", "31", "32", "33"];

class TicTacToe extends Game {
	constructor() {
		super();
		this.table = [
			["⬜", "⬜", "⬜"],
			["⬜", "⬜", "⬜"],
			["⬜", "⬜", "⬜"]
		];
		// this.bot = bot;
		this.turn = "❌";
	}

	kiemTraDoc() {
		for (let j = 0; j < 3; j++) { // kiem tra doc
			let chain = 0;
			let node = this.table[0][j];
			for (let i = 0; i < 3; i++) {
				chain = (node != this.table[i][j]) ? 0 : chain + 1;
				node = this.table[i][j];
				if (chain == 3 && node != "⬜")
					return true;
			}
		}
		return false;
	}

	kiemTraNgang() {
		for (let i = 0; i < 3; i++) { // kiem tra ngang
			let chain = 0;
			let node = this.table[i][0];
			for (let j = 0; j < 3; j++) {
				chain = (node != this.table[i][j]) ? 0 : chain + 1;
				node = this.table[i][j];
				if (chain == 3 && node != "⬜")
					return true;
			}
		}
		return false;
	}

	kiemTraCheoPhai() {
		let node = this.table[0][0];
		let chain = 0;
		for (let i = 0; i < 3; i++) {
			chain = (node != this.table[i][i]) ? 0 : chain + 1;
			node = this.table[i][i];
			if (chain == 3 && node != "⬜")
				return true;
		}
		return false;
	}

	kiemTraCheoTrai() {
		let node = this.table[0][2];
		let chain = 0;
		let j = 2;
		for (let i = 0; i < 3; i++) {
			chain = (node != this.table[i][j]) ? 0 : chain + 1;
			node = this.table[i][j];
			if (chain == 3 && node != "⬜")
				return true;
			j--;
		}
		return false;
	}

	kiemTraFullBan() {
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (this.table[i][j] == "⬜")
					return false;
			}
		}
		return true;
	}

	isEnd() {
		if (this.kiemTraDoc() || this.kiemTraNgang() || this.kiemTraCheoPhai() || this.kiemTraCheoTrai()) {
			return this.turn;
		}
		if (this.kiemTraFullBan()) {
			return "KHÔNG ai";
		}
		return false;
	}

	add(y, x) {
		let i, j;
		if (typeof(y) == "object") {
			i = y[0] - 1;
			j = y[1] - 1;
		} else {
			i = y - 1;
			j = x - 1;
		}
		if (this.table[i][j] == "⬜") {
			this.table[i][j] = this.turn;
		}
	}

	changeTurn() {
		this.turn = (this.turn == "❌") ? "⭕" : "❌";
	}

	getData() {
		let data = `${os.EOL}1️⃣⬜⬜⬜${os.EOL}2️⃣⬜⬜⬜${os.EOL}3️⃣⬜⬜⬜${os.EOL}◼️1️⃣2️⃣3️⃣`;
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				data = data.replace("⬜", (this.table[i][j]) == "⬜" ? " " : this.table[i][j]);
			}
		}
		return data.replace(/ /g, "⬜");
	}

	update(body, api, parent, mssg, group) {
		if (validNumber.indexOf(body) == -1) {
			api.sendMessage(`Vui lòng nhập đúng tọa độ (${validNumber.toString()})`, mssg.threadID);
			return;
		}
		const numbers = body.split("");
		this.add(numbers);
		api.sendMessage(this.getData(), mssg.threadID);
		const isEnd = this.isEnd();
		if (isEnd) {
			api.sendMessage(`${isEnd} đã chiến thắng :v`, mssg.threadID);
			group.gaming = false;
		} else {
			this.changeTurn();
		}
	}

	clear() {
		return new Promise(resolve => {
			resolve();
		});
	}
}

export default TicTacToe;
