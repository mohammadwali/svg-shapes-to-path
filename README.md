# SVG shapes to path

CLI tool build to manipulate multiple svg files, it optimizes and compresses the svg file and converts all the shapes to path elements using [SVGO](https://github.com/svg/svgo), when done it creates a json file with the converted path data.


### Installing

```shell
$ npm i mohammadwali/svg-shapes-to-path -g
```

### Converting files

```shell
$ svgShapesToPath convert ./mySvgFilesRoot
```

### Converting Single file

```shell
$ svgShapesToPath convert ./myfile.svg -f
```
