import {
	Poll
} from "../poll";

class Cluster {
	constructor({
		role,
		threadID,
		masterID,
		isWerewolfGroup = false
	} = {}) {
		this.role = role;
		this.threadID = threadID;
		this.masterID = masterID;
		this.isDoingObligation = false;
		this.doObligationAvailable = true;
		this.isDoingObligationOnDead = false;
		this.doObligationOnDeadAvailable = true;
		this.finalValue;
		this.poll;
		this.isWerewolfGroup = isWerewolfGroup;
	}

	isAvailable(taskName) {
		return this[taskName + "Available"];
	}

	commit(value) {
		this.finalValue = value;
		this.isDoingObligation = false;
		this.isDoingObligationOnDead = false;
	}

	reset() {
		this.finalValue = undefined;
	}

	// ------------------
	doObligation() {
		this.reset();
		return new Promise(resolve => {
			this.commit(0);
			resolve(this.getFinalValue());
		});
	}
	doObligationOnDead() {
		this.reset();
		return new Promise(resolve => {
			this.commit(0);
			resolve(this.getFinalValue());
		});
	}
	// ------------------

	resetPoll() {
		this.poll = new Poll();
	}

	isCommitted() {
		return this.finalValue != undefined;
	}

	getFinalValue() {
		return {
			role: this.role,
			value: this.finalValue
		};
	}
}

export default Cluster;
