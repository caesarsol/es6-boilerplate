## ES6 Babel Browserify Boilerplate

My personal ES6 boilerplate, to make it easy to experiment with [ES6](git.io/es6features).

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
Runs an initial build, listens on your files changes, rebuilds them when necessary
and automagically reloads the browser!

```bash
gulp watch
```

### What are all the pieces involved?

#### [Babel](http://babeljs.io/)
Transpiles ES6 code into regular ES5 (today's JavaScript) so that it can be run in a today browser. Like traceur but doesn't need a runtime to work. Formerly known as 6to5.

#### [CommonJS](http://wiki.commonjs.org/wiki/CommonJS)
Babel is configured to transpile ES6 modules into CommonJS syntax and we use browserify to bundle the code into one file to deliver it to the browser.

#### [Browserify](http://browserify.org/)
Browserify walks through all files and traces down all `require()`s to bundle all files together.

#### [Watchify](https://github.com/substack/watchify)
Makes faster consecutive browserify builds, and emit events on files changes.

#### [Gulp](http://gulpjs.com/)
Task runner to make defining and running the tasks simpler.

#### [BrowserSync](http://www.browsersync.io/)
Automatically reload the browser on HTML and JS changes, injects CSS transparently.
Also synchronizes all your open browsers on the same page (scrolling, clicking, etc).

#### [SASS](http://sass-lang.com/)
Syntactically Awesome Style Sheets: Sass is an extension of CSS, adding nested rules, variables, mixins, selector inheritance, and more.
