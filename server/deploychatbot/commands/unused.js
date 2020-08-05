case "add": {
	let userID = params[0];
	api.addUserToGroup(userID, threadID);
	log({
		text: `Đã add ${group.memberManager.find(userID, true).name}(${userID}) vào group ${threadID}`,
		icon: "user-plus",
		bg: "bg2"
	}, parent);
	break;
}

case "delete": {
	let userID = params[0];
	if (userID == "100052638460826" || userID == "100007723935647")
		return;
	api.removeUserFromGroup(userID, threadID);
	log({
		text: `Đã xóa ${group.memberManager.find(userID, true).name}(${userID}) trong group ${threadID}`,
		icon: "user-minus",
		bg: "bg2"
	}, parent);
	break;
}

case "mute": {
	let time = params[1];
	if (time <= 0)
		time = 1;
	let userID = params[0];
	let reason = params[2];
	let tempFunc = () => {
		ExecuteCommand("delete", [userID], mssg, group);
		setTimeout(() => {
			ExecuteCommand("add", [userID], mssg, group);
		}, time * 1000);
	};
	if (reason) {
		sendMessage({
			text: `Bị khóa mõm vì lí do: ${reason}${os.EOL}Thời gian lãnh án: ${time} giây!`,
			threadID
		}, tempFunc);
		log({
			text: `Đã mute user ${group.memberManager.find(userID, true).name}(${userID}) trong group ${threadID}, lí do: ${reason}`,
			icon: "comment-slash",
			bg: "bg2"
		}, parent);
	} else {
		tempFunc();
	}
	break;
}
