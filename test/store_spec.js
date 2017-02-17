import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import makeStore from '../src/store';

describe('redux store', () => {
	it('works with a reducer', () => {

		const store = makeStore();
		store.dispatch({ type: "notAnAction" });

		expect(store.getState()).to.equal(fromJS({
																							"followers":{},
																							"tweets":{}
																							}));
	});
});