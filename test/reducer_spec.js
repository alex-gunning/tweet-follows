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

	it('SET_FOLLOWERS replaces the user\'s follower list if it exists', () => {
		const action = {type:'SET_FOLLOWERS', entry:'John follows Penny, Clinton'};
		const state = fromJS({
			"followers":{
				"Clinton":["Wayne", "Zane"],
				"John":["Penny"],
				"Michael":["Clinton"],
				"Penny":[],
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
				"John":["Clinton", "Penny"],
				"Michael":["Clinton"],
				"Penny":[],
				"Wayne":[],
				"Zane":[],
			},
			"numTweets":0,
			"tweets":{}
		}));
	});

	it('SET_FOLLOWERS arranges user map and follower list alphabetically', () => {
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

	it('SET_TWEET creates an initial state', () => {
		const action = {type:'SET_TWEET', entry:'Emma> We never really understand anything.'};
		const state = reducer(undefined, action);

		expect(state).to.equal(fromJS({
			"followers":{},
			"numTweets":1,
			"tweets": {
				"Emma":[{"0":"We never really understand anything."}]
			}
		}));
	});

	it('SET_TWEET adds a tweet to a user in the tweet list', () => {
		const action = {type:'SET_TWEET', entry:'Emma> We simply get more used to it.'};
		const initialState = fromJS({
			"followers":{},
			"numTweets":1,
			"tweets": {
				"Emma":[{"0":"We never really understand anything."}]
			}
		});
		const state = reducer(initialState, action);

		expect(state).to.equal(fromJS({
			"followers":{},
			"numTweets":2,
			"tweets": {
				"Emma":[{"0":"We never really understand anything."},{"1":"We simply get more used to it."}]
			}
		}));
	});

	it('SET_TWEET can be used multiple times.', () => {

		const firstAction = {type:'SET_TWEET', entry:'Emma> We never really understand anything.'};
		const firstState = reducer(undefined, firstAction);

		const secondAction = {type:'SET_TWEET', entry:'Alex> What what?'};
		const secondState = reducer(firstState, secondAction);

		const thirdAction = {type:'SET_TWEET', entry:'Emma> We simply get more used to it.'};
		const thirdState = reducer(secondState, thirdAction);

		expect(thirdState).to.equal(fromJS({
			"followers":{},
			"numTweets":3,
			"tweets": {
				"Alex":[{"1":"What what?"}],
				"Emma":[{"0":"We never really understand anything."},{"2":"We simply get more used to it."}]
			}
		}));
	});

	it('GET_TWEETS returns a simulated twitter feed.', () => {
		const firstAction = {type:'SET_FOLLOWERS', entry:'Alex follows Emma'};
		const firstState = reducer(undefined, firstAction);

		const secondAction = {type:'SET_TWEET', entry:'Emma> We never really understand anything.'};
		const secondState = reducer(firstState, secondAction);

		const thirdAction = {type:'SET_TWEET', entry:'Alex> Oh really?'};
		const thirdState = reducer(secondState, thirdAction);

		const forthAction = {type:'SET_TWEET', entry:'Emma> We simply get more used to it.'};
		const initialState = reducer(thirdState, forthAction);

		const action = {type:'GET_TWEETS'};
		const finalState = reducer(initialState, action);

		expect(finalState).to.equal(fromJS([
			{
				"Alex": [	"@Emma: We never really understand anything.",
									"@Alex: Oh really?",
									"@Emma: We simply get more used to it."],
			},
			{
				"Emma": [	"@Emma: We never really understand anything.",
									"@Emma: We simply get more used to it."]
			}
		]));
	});

	it('GET_TWEETS\'s simulated twitter is in alphabetical order.', () => {
		const firstAction = {type:'SET_FOLLOWERS', entry:'Alex follows Emma'};
		const firstState = reducer(undefined, firstAction);

		const secondAction = {type:'SET_TWEET', entry:'Emma> We never really understand anything.'};
		const secondState = reducer(firstState, secondAction);

		const thirdAction = {type:'SET_TWEET', entry:'Alex> Oh really?'};
		const thirdState = reducer(secondState, thirdAction);

		const forthAction = {type:'SET_TWEET', entry:'Emma> We simply get more used to it.'};
		const forthState = reducer(thirdState, forthAction);

		const fifthAction = {type:'SET_TWEET', entry:'Clint> Functional programming is easy!'};
		const fifthState = reducer(forthState, fifthAction);

		const sixthAction = {type:'SET_TWEET', entry:'Alex> No it\'s not!'};
		const sixthState = reducer(fifthState, sixthAction);

		const seventhAction = {type:'SET_FOLLOWERS', entry:'Emma follows Clint'};
		const seventhState = reducer(sixthState, seventhAction);

		const eighthAction = {type:'SET_FOLLOWERS', entry:'Clint follows Alex'};
		const eightState = reducer(seventhState, eighthAction);

		const action = {type:'GET_TWEETS'};
		const finalState = reducer(eightState, action);

		expect(finalState).to.equal(fromJS([
			{
				"Alex": [	"@Emma: We never really understand anything.",
									"@Alex: Oh really?",
									"@Emma: We simply get more used to it.",
									"@Alex: No it's not!"],
			},
			{
				"Clint": ["@Alex: Oh really?",
									"@Clint: Functional programming is easy!",
									"@Alex: No it's not!"]
			},
			{
				"Emma": [	"@Emma: We never really understand anything.",
									"@Emma: We simply get more used to it.",
									"@Clint: Functional programming is easy!"]
			}
		]));
	});

});