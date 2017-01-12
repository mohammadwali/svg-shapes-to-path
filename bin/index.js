#!/usr/bin/env node --harmony

var config = require("../config");
var program = require("commander");
var glob = require("glob");
var SVGO = require("svgo");
var path = require("path");
var fs = require("fs");
var clierr = require("cli-error");
var async = require("async");
var cheerio = require("cheerio");
var replaceExt = require("replace-ext");
var svgo = new SVGO();


//setting up the version
program
    .version(config.version, config.commandOptions.version);


//adding the command to convert the svg files
program
    .command(config.commandOptions.convert.trigger)
    .description(config.commandOptions.convert.description)
    .action(function (dir, options) {
        var convertedFiles = 0;

        // options is optional
        glob(path.join(dir, config.paths.svgBlob), onGlobMatch);


        function onGlobMatch(err, files) {
            var series = [];
            var numFiles = files.length;


            if (!err) {
                if (numFiles) {
                    console.log(config.messages.found, numFiles, ( numFiles > 0 ) ? "s" : "");


                    files.forEach(function (file) {
                        series.push(function (callback) {
                            var fileName = path.basename(file);
                            var fileContent = fs.readFileSync(file, "utf8");

                            svgo.optimize(fileContent, function (result) {

                                if (!result.error) {
                                    var dataFile = replaceExt(file, ".json");
                                    var dataFileName = path.basename(dataFile);
                                    var paths = [];
                                    var $ = cheerio.load(result.data);

                                    $("path[d]").each(function () {
                                        paths.push({
                                            path: $(this).attr("d")
                                        });
                                    });


                                    fs.writeFileSync(dataFile, JSON.stringify(paths));

                                    console.log(config.messages.saved, fileName, dataFileName);

                                    convertedFiles++;
                                }

                                callback(result.error || null, {
                                    result: result,
                                    file: file
                                });
                            })

                        });
                    });


                    async.series(series, function (err, output) {
                        if (convertedFiles > 0) {
                            console.log(config.messages.completed, convertedFiles, files.length);
                        }
                    });

                }
            }

            if (files.length === 0) {
                throwError(config.errors.noFileFound, 128, [dir]).exit();
            }
        }
    });


//sending arguments
program
    .parse(process.argv);

function throwError(message, code, parameters, name) {
    var err = new clierr.CliError(message, code, parameters, name);
    err.error();
    return err;
}