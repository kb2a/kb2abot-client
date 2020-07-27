import {
	MongoClient
} from "mongodb";
const uri = "Mongo URI";
// Neu ban muon su dung database de luu tru
// thong tin Group, weather, . . . va restore lai moi lan chay npm start
// Thi hay tao 1 mongodb voi cau truc nhu sau:
// *account
// *group 
// *member
// Sau do: Hay UnComment cac dong co function:
// ".downloadFromDtb()", ".uploadToDtb()"
// O trong cac file: "roles.js" va "chatbot.js"
// Chuc ban thanh cong!

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
					return resolve(conn.db("kb2abot"));
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
