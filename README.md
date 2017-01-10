# 3780 Networking Project
## Fall 2016, University of Lethbridge
### Lukas Grasse and Tyler Churchill

## About

This client-server model allows for messages to be sent between between clients using multiple servers.
The server implements the flooding routing algorithim. Each server can communicate with server +-1 in the networks topology.


## How to install/run

1. Install Node
	..* [Linux](https://nodejs.org/en/download/package-manager/)
	..* [Mac/Windows](https://nodejs.org/en/download/)

2. Install project dependencies

(while inside your project directory)

```
npm install

```

## Running the server

(while inside your project directory)


```
node server.js 1

```

Where 1 is the first server (replace with 2, 3, 4, 5 depending on the server you want to create)

You can also set the host address. eg:

```
node server.js 127.0.0.1 1

```


## Running the client

(while inside your project directory)

```
node client.js 1

```

Where 1 is the server number the client will connect to (replace with 2, 3, 4, 5 depending on the server you want to connect to)

friendId: the id of the client you wish to communicate with
id: your id.

You can also set the host address. eg:

```
node client.js 127.0.0.1 1
```






