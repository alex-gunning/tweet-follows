const fs = require('fs');
import Promise from 'promise';

export default function readFileAsync(fileName) {
	return new Promise((resolve, reject) => {
		fs.readFile(fileName, "utf-8", (err, data) => {
			if(err) {
				return reject(err);
			} 
			return resolve(data);
		});
	});
}