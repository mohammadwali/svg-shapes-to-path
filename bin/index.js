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
var svgo = new SVGO(config.svgo);


//setting up the version
program
    .version(config.version, config.commandOptions.version);


//adding the command to convert the svg files
program
    .command(config.commandOptions.convert.trigger)
    .option("-f, --isFile", "When need to convert only an svg file")
    .description(config.commandOptions.convert.description)
    .action(convertSvg);


//sending arguments
program
    .parse(process.argv);


////////////////////////////
function convertSvg(dir, options) {
    var convertedFiles = 0;
    var globSrc = options.isFile ? dir : path.join(dir, config.paths.svgBlob);

    glob(globSrc, onGlobMatch);

    function onGlobMatch(err, files) {
        var series = [];
        var numFiles = files.length;

        if (!err && numFiles) {
            console.log(config.messages.found, numFiles, ( numFiles > 0 ) ? "s" : "");

            files.forEach(convertFilesForSeries);

            async.series(series, onDone);

        } else {
            throwError(config.errors.noFileFound, 128, [dir]).exit();
        }

        function convertFilesForSeries(file) {

            series.push(seriesFn);

            function seriesFn(callback) {
                var fileContent = fs.readFileSync(file, "utf8");

                svgo.optimize(fileContent, onOptimizeDone);


                function onOptimizeDone(result) {
                    if (!result.error) {
                        extractAndWritePaths(file, result.data);

                        convertedFiles++;
                    }

                    callback(result.error || null, {
                        result: result,
                        file: file
                    });
                }
            }
        }


        function onDone(err, output) {
            if (convertedFiles > 0) {
                console.log(config.messages.completed, convertedFiles, files.length);
            }
        }
    }

}


function extractAndWritePaths(file, svgData) {
    var paths = [];
    var $ = cheerio.load(svgData);
    var fileName = path.basename(file);
    var dataFile = replaceExt(file, ".json");
    var dataFileName = path.basename(dataFile);

    $("path[d]").each(function () {
        paths.push({
            path: $(this).attr("d")
        });
    });

    fs.writeFileSync(dataFile, JSON.stringify(paths));

    console.log(config.messages.saved, fileName, dataFileName);

    return paths;
}


function throwError(message, code, parameters, name) {
    var err = new clierr.CliError(message, code, parameters, name);
    err.error();
    return err;
}