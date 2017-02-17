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
			}
		});
		const nextState = reducer(state, action);

		expect(nextState).to.equal(fromJS({
			"followers":{
				"Clinton":["Wayne", "Zane"],
				"Michael":["Clinton"],
				"Wayne":[],
				"Zane":[],
				"John":["Clinton", "Michael"]
			}
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
			"tweets":{}
		}));
	});

	it('SET_FOLLOWERS can be used multiple times', () => {
		// Stub
	});

});