'use strict';

var Ractive = require('hive-modal')
var emitter = require('hive-emitter')

var defaults = {
  error: {
    error: true,
    title: 'Whoops!'
  },
  info: {
    warning: true,
    title: 'Just saying...'
  }
}

function openModal(type, data){
  data = data || {}
  data.error = defaults[type].error
  data.warning = defaults[type].warning
  data.title = data.title || defaults[type].title
  data.type = type

  data.href = data.href
  data.linkText = data.linkText

  var ractive = new Ractive({
    el: document.getElementById('flash-modal'),
    partials: {
      content: require('./content.ract').template
    },
    data: data
  })

  return ractive
}

function showError(data) {
  return openModal('error', data)
}

function showInfo(data) {
  return openModal('info', data)
}

module.exports = {
  showError: showError,
  showInfo: showInfo
}
