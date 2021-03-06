import {List, Map} from 'immutable';

export const INITIAL_STATE = Map({
				"followers":Map(),
				"numTweets":0,
				"tweets":Map()
				});

export function setFollowers(state, followerEntry) {
	const [user, followers] = getUserAndFollowers(followerEntry);
	const userState = addUserToFollowerList(state, user);
	const followerState = addFollowers(userState, user, followers);
	return addFollowersAsUsers(followerState, followers);
}

// Strip users and followers from an entry. Remove whitespace.
function getUserAndFollowers(followerEntry) {
	const users = followerEntry.split("follows").map(str => str.trim());
	return [users[0], users[1].split(",").map(str => str.trim())];
}

// Adds a user to the follower map with a blank follower list if the user doesn't already exist.
function addUserToFollowerList(state, user) {
	if(!state.get("followers").has(user)) {
		return state.setIn(["followers", user], List());
	} else {
		return state;
	}
}

// Adds a follower list to a user.
function addFollowers(state, user, followers) {
	const followerList = List(followers);
	return state.setIn(["followers", user], followerList.sort()); 
}

// Adds followers as users as well but only if they don't already exist.
function addFollowersAsUsers(state, followers) {
	/*
	* My technique here is to build the follower map and then merge it with the 
	* actual user map, thereby overwriting any previous followers with actual
	* users if they are present.
	*/
	const followerMap = Map(followers.map((item, index) => ([item, List()]) ));
	const userMap = state.get("followers");
	return state.mergeIn(["followers"], followerMap.merge(userMap));
}

export function setTweet(state, tweetEntry) {
	const [user, tweet] = getUserAndTweet(tweetEntry);
	const userState = addUserToTweetList(state, user);
	const tweetState = addTweet(userState, user, tweet);
	return tweetState.updateIn(["numTweets"], t => t + 1);
}

// Strip users and tweets from an entry. Remove whitespace.
function getUserAndTweet(tweetEntry) {
	return tweetEntry.split(">").map(str => str.trim());
}

// Adds a user to the tweet list if they do not already exist.
function addUserToTweetList(state, user) {
	if(!state.get("tweets").has(user)) {
		return state.setIn(["tweets", user], List());
	} else {
		return state;
	}
}

// Appends a tweet to a user's tweet list.
function addTweet(state, user, tweet) {
	const tweetId = state.get("numTweets");
	const userTweet = Map.of(tweetId.toString(), tweet);
	const tweetList = state.getIn(["tweets", user]).push(userTweet);
	return state.setIn(["tweets", user], tweetList);
}

// Returns an immutable object of all tweets and follower's tweets in the correct order.
export function getAllTweets(state) {
	const users = state.getIn(["followers"]).keySeq();
	const usersWithFollowers = users.map(usr => {
		return Map.of(usr, List(state.getIn(["followers", usr])).insert(0, usr));
	});
	/**
	* userWithFollowers now contains a sequence of maps. Each user is the key 
	* and the followers are the value (with the user prepended as the first follower)
	* My technique is to now replace each follower by their tweets.
	*/
	const userTweets = usersWithFollowers.toList().map(entry => {
		// User name 					: entry.keySeq().first() 
		// User follower list : entry.first());
		const tweetsList = entry.first().map(user => {
			return replaceFollowerWithTweets(state, user);
		});

		/**
		* Concatenate all of these maps together into a list and sort it by the tweet number. 
		* Then remove the map around the tweet.
		*/
		const formattedTweetsList = tweetsList.reduce((a,b,c) => { return a.concat(b); })
							.sortBy(a => a.keySeq().first())
							.map(tweet => tweet.first());
		
		return Map.of(entry.keySeq().first(), formattedTweetsList);
	});

	return userTweets.sortBy(a => a.keySeq().first());
}

// Replaces a follower with a map of the follower's formatted tweets with tweet numbers as keys.
function replaceFollowerWithTweets(state, follower) {
	if(state.get("tweets").has(follower)) {
		return state.getIn(["tweets", follower])
			.map(tweet => {
				return formatTweetMap(tweet, follower);
			});
	} else {
		return List();
	}
}

// Formats the text inside the tweet map with the format [@user: tweet]
function formatTweetMap(tweetMap, user) {
	return Map.of(tweetMap.keySeq().first(), `@${user}: ${tweetMap.first()}`)
}