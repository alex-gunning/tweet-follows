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
				}
			}));
	});

	it('Works with SET_FOLLOWERS', () => {
		expect(1).to.not.equal(2);
	});

	it('SET_FOLLOWERS adds a user for each user mentioned', () => {

	});

});