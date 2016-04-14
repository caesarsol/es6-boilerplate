import $ from 'jquery'
import keyboard from 'keyboardjs/index'

window.$ = $

$.fn.zIndex = function (fn) {
  this.each((i, el) => {
    let zindex = Number($(el).css('z-index'))

    let new_zindex = fn(zindex)

    if (new_zindex !== null) {
      $(el).css({zIndex: new_zindex})
    }

    return this
  })
}

$.fn.zIndexDec = function () {
  this.zIndex((zindex) => {
    if (isNaN(zindex)) {
      console.warn('Cannot decrement z-index', zindex)
      return
    }
    return zindex - 1
  })
  return this
}

let keys = ['a', 's', 'd']

// let all = keys.map((key) => {})

keys.forEach((key) => {
  keyboard.bind(key, (event) => {
    console.log('Keypress', key)

    let all = $(`.js-triggered`)
    let me = $(`.js-triggered[data-triggered-by=${key}]`)
    let others = $(`.js-triggered[data-triggered-by!=${key}]`)

    me.find('video').prop('muted', false)
    others.find('video').prop('muted', true)

    all.zIndexDec()
    me.css({opacity: 0, zIndex: 1}).animate({opacity: 1}, () => {
      others.css({opacity: 0, zIndex: 0})
    })
  })
})

$(document).bind('load', (event) => {
  let all = $(`.js-triggered`)
  all.css({opacity: 0, zIndex: 0})
})

keyboard.on(keys, (event) => {
  // play all
  $(`.js-triggered video`).each((i, vid) => vid.play())
})

keyboard.on('space', (event) => {
  // play all
  $(`.js-triggered video`).each((i, vid) => vid.pause())
})
