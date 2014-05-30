'use strict';

var xhr = require('hive-xhr')
var emitter = require('hive-emitter')
var db = require('hive-db')
var getWallet = require('hive-wallet').getWallet
var uriRoot = window.location.origin
var userInfo = {}

emitter.on('db-ready', function(){
  db.get(function(err, doc){
    if(err) return console.error(err);

    userInfo.name = [
      doc.userInfo.firstName,
      doc.userInfo.lastName
    ].join(' ')
    userInfo.email = doc.userInfo.email
    userInfo.id = db.userID()
    userInfo.address = getWallet().currentAddress
  })
})

function search(callback){
  getLocation(function(err, lat, lon){
    if(err) return callback(err);

    userInfo.lat = lat
    userInfo.lon = lon

    xhr({
      uri: uriRoot + "/location",
      headers: { "Content-Type": "application/json" },
      method: 'POST',
      body: JSON.stringify(userInfo)
    }, function(err, resp, body){
      if(resp.statusCode !== 200) {
        console.error(body)
        return callback(body)
      }
      callback(null, JSON.parse(body))
    })
  })
}

function remove(sync){
  xhr({
    uri: uriRoot + "/location",
    headers: { "Content-Type": "application/json" },
    method: 'DELETE',
    sync: sync,
    body: JSON.stringify({id: userInfo.id})
  }, function(err, resp, body){
    if(resp.statusCode !== 200) {
      console.error(body)
    }
  })
}

function getLocation(callback){
  if (!navigator.geolocation){
    return callback(new Error('Your browser does not support geolocation'))
  }

  var success = function(position){
    callback(null, position.coords.latitude, position.coords.longitude)
  }

  var error = function(){
    callback(new Error('Unable to retreive your location'))
  }

  navigator.geolocation.getCurrentPosition(success, error)
}

module.exports = {
  search: search,
  remove: remove
}
