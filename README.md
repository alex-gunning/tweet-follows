# tweet-follows
Coding assignment for Allan Gray

Assumptions: 
	There could be more data.
	Usernames are unique.
	Data is always well-formed.
	Users will not follow other users more than once.
	Users will not follow themselves.
	Delimiters are not used in the actual data.
	Newer data in user.txt reflects the current state of the user's followees.

Questions:
	If a user does not appear in the follower list file, are their tweets ignored?

Instructions:
	Assuming NodeJS and npm are installed:
		Install with `npm install`
		Run with `npm run start user.txt tweet.txt`
		Run tests with `npm run test`