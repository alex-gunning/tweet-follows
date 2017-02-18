import Promise from 'promise';
import makeStore from './src/store';
import readFileAsync from './src/file_reader';
import writeTweetsToConsole from './src/console_writer';

export const store = makeStore();

// Invoke file reader promises from command-line arguments.
Promise.all([readFileAsync(`data/${process.argv[2]}`), readFileAsync(`data/${process.argv[3]}`)])
.then(data => {
	data[0].split("\r\n").slice(0,2).forEach(value => {
		store.dispatch({type:"SET_FOLLOWERS", entry:value});
	});
	data[1].split("\r\n").slice(0,3).forEach(value => {
		store.dispatch({type:"SET_TWEET", entry:value});
	});
	store.dispatch({type:'GET_TWEETS'});

	writeTweetsToConsole(store.getState());
}).catch(err => {
	console.error(err);
});