import Promise from 'promise';
import makeStore from './src/store';
import readFileAsync from './src/file_reader'

export const store = makeStore();

Promise.all([readFileAsync(`data/${process.argv[2]}`), readFileAsync(`data/${process.argv[3]}`)])
.then(data => {
	data[0].split("\r\n").slice(0,2).forEach(value => {
		store.dispatch({type:"SET_FOLLOWERS", entry:value});
	});
	
	data[1].split("\r\n").slice(0,3).forEach(value => {
		store.dispatch({type:"SET_TWEET", entry:value});
	});

	store.dispatch({type:'GET_TWEETS'});
	console.log(store.getState());
	
}).catch(err => {
	console.error(err);
});