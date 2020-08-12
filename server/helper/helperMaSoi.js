import fs from "fs";

const shuffle = function(arr) { // thuật toán bogo-sort
	let count = arr.length,
		temp, index;

	while (count > 0) {
		index = Math.floor(Math.random() * count);
		count--;
		temp = arr[count];
		arr[count] = arr[index];
		arr[index] = temp;
	}

	return arr; //Bogosort with no điều kiện dừng
};

const cloneObject = function(obj) {
	return JSON.parse(JSON.stringify(obj));
};

const data = JSON.parse(fs.readFileSync(`${__dirname}/../deploychatbot/commands/games/masoi/data.json`));

const getParty = role => {
	for (const party in data) {
		if (data[party][role])
			return party;
	}
};

const symbols = {
	0: "0⃣",
	1: "1⃣",
	2: "2⃣",
	3: "3⃣",
	4: "4⃣",
	5: "5⃣",
	6: "6⃣",
	7: "7⃣",
	8: "8⃣",
	9: "9⃣"
};

for (let i = 10; i <= 100; i++) {
	const node = i.toString();
	symbols[i] = "";
	for (let j = 0; j < node.length; j++)
		symbols[i] += symbols[node.charAt(j)];
}

export {
	shuffle,
	cloneObject,
	data,
	getParty,
	symbols
};
