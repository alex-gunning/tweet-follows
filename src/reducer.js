import { INITIAL_STATE, setFollowers, setTweet, getAllTweets } from './core'

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
	  case 'SET_FOLLOWERS':
    	return setFollowers(state, action.entry);
    case 'SET_TWEET':
    	return setTweet(state, action.entry);
    case 'GET_TWEETS':
    	return getAllTweets(state);
  }
  return state;
}