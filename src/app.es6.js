import d3 from 'd3'

window.d3 = d3

function app() {
  const width  = 1000
  const height = 500

  let xScale = d3.scale.linear().range([height, 0])

  let svg = d3.select('body').append('svg')
      .attr('width', width)
      .attr('height', height)
    .append('g')

  let data = [2, 5, 7, 5, 2]

  xScale.domain([0, d3.min(data)])

  svg.selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .attr({
      cy: 250,
      cx: (dat, idx) => (50 + 150 * idx),
      r:  1,
    })
    .transition()
    .duration(1000)
    .attr({
      r:  (dat, idx) => (10 * dat),
    })
}

function onReady(fn) {
  if (document.readyState !== 'loading') {
    fn()
  } else {
    document.addEventListener('DOMContentLoaded', fn)
  }
}

onReady(app)
