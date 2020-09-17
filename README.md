# FullStack mqtt server/client integration with Aedes, MongoDB and NodeJS 

This repo contains 4 projects. 
* A device simulator (/device)
* An mqtt broker (/server)
* An api enpoint (/api)
* A user interface

for connecting the broker you need to create, you need to send a post request to the api 
for createing tokens. You can use this.

`curl -d '{"email":"new_user@h.com","password":"1559"}'  -H "Content-Type: application/json" -X POST http://localhost:8080/api/users`

Returned email and password can be used as clientId and token.
Of course this requeires mongod active

If you just want to test it you can use hard coded token and deviceId's


- {'clientId': 'tester9000', 'token':'allow'},
- {'clientId': 'tester9001', 'token':'allow'},
- {'clientId': 'tester9002', 'token':'allow'},
- {'clientId': 'tester9003', 'token':'allow'}


### example server/broker startup
`node server # for nodemon` 

### example client startup
`node device/client.js 4 localhost 1883 tester9000 allow`

### example api startup
`npm run dev # for nodemon`


### Routes
To see all api routes/urls check routes.js at api/routes.js


### FrontEnd 
Frontend is currently not complete and stands for just to prove auth is working in the api.
cookies hold as httpOnly and testing it at frontend is easier. 
Auth is currenly closed for curl to work on and can be opened by turning IS_AUTH_ON variable true at api/routes.js

### Testing
For testing 
* use Postman or equivalent for api
* for broker use client.js
* for MongoDB use compass
* for ui don't