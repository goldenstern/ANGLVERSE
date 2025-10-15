"use strict";

import axios from 'axios';
import state from './store/state'
import router from './router'
import utils from './utils';

var wsclient = function() {
    var self = this;
    var wsock = null;
    this.isReady = false;
    this.isSubscribed = false;

    var handlers = {};
    var sendbuf = [];

    this.readyPromise = null;
    this._readyResolve = null;

    this.ready = () => {
        if (this.isReady) {
            return new Promise((resolve) => {
                resolve();
            })
        }
        if (!this.readyPromise) {
            this.readyPromise = new Promise((resolve) => {
                this._readyResolve = resolve;
            })
        }
        return this.readyPromise;
    }


    var ws_onopen = function() {
        self.isReady = true;
        let msg;
        while ((msg = sendbuf.pop()) !== undefined) {
          self.Send(msg);
        }
        console.debug("WS open", wsock);
    }

    var ws_onclose = function(event) {
        self.isReady = false;
        self.isSubscribed = false;
        if (event.wasClean) {
            // okay
        } else {
            setTimeout(function(){init_ws();}, 300);
        }
        console.debug("WS close; code="+event.code+", reason: "+event.reason);
    }


    var known_nonces = new Set()
    var ws_onmessage = (event) => {
        console.debug('wsclient.js ws_onmessage', event.data);
        var msg;
        try {
            msg = JSON.parse(event.data);
        } catch (err) {
            //console.debug('SOMEWSERR',err)
            return;
        }
        if (known_nonces.has(msg._nonce)) return;
        self.Send({method: 'ack', nonce: msg._nonce})
        known_nonces.add(msg._nonce)
        setTimeout(() => {
          known_nonces.delete(msg._nonce)
        }, 60000);
        if (!("event" in msg)) {
            console.debug("Message without event: ", msg);
            return;
        }
        if (msg.event == 'subscribe') {
            console.log(msg.success)
            this.isSubscribed = msg.success;
        }
        if (msg.event in handlers) {
            for (let i in handlers[msg.event]) {
                handlers[msg.event][i](msg);
            }
        }
    }
    this.on_message = (event) => {ws_onmessage(event)};

    var ws_onerror = function(error) {
        self.isReady = false;
        console.error(error);
        // setTimeout(function(){init_ws();}, 300);
    }

    var init_ws = function() {
        wsock = new WebSocket("wss://angl.app/ws/");
        wsock.onopen = ws_onopen;
        wsock.onclose = ws_onclose;
        wsock.onmessage = ws_onmessage;
        wsock.onerror = ws_onerror;
    }

    this.disconnect = function() {
      wsock.close()
    }

    this.reconnect = function() {
      // wsock.close()
      init_ws()
    }

    this.authenticate = () => {
        let resolve, reject
        let prom = new Promise((_resolve, _reject) => {
            resolve = _resolve;
            reject = _reject;
        })
        axios.get('/sanctum/csrf-cookie').then(() => {
            axios
                .get('/api/auth/status')
                .then(response => {
                    state.isLoggedIn = true;
                    utils.internal_clock();
                    this.user_token = response.data.data.ws_auth_token;
                    this.subscribe();
                    resolve();
                }).catch(err => {
                    state.isLoggedIn = false;
                    if (!router.currentRoute.fullPath.includes('ref') && router.currentRoute.fullPath != '/register' && router.currentRoute.fullPath != '/hello' && router.currentRoute.fullPath != '/login') {
                        console.log('WSREDIR')
                        router.replace('/login')
                    }
                    this.user_token = null;
                    this.isReady = false;
                    reject(err);
                })
        }).catch(() => {
            this.user_token = null;
            this.isReady = false;
            reject()
        })
        return prom
    }

    this.subscribe = user_token => {
      this.user_token = user_token == undefined ? this.user_token : user_token
      if (!this.user_token) return
      self.Send({
        method: "sync",
        x: Math.random(),
        token: this.user_token
      })
    }

    this.addHandler = function(eventtype, handler) {
        if (!(eventtype in handlers))
            handlers[eventtype] = [];
        if (handlers[eventtype].indexOf(handler) !== -1) return;
        handlers[eventtype].push(handler);
    }

    this.removeHandler = function(eventtype, handler) {
        if (!(eventtype in handlers)) return;
        let pos = handlers[eventtype].indexOf(handler);
        if (pos >= 0)
            handlers[eventtype].splice(pos, 1);
    }

    this.Send = function(message) {
      if (!self.isReady) {
        sendbuf.push(message)
      } else {
        try {
          wsock.send(JSON.stringify(message));
        } catch (err) {
          sendbuf.push(message)
        }

      }
    }

    init_ws();
}

const WebSocketClient = new wsclient()

export default WebSocketClient;
