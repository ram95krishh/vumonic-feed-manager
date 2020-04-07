# vumonic-feed-manager

A NodeJS service that handles posts and users data of the VumonicApp. Also deals with comments and likes of the posts.

# Installation

Make sure Git-cli and NPM are installed and then execute the following comments
```
        $ git clone https://github.com/ram95krishh/vumonic-feed-manager.git
        $ cd vumonic-feed-manager
        $ npm install
```
Update local environmental variables in a .env file in the root folder.
Now start the service with the following command
```
        $ npm start
```

### Assumptions handled

Hoping at least one user is signed into the VumonicApp, the script inside /scripts folder is executed that calls the endpoint {service_url}/posts/inject

- This endpoint in turn calls https://jsonplaceholder.typicode.com/posts
- Which returns a set of 100 posts all of which are injected to a Mongo backend 'Posts" collection, with the first user onboarded as the author for all the posts.
- Likes and Comments are left empty at injection.

# User related APIs
### {}/users/onboard - POST
```
    REQ: {
        "firsName": "...",
        "lastName": "...",
        "email": ".....",
        "picture": ""
    }
    
    RES: {
        "firsName": "...",
        "lastName": "...",
        "email": ".....",
        "picture": "",
        "_id": "Mongoose Obj Id"
    }
```

### {}/get_by_email/:email - GET

```
    REQ: include "email" in req paramas
    RES: {
        "firsName": "...",
        "lastName": "...",
        "email": ".....",
        "picture": "",
        "_id": "Mongoose Obj Id"
    }
```

# Post related APIs

### {}/posts/inject - GET

- Already explained under 'Assumptions'
- RES: "Success"

### {}/posts/get_feed - POST

```
    REQ: {
        userId: "xxxxx",
        page: 0,
        count: 20
    }
    
    RES: [{
        "id": 1,
        "title": "sunt aut facere",
        "body": "quia et suscip....",
        "author": {
            "picture": "....",
            "firstName": "Fname",
            "lastName": "LN",
            "email": "xxxxxxx@abc.com"
        },
        "publishedDate": "2020-04-03T08:32:03.617Z",
        "likesCount": 2,
        "commentsCount": 14,
        "isLiked": true
    }, {...}, {...}]
```

### {}/posts/get_likes_by_id - POST

```
    REQ: {
        "postId": 1,
        "skip": 2,        // (page)
        "count": 20
    }
    
    RES: [{
        "picture": "....",
        "firstName": "Fname",
        "lastName": "LN",
        "email": "xxxxxxx@abc.com"
    }, {...}]
```

### {}/posts/get_comments_by_id - POST

```
    REQ: {
        "postId": 1,
        "skip": 2,        // (page)
        "count": 20
    }
    
    RES: [{
        "body": "...."
        "createdOn": "Date"
        "user": {
            "picture": "....",
            "firstName": "Fname",
            "lastName": "LN",
            "email": "xxxxxxx@abc.com"
        }
    }, {...}]
```

#### Some libraries used:

* [ExpressJS] - fast node.js network app framework
* [ramdaJs] - A practical functional library for JS Programmers
* [MongooseJs] - A MongoDB object modeling tool designed to work in an asynchronous 
* [Joi] - The most powerful schema description language and data validator for JS (used for .env variables validation in the project)


   [ExpressJS]: <https://github.com/expressjs/express>
   [ramdaJs]: <https://ramdajs.com/docs/>
   [MongooseJs]: <https://github.com/Automattic/mongoose>
   [Joi]: <https://hapi.dev/module/joi/>
