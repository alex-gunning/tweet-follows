import {List, Map} from 'immutable';

export const INITIAL_STATE = Map({
																	"followers":Map(),
																	"tweets":Map()
																});

export function setFollowers(state, followerEntry) {
	const [user, followers] = getUserAndFollowers(followerEntry);
	const userState = addUser(state, user);
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
function addUser(state, user) {
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


export function setTweets(state, tweetEntry) {
	// Skeleton
}