// utility to cache responses from services
// helpful when running a long series of calls to external APIs and you need to be able to recover from a runtime failure

var mkdirp = require('mkdirp');
var path = require("path");
var winston = require("winston");
var fs = require("fs");

module.exports = function(cache_dir) {
    mkdirp.sync(cache_dir);
    return {
        check: function(id, cb) {
            var cache_loc = path.join(cache_dir, id);
            fs.stat(cache_loc, function(err, stats) {
                if (!err && stats.isFile() ) {
                    winston.debug("retrieving results from existing cache for: " + id);
                    fs.readFile(cache_loc, function(err, file) {
                        if (!err) {
                            try {
                                var data = JSON.parse(file);
                                winston.verbose("using cached results " + cache_loc);
                                cb(null, JSON.parse(file));
                            } catch (err) {
                                winston.warn("cached results " + cache_loc+ " are corrupted -- deleting");
                                fs.unlink(cache_loc, function(err) {
                                    if (err) winston.error("could not delete corrupted cache file: " + cache_loc);
                                });
                                cb(err);
                            }
                        } else {
                            winston.error("errror while retrieving id from cache: " + JSON.stringify(err));
                            cb(err);
                        }
                    });
                } else {
                    cb();
                }
            });
        },
        save: function(id, data, cb) {
            var cache_loc = path.join(cache_dir, id);
            fs.writeFile(cache_loc, JSON.stringify(data), function(err) {
                if (err) winston.error("error while saving results to cache: " + JSON.stringify(err));
                else winston.verbose("saved results to cache loc: " + cache_loc);
                if (cb) cb(err);
            }); 
        }
    };
};
