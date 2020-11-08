import Cluster from "./Cluster.js";

class Villager extends Cluster {
	constructor(config) {
		Object.assign(config, {
			role: "Villager"
		});
		super(config);
	}

	update() {
		// idk
	}
}

export default Villager;
