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

// Adds the follower structure existance to the state
function addFollowerStructure(state) {
	if(!state.hasIn(["followers"])) {
		return state.setIn(["followers"], Map());
	} else {
		return state;
	}
}

// Strip users and followers from an entry. Remove whitespace.
function getUserAndFollowers(followerEntry) {
	const users = followerEntry.split("follows").map(str => str.trim());
	return [users[0], users[1].split(",").map(str => str.trim())];
}

// Adds a user to the follower map with a blank follower list if they don't already exist.
function addUserToFollowerList(state, user) {
	if(!state.get("followers").has(user)) {
		return state.setIn(["followers", user], List());
	} else {
		return state;
	}
}

// Adds a follower list to a user.
function addFollowers(state, user, followers) {
	const followerList = state.get("followers").get(user).push(...followers);
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

function getUserAndTweet(tweetEntry) {
	return tweetEntry.split(">").map(str => str.trim());
}

function addUserToTweetList(state, user) {
	if(!state.get("tweets").has(user)) {
		return state.setIn(["tweets", user], List());
	} else {
		return state;
	}
}

function addTweet(state, user, tweet) {
	const tweetId = state.get("numTweets");
	const userTweet = Map.of(tweetId.toString(), tweet);
	const tweetList = state.getIn(["tweets", user]).push(userTweet);
	return state.setIn(["tweets", user], tweetList);
}