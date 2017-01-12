#!/usr/bin/env node --harmony

var program = require("commander");
var glob = require("glob");
var SVGO = require("svgo");
var path = require("path");
var fs = require("fs");
var clierr = require("cli-error");
var async = require("async");


var svgo = new SVGO({
    multipass: true,
    pretty: true,
    precision: 2,
    full: true,
    plugins: [{"cleanupAttrs": true}, {"cleanupEnableBackground": true}, {"cleanupIDs": true}, {"cleanupListOfValues": true}, {"cleanupNumericValues": true}, {"collapseGroups": true}, {"convertColors": true}, {"convertPathData": true}, {"convertShapeToPath": true}, {"convertStyleToAttrs": true}, {"convertTransform": true}, {"moveElemsAttrsToGroup": true}, {"moveGroupAttrsToElems": true}, {"removeComments": true}, {"removeDesc": true}, {"removeDimensions": true}, {"removeDoctype": true}, {"removeEditorsNSData": true}, {"removeEmptyAttrs": true}, {"removeEmptyContainers": true}, {"removeEmptyText": true}, {"removeHiddenElems": true}, {"removeMetadata": true}, {"removeNonInheritableGroupAttrs": true}, {"removeRasterImages": true}, {"removeTitle": true}, {"removeUnknownsAndDefaults": true}, {"removeUselessDefs": true}, {"removeUnusedNS": true}, {"removeUselessStrokeAndFill": true}, {"removeXMLProcInst": true}, {"sortAttrs": true}, {"transformsWithOnePath": true}]
});


//setting up the version
program
    .version("1.0.0", "-V, --version");


//adding the command to convert the svg files
program
    .command("convert <dir>")
    .description("Convert the svg files shapes into path elements")
    .action(function (dir, options) {
        var convertedFiles = 0;

        // options is optional
        glob(path.join(dir, "**/*.svg"), onGlobMatch);


        function onGlobMatch(err, files) {
            var series = [];


            if (!err) {
                if (files.length) {
                    console.log(files);


                    files.forEach(function (file) {
                        series.push(function (callback) {
                            var fileContent = fs.readFileSync(file, "utf8");

                            svgo.optimize(fileContent, function (result) {

                                if (!result.error) {

                                    fs.writeFileSync(
                                        path.join(path.dirname(file), path.basename(file) + "_test.svg"), result.data
                                    );

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
                        console.log(err, output[0].result);

                        if (convertedFiles > 0) {
                            console.log("Converted %s of %s files", convertedFiles, files.length);
                        }
                    });

                }
            }

            if (files.length === 0) {
                return throwError('fatal: No svg file(s) were found in the given dir %s', 128, [dir]).exit();
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