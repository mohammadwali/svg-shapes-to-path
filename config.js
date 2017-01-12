module.exports = {
    version: "1.0.0",
    paths: {
        svgBlob: "**/*.svg"
    },
    messages: {
        found: "Found %s file%s",
        saved: "Converted %s and saved as %s",
        completed: "Converted %s of %s files"
    },
    errors: {
        noFileFound: "fatal: No svg file(s) were found in the given dir %s"
    },
    commandOptions: {
        version: "-V, --version",
        convert: {
            trigger: "convert <dir>",
            description: "Convert the svg files shapes into path elements"
        }
    },
    svgo: {
        multipass: true,
        pretty: true,
        precision: 2,
        full: true,
        plugins: [
            {cleanupAttrs: true},
            {cleanupEnableBackground: true},
            {cleanupIDs: true},
            {cleanupListOfValues: true},
            {cleanupNumericValues: true},
            {collapseGroups: true},
            {convertColors: true},
            {convertPathData: true},
            {convertShapeToPath: true},
            {convertStyleToAttrs: true},
            {convertTransform: true},
            {moveElemsAttrsToGroup: true},
            {moveGroupAttrsToElems: true},
            {removeComments: true},
            {removeDesc: true},
            {removeDimensions: true},
            {removeDoctype: true},
            {removeEditorsNSData: true},
            {removeEmptyAttrs: true},
            {removeEmptyContainers: true},
            {removeEmptyText: true},
            {removeHiddenElems: true},
            {removeMetadata: true},
            {removeNonInheritableGroupAttrs: true},
            {removeRasterImages: true},
            {removeTitle: true},
            {removeUnknownsAndDefaults: true},
            {removeUselessDefs: true},
            {removeUnusedNS: true},
            {removeUselessStrokeAndFill: true},
            {removeXMLProcInst: true},
            {sortAttrs: true},
            {transformsWithOnePath: true}
        ]
    }
};