import { INITIAL_STATE, setFollowers, setTweet } from './core'

export default function reducer(state = INITIAL_STATE, action) {
  switch (action.type) {
	  case 'SET_FOLLOWERS':
    	return setFollowers(state, action.entry);
    case 'SET_TWEET':
    	return setTweet(state, action.entry);
  }
  return state;
}