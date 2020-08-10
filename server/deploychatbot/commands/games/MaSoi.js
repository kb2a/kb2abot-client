import os from "os";

class MaSoi {
	constructor({
		bot = true
	} = {}) {
		this.table = [
			["⬜", "⬜", "⬜"],
			["⬜", "⬜", "⬜"],
			["⬜", "⬜", "⬜"]
		];
		this.bot = bot;
		this.turn = "❌";
	}

	isEnd() {
		for (let i = 0; i < 3; i++) {
			let chain = 0;
			let node = this.table[i][0];
			for (let j = 0; j < 3; j++) {
				chain = (node != this.table[i][j]) ? 0 : chain + 1;
				node = this.table[i][j];
				if (chain == 3 && node != "⬜")
					return node;
			}
		}

		for (let j = 0; j < 3; j++) {
			let chain = 0;
			let node = this.table[0][j];
			for (let i = 0; i < 3; i++) {
				chain = (node != this.table[i][j]) ? 0 : chain + 1;
				node = this.table[i][j];
				if (chain == 3 && node != "⬜")
					return node;
			}
		}

		let node1 = this.table[0][0];
		let chain1 = 0;
		for (let i = 0; i < 3; i++) {
			chain1 = (node1 != this.table[i][i]) ? 0 : chain1 + 1;
			node1 = this.table[i][i];
			if (chain1 == 3 && node1 != "⬜")
				return node1;
		}

		let node2 = this.table[2][2];
		let chain2 = 0;
		for (let i = 2; i >= 0; i--) {
			chain2 = (node2 != this.table[i][i]) ? 0 : chain2 + 1;
			node2 = this.table[i][i];
			if (chain2 == 3 && node2 != "⬜")
				return node2;
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
			this.changeTurn();
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
}

export default MaSoi;
