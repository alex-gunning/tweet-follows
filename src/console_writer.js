// Prints a tweet object in a human-friendly format :)
export default function writeTweetsToConsole(tweetObj) {
	tweetObj.forEach((tweetEntry, index) => {
		const user = tweetEntry.keySeq().first();
		const tweetsList = tweetEntry.first();
		console.log(user);
		tweetsList.forEach((tweet, index) => console.log(`\t${tweet}`));
	});
}