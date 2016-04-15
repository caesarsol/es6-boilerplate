const _ = require('lodash');
const moment = require('moment');
const d3 = require('d3');

//Object.prototype.inspect = function(fn = (x => x)) { console.log(fn(this)); return this; };

class JSONCache {
  static VERSION = 1;

  static setKey(key, val) {
    let data = {
      content: val,
      meta: {
        version: JSONCache.VERSION,
        expires: moment().add(5, 'minutes'),
      },
    }
    window.localStorage.setItem(key, JSON.stringify(data))
    return true
  }

  static getKey(key) {
    let cached = window.localStorage.getItem(key);
    if (cached === null) return null
    let data = JSON.parse(cached)
    if (data.meta.version !== JSONCache.VERSION || moment().isAfter(data.meta.expires)) {
      window.localStorage.removeItem(key)
      return null
    }
    return data.content
  }
};

const repos = [
  'clojure/clojurescript',
  'facebook/react',
  'Homebrew/homebrew',
  'torvalds/linux',
];

repos.map(fetchContributors).forEach(fetchedRepo => {
  fetchedRepo.then(({name: repoName, contributors: list}) => {
    const graphData = list.map((e, i) => ({y: e.percent, x: i, user: e.login}) );
    const info = busFactors(list);
	  drawRepoGraph(graphData, repoName, info);
	});
});

function userRepoContributions(user) {
  // deletions are more valuable, because they imply refactorings and/or
  // better understanding of the codebase
  return user.weeks.reduce((accu, n) => {
    const timestamp = parseInt(n.w);
    const week = moment.unix(timestamp);
    const reference = moment().subtract(1, 'year');
    const diff = moment.duration(week.diff(reference)).months();
    const coeff = diff < 1 ? 0.5 : Math.exp(diff / 4);
    return accu + (n.a + n.c + n.d * 2) * coeff;
  }, 0);
}

function biggestContributions(contribs) {
  const stats = contribs.map((user) => ({
    login: user.author.login,
    contributions: userRepoContributions(user)
  }));

  const sorted = _(stats).sortBy('contributions').reverse().value();
  const sum = _.sum(sorted.map(x => x.contributions));

  const biggest = sorted.map(x => {
    x.percent = (x.contributions * 100.0 / sum);
    return x;
  }).reduce((accu, u) => {
    if (accu.tot < 90) {
  	  accu.list.push(u)
   	 accu.tot += u.percent
    }
    return accu;
  }, {tot: 0, list: []});

  console.log(biggest);
  return biggest.list;
}

function fetchContributors(repo) {
  const url = `https://api.github.com/repos/${repo}/stats/contributors`;

  let cached = JSONCache.getKey(url);
  if (cached !== null) {
    console.log("Cached!", cached)
    return Promise.resolve(cached);
  }

  return window.fetch(url)
    .then((res) => res.json())
    .then((json) => {
  		if (typeof json.map !== 'function')
        throw Error(`Malformed JSON: ${JSON.stringify(json)}`)

  		return {name: repo, contributors: biggestContributions(json)};
		})
    .then(json => {
    	JSONCache.setKey(url, json);
      return json;
    });
}

function busFactors(contribs) {
  let percents = contribs.map(e => e.percent)
  let avg = average(percents)
  let std = standardDeviation(percents)
  let aboveAvg = percents.filter(v => v >= avg)
  let supSquareDiffs = aboveAvg.map(v => Math.pow(v - avg, 2))
  let supStd = _.sum(supSquareDiffs) / (aboveAvg.length - 1)
  let mattiazFactor = 100 / supStd

  console.log('aboveAvg', aboveAvg)
  console.log('supSquareDiffs', supSquareDiffs)
  console.log('supStd', supStd)
  console.log('mattiazFactor', mattiazFactor)

  return `
  Avg: ${avg.toFixed(2)}
  Std: ${std.toFixed(2)}
  SupStd: ${supStd.toFixed(2)}
  MattiazFactor: ${mattiazFactor.toFixed(2)}
  `
}

function standardDeviation(values){
  var avg = average(values);

  var squareDiffs = values.map(function(value){
    var diff = value - avg;
    var sqrDiff = Math.pow(diff, 2);
    return sqrDiff;
  });

  var avgSquareDiff = average(squareDiffs);

  return Math.sqrt(avgSquareDiff);
}

function average(data){
  return _.sum(data) / data.length;
}

function drawRepoGraph(data, name, info) {
  const margin = {top: 40, right: 50, bottom: 100, left: 30}
  let svgWidth = 200
  let svgHeight = 200
  let width = svgWidth - margin.left - margin.right
  let height = svgHeight - margin.top - margin.bottom

  var x = d3.scale.linear()
      .domain([d3.min(data, d => d.x), d3.max(data, d => d.x)])
      .range([0, width]);

  var y = d3.scale.linear()
      .domain([d3.min(data, d => d.y), d3.max(data, d => d.y)])
      .range([height, 0]);

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom");

  var svg = d3.select("body")
    .append("svg")
      .attr("width", svgWidth*1.5)
      .attr("height", svgHeight*1.5)
      .attr("viewBox", `0 0 ${svgWidth} ${svgHeight}`)
    .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

  var bar = svg.selectAll(".bar")
      .data(data)
    .enter().append("g")
      .style("fill", "#B4B4D6")
      .attr("transform", d => `translate(${x(d.x)}, ${y(d.y)})`);

  bar.append("rect")
      .attr("x", 1)
      .attr("width", width/data.length - 1)
      .attr("height", d => height - y(d.y));

	svg.append("text")
    .style("fill", "#7A7A94")
    .style("font-family", "sans-serif")
    .style("font-size", "13px")
    .attr("transform", "translate(0, 80)")
  	.text(`${name} ${info}`)
    //.call(wrap, width - 20)
    .call(newLines)

  function newLines(text) {
    text.each(function() {
      let text = d3.select(this)
      let lines = text.text().replace(/\n\s+/g,'\n').split(/\n/)

      let y = parseFloat(text.attr("y") || 0);
      let dy = parseFloat(text.attr("dy") || 0);
      let lineHeight = 1.1; // ems

      let tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)

      lines.forEach((line, lineNumber) => {
        text
        	.append("tspan")
        	.attr("x", 0)
        	.attr("y", y)
        	.attr("dy", (lineNumber * lineHeight + dy).toFixed(2) + "em")
        	.text(line);
      })
    })
  }

  function wrap(text, width) {
    text.each(function() {
      let text = d3.select(this);
      let words = text.text().replace(/(^[\s\n]+|[\s\n]+$)/,'').split(/[\s\n]+/).reverse();
      let word;
      let line = [];
      let lineNumber = 0;
      let lineHeight = 1.1; // ems
      let y = parseFloat(text.attr("y") || 0);
      let dy = parseFloat(text.attr("dy") || 0);
      let tspan = text
        .text(null)
        .append("tspan")
        .attr("x", 0)
        .attr("y", y)
        .attr("dy", dy.toFixed(2) + "em");

      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(" "));
        if (line.length > 1 && tspan.node().getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(" "));
          line = [word];
          lineNumber++;
          tspan = text
          	.append("tspan")
          	.attr("x", 0)
          	.attr("y", y)
          	.attr("dy", (lineNumber * lineHeight + dy).toFixed(2) + "em")
          	.text(word);
        }
      }
    });
  }
}
