# tweet-follows
Coding assignment for Allan Gray

Assumptions: 
	There could be more data.
	Usernames are unique.
	Data is always well-formed.
	A user will not follow anther user more than once.
	Users will not follow themselves.
	Delimiters are not used in the actual data.
	Newer data in user.txt reflects the current state of the user's followees.
	GET_TWEETS will be the last action used as it modifies the state into an easier format for printing.
	(One could store the previous state in a variable if necessary.)

Instructions:
	Assuming NodeJS and npm are installed:
		Install with `npm install`
		Run with `npm run start user.txt tweet.txt`
		Run tests with `npm run test`

Notes:
	Due to strange line endings (possibly related to windows) the .split("\r\n") function
	returns an array of size 4, with the last element being blank. I've compensated for this
	by using .slice(0,3) in both of the read files.
	The files could quite easily be replaced with another data-source such as a network 
	interface if one were so inclined.