import {List, Map} from 'immutable';

export const INITIAL_STATE = Map();

export function setFollowers(state, followerEntry) {
	const [user, followers] = getUserAndFollowers(followerEntry);
	return addFollowersAsUsers(addFollowers(addUser(addFollowerStructure(state), user), user, followers), followers);
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
	let users = Map();
	for(let i = 0 ; i < followers.length; i++) {
		if(!state.get("followers").has(followers[i])) {
			users = users.setIn([followers[i]], List());
		}
	}
	return state.mergeIn(["followers"], users);
}


export function setTweets(state, tweetEntry) {
	// Skeleton
}