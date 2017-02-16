import {List, Map, fromJS} from 'immutable';

export const INITIAL_STATE = Map();

export function setFollowers(state, followerEntry) {
	const users = getUserAndFollowers(followerEntry);
	const followerState = addFollowerStructure(state);
	
	return addFollowersAsUsers(addFollowers(addUser(followerState, users[0]), users[0], users[1]), users[1]);
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

function addUser(state, user) {
	if(!state.get("followers").has(user)) {
		return state.setIn(["followers", user], List());
	} else {
		return state;
	}
}

function addFollowers(state, user, followers) {
	const followerList = state.get("followers").get(user).push(...followers);
	return state.setIn(["followers", user], followerList); 
}

function addFollowersAsUsers(state, followers) {
	let users = Map();
	for(let i = 0 ; i < followers.length; i++) {
		// Todo: Add check to see that user is not already in the list
		users = users.setIn([followers[i]], List());
	}
	return state.mergeIn(["followers"], users);
}


export function setTweets(state, tweetEntry) {
	// Skeleton
}