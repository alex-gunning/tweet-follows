import { INITIAL_STATE, setFollowers, setTweets } from './core'

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
	  case 'SET_FOLLOWERS':
    	return setFollowers(state, action.entry);
    case 'SET_TWEETS':
    	return setTweets(state, action.entry);
  }
  return state;
}