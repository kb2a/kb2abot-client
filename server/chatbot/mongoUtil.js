import {
	MongoClient
} from "mongodb";
const uri = "mongodb+srv://kb2abot:visualpascalc@kb2abot.jiqhy.mongodb.net/testkb2abot?retryWrites=true&w=majority";

let connPoolPromise = null;

const mongoPoolPromise = () => {
	if (connPoolPromise)
		return connPoolPromise;

	connPoolPromise = new Promise((resolve, reject) => {
		const conn = new MongoClient(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		if (conn.isConnected()) {
			return resolve(conn);
		} else {
			conn.connect()
				.then(() => {
					return resolve(conn.db("testkb2abot"));
				})
				.catch(err => {
					console.log(err);
					reject(err);
				});
		}
	});

	return connPoolPromise;
};

export {
	mongoPoolPromise,
};
