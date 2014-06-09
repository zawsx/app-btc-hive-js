'use strict';

// var testStorage = require('hive-custom-modernizr')
require('browsernizr/test/storage/localstorage')
var Modernizr = require('browsernizr')

console.log(Modernizr.localstorage)

var Ticker = require('hive-ticker-api').BitcoinAverage
var emitter = require('hive-emitter')
var initFrame = require('hive-frame')
var initAuth = require('hive-auth')
var initFlashModal = require('hive-flash-modal')
var walletExists = require('hive-wallet').walletExists
var fastclick = require('fastclick')

fastclick(document.getElementsByTagName("body")[0])

initFlashModal(document.getElementById('flash-modal'))
var frame = initFrame(document.getElementById('app'))
var auth = null

walletExists(function(exists){
  auth = exists ? initAuth.pin(true) : initAuth.choose()
  auth.show()
})

emitter.on('wallet-ready', function(){
  auth.hide()
  frame.show()
})

emitter.on('open-disable-pin', function(){
  initAuth.disablePin()
  frame.hide()
  auth.show()
})

emitter.on('close-disable-pin', function(){
  auth.hide()
  frame.show()
})

function updateExchangeRates(){
  var tickerUpdateInterval = 1000 * 60 * 2
  var ticker = new Ticker()

  ticker.getExchangeRates(function(err, rates){
    if(rates) emitter.emit('ticker', rates)
    window.setTimeout(updateExchangeRates, tickerUpdateInterval)
  })
}

updateExchangeRates()



