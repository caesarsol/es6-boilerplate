## ES6 Babel Browserify Boilerplate

My personal ES6 boilerplate, to make it easy to experiment with [ES6].

It's inspired by:
 - [es6-browserify-boilerplate](https://github.com/thoughtram/es6-browserify-boilerplate)
 - [es6-babel-browserify-boilerplate](https://github.com/thoughtram/es6-babel-browserify-boilerplate)
 - [frontend-seed](https://github.com/pigoz/frontend-seed)


### Initial setup

```bash
# Clone the repo
git clone https://github.com/caesarsol/es6-boilerplate
cd es6-boilerplate

# Install dependencies
npm install

# To use global command `gulp`
npm install -g gulp
```

### Running in the browser
```bash
gulp build
gulp server

# If you wanna Gulp to re-build on every change...
gulp watch
```

### What are all the pieces involved?

#### [Babel]
Transpiles ES6 code into regular ES5 (today's JavaScript) so that it can be run in a today browser. Like traceur but doesn't need a runtime to work. Formerly known as 6to5.

#### [CommonJS]
Babel is configured to transpile ES6 modules into CommonJS syntax and we use browserify to bundle the code into one file to deliver it to the browser.

#### [Browserify]
Browserify walks through all files and traces down all `require()`s to bundle all files together.

#### [Watchify]
Makes faster consecutive browserify builds, and emit events on files changes.

#### [Gulp]
Task runner to make defining and running the tasks simpler.



[ES6]: http://wiki.ecmascript.org/doku.php?id=harmony:specification_drafts
[Babel]: http://babeljs.io/
[CommonJS]: http://wiki.commonjs.org/wiki/CommonJS
[Browserify]: http://browserify.org/
[Gulp]: http://gulpjs.com/

