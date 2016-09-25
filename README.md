# api-cacher

api-cacher is a (currently) very small helper to cache the response (only JSON) of APIs and check for them.

It works by storing the response on the filesystem in a directory specific to the API call. You must assign an ID that becomes the name of the file stored. This ID is used to check if the response already exists.

## Setup (per API call)

```javascript
const cache_directory = './tmp/cache';
var cacher = require("api-cacher")(cache_directory);
```

## Using

```javascript
var id = '1121' // some unique ID for the data you need.
cacher.check(id, function(err, results) {
    if (!err && results) {
        // great don't need to make an API call
    } else {
        // need to make an API call
        apiCall(function(err, results) {
            cacher.save(id, response)
        });
    }
});
```

