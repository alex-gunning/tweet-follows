import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../src/reducer';

describe('reducer', () => {
	it('SET_FOLLOWERS creates an initial state', () => {
		const action = {type:'SET_FOLLOWERS', entry:'John follows Michael'};
		const nextState = reducer(undefined, action);

		expect(nextState).to.equal(fromJS({
				"followers":{
					"John":["Michael"],
					"Michael":[]
				},
				"numTweets":0,
				"tweets":{}
			}));
	});

	it('SET_FOLLOWERS adds a user for each user in the follower list', () => {
		const action = {type:'SET_FOLLOWERS', entry:'John follows Michael, Clinton'};
		const state = fromJS({
			"followers":{
				"Ben":[],
				"Michael":[]
			},
			"numTweets":0,
			"tweets":{}
		});
		const nextState = reducer(state, action);

		expect(nextState).to.equal(fromJS({
			"followers":{
				"Ben":[],
				"Clinton":[],
				"John":["Clinton", "Michael"],
				"Michael":[]
			},
			"numTweets":0,
			"tweets":{}
		}));
	});

	it('SET_FOLLOWERS follower list does not modify the user list', () => {
		const action = {type:'SET_FOLLOWERS', entry:'John follows Michael, Clinton'};
		const state = fromJS({
			"followers":{
				"Clinton":["Wayne", "Zane"],
				"Michael":["Clinton"],
				"Wayne":[],
				"Zane":[],
			},
			"numTweets":0,
			"tweets":{}
		});
		const nextState = reducer(state, action);

		expect(nextState).to.equal(fromJS({
			"followers":{
				"Clinton":["Wayne", "Zane"],
				"Michael":["Clinton"],
				"Wayne":[],
				"Zane":[],
				"John":["Clinton", "Michael"]
			},
			"numTweets":0,
			"tweets":{}
		}));
	});

	it('SET_FOLLOWERS arranges user and follower list alphabetically', () => {
		const action = {type:'SET_FOLLOWERS', entry:'John follows Clinton, Betty, Kelly'};
		const state = fromJS({
			"followers":{
				"Alex":[],
				"Mike":["Alex", "Wayne"],
				"Wayne":[]
			},
			"numTweets":0,
			"tweets":{}
		});
		const nextState = reducer(state, action);

		expect(nextState).to.equal(fromJS({
			"followers":{
				"Alex":[],
				"Betty":[],
				"Clinton":[],
				"John":["Betty", "Clinton", "Kelly"],
				"Kelly":[],
				"Mike":["Alex", "Wayne"],
				"Wayne":[]
			},
			"numTweets":0,
			"tweets":{}
		}));
	});

	it('SET_FOLLOWERS can be used multiple times', () => {
		const firstAction = {type:'SET_FOLLOWERS', entry:'John follows Clinton'};
		const firstState = reducer(undefined, firstAction);

		const secondAction = {type:'SET_FOLLOWERS', entry:'Clinton follows Mike'};
		const secondState = reducer(firstState, secondAction);

		const thirdAction = {type:'SET_FOLLOWERS', entry:'Mike follows John'};
		const thirdState = reducer(secondState, thirdAction);

		expect(thirdState).to.equal(fromJS({
			"followers": {
				"Clinton":["Mike"],
				"John":["Clinton"],
				"Mike":["John"]
			},
			"numTweets":0,
			"tweets":{}
		}));
	});

	it('SET_TWEETS creates an initial state', () => {
		const action = {type:'SET_TWEET', entry:'Emma> Hello world!.'};
		const state = reducer(undefined, action);

		expect(state).to.equal(fromJS({
			"followers":{},
			"numTweets":1,
			"tweets": {
				"Emma":[{"0":"Hello world!."}]
			}
		}));
	});

	it('SET_TWEETS adds a tweet to a user in the tweet list', () => {
		
	});

});