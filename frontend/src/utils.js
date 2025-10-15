import state from './store/state'
import config from './config'
import axios from 'axios'
import router from './router'

import WebSocketClient from './wsclient'

const utils={

  degreesToRadians(degrees) {
    return degrees/180*Math.PI
  },
  radiansToDegrees (radians) {
    return radians/Math.PI*180
  },
  a2mlin (angleInDegrees) {
    return (angleInDegrees/90 + 1)
  },
  m2alin (multiplier) {
    return (multiplier - 1)*90
  },
  a2m (angleInDegrees) {
    return (1/Math.cos(this.degreesToRadians(angleInDegrees)))
  },
  m2a (multiplier) {
    return this.radiansToDegrees(Math.acos(1/multiplier))
  },
  tick_clock() {
    if (state.gameEndsAt) {
      // let _iOSDevice = !!navigator.platform.match(/iPhone|iPod|iPad/);
      let datestr;
      let actstr
      let date;
      let canActBefore;
      // if (_iOSDevice) {
      //   datestr = state.gameEndsAt.replace(' ', 'T') 
      //   actstr = state.canActBefore.replace(' ', 'T')
      // } else {
      //   datestr = state.gameEndsAt.replace(' ', 'T') + '+0000'
      //   actstr = state.canActBefore.replace(' ', 'T') + '+0000'
      // }   
      datestr = state.gameEndsAt.replace(' ', 'T') + '+0000'
      actstr = state.canActBefore.replace(' ', 'T') + '+0000'
      date = +Date.parse(datestr)/1000;
      canActBefore = +Date.parse(actstr)/1000;
      if (isNaN(date) || isNaN(canActBefore)) {
        datestr = state.gameEndsAt.replace(' ', 'T')
        actstr = state.canActBefore.replace(' ', 'T')
        date = +Date.parse(datestr)/1000;
        canActBefore = +Date.parse(actstr)/1000;
      }
      if (isNaN(date) || isNaN(canActBefore)) {
        datestr = state.gameEndsAt
        actstr = state.canActBefore
        date = +Date.parse(datestr)/1000;
        canActBefore = +Date.parse(actstr)/1000;
      }     
      let now = +Date.now()/1000;
      let dist = date - now;
      let fdist = canActBefore - now;
      let actDist = canActBefore - now;
      let min = parseInt(dist/60);
      let sec = parseInt(dist%60);
      let fmin = parseInt(fdist/60);
      let fsec = parseInt(fdist%60);
      if (min < 10) min = '0' + min;
      if (sec < 10) {
        sec = '0' + sec;
      }
      if (fmin < 10) fmin = '0' + fmin;
      if (fsec < 10) {
        fsec = '0' + fsec;
      }
      if (dist <= 0) {
        state.game.timeToEnd = '🕚';
        state.game.isLocked = true;
        state.game.isReload = true;
        utils.update_game(true);
        state.riskChanged = []
        window.localStorage.setItem('risk-changed',JSON.stringify(state.riskChanged))
        // utils.get_player_stats();
      } else if (actDist <= 0) {
        state.game.isLocked = true;
        state.game.timeToEnd = min + ':' + sec;
        state.game.isReload = false;
      } else {
        state.game.isLocked = false;
        state.game.isReload = false;
        state.game.timeToEnd = fmin + ':' + fsec;
      }
    }
  },
  loadTransactions() {
    if (state.game.isLocked) return;
    if (state.oogles.length == 0) {
      state.stats.splice(0, state.stats.length);
      return;
    }
    for (let oidx in state.oogles) {
      let oogle = state.oogles[oidx]
      let trByGameId = {};
      let winLoseHistory = [];
      if (state.stats[oidx] === undefined) state.stats[oidx] = [];
       axios.get(config.api+`/oogles/${oogle.id}/transactions`).then(res=>{
        state.playerStats.rawcharts[oogle.id] = res.data.data
        this.processChart(state.playerStats.rawcharts[oogle.id],oogle.id,oogle.value)
        for (let transaction of res.data.data) {
            if (transaction.type !== 'win' && transaction.type !== 'bet') continue;
            if (trByGameId[transaction.game_id] === undefined)
                trByGameId[transaction.game_id] = [];
            trByGameId[transaction.game_id].push(transaction)
        }
        for (let gameId of Object.keys(trByGameId)) {
            if (trByGameId[gameId].length == 1) {
                winLoseHistory.push({
                    gameId,
                    'amount': parseFloat(trByGameId[gameId][0].amount)
                })
            } else {
                let winlose = parseFloat(trByGameId[gameId][0].amount) + parseFloat(trByGameId[gameId][1].amount)
                if (winlose == 0) continue;
                winLoseHistory.push({
                    gameId,
                    'amount': winlose
                });
            }
            winLoseHistory.sort((a, b) => {
                return b.gameId - a.gameId
            })
        }
        let oldlength = state.stats[oidx].length;
        winLoseHistory.slice(0,10).forEach(entry=>{
          state.stats[oidx].push(entry.amount)
        })
        state.stats[oidx].splice(0,oldlength);
      })
    }
  },
  processChart(data, id, value) {
    let currentHour;
    let lastHour = null;
    let open, close;
    let low, high = 0;
    let roundDiff = 0;
    let scale = 1e8;

    let startVal = Math.round(parseFloat(value) * scale);
    let val = startVal;
    let tmpchart = [];
    let cnt = 0;
    let diff = 0;
    let offset = new Date().getTimezoneOffset() / 60;

    for (let transaction of data) {
      if (cnt > state.options.chart_size) break;

      let amount = Math.round(parseFloat(transaction.amount) * scale);

      if (transaction.type === 'win') {
        roundDiff += amount;
      }

      if (transaction.type === 'bet') {
        roundDiff += amount;
        currentHour = ((parseInt(transaction.created_at.slice(11, 13)) - offset + 24) % 24) + ':00';

        if (currentHour !== lastHour) {
          if (lastHour !== null) {
            tmpchart.unshift({
              x: lastHour,
              y: [
                parseFloat((open / scale).toFixed(8)),
                parseFloat((high / scale).toFixed(8)),
                parseFloat((low / scale).toFixed(8)),
                parseFloat((close / scale).toFixed(8))
              ]
            });
            cnt++;
          }
          close = val;
          open = val - roundDiff;
          low = Math.min(close, open);
          high = Math.max(close, open);
        } else {
          open = val - roundDiff;
          low = Math.min(low, open);
          high = Math.max(high, open);
        }

        val -= roundDiff;
        diff += roundDiff;
        roundDiff = 0;
        lastHour = currentHour;
      }
    }

    if (data.length > 0) {
      tmpchart.unshift({
        x: lastHour,
        y: [
          parseFloat((open / scale).toFixed(8)),
          parseFloat((high / scale).toFixed(8)),
          parseFloat((low / scale).toFixed(8)),
          parseFloat((close / scale).toFixed(8))
        ]
      });
    }

    state.playerStats.charts[id] = tmpchart;
    state.playerStats.diffs[id] = diff / scale;
    console.log('DIFF', diff / scale);
  },
  processVerseChart(data) {
    let currentHour;
    let lastHour = null;
    let open, close;
    let low, high = 0;
    let tmpchart = [];
    let cnt = 0;
    let offset = new Date().getTimezoneOffset() / 60;
    let oldVal = null;
    let scale = 1e8;

    for (let transaction of data) {
      if (cnt > state.options.chart_size) break;

      let amount = Math.round(parseFloat(transaction.amount) * scale);
      currentHour = ((parseInt(transaction.created_at.slice(11, 13)) - offset + 24) % 24) + ':00';

      if (currentHour !== lastHour) {
        if (lastHour !== null) {
          tmpchart.unshift({
            x: lastHour,
            y: [
              parseFloat(this.formatCoin((open / scale).toFixed(8))),
              parseFloat(this.formatCoin((high / scale).toFixed(8))),
              parseFloat(this.formatCoin((low / scale).toFixed(8))),
              parseFloat(this.formatCoin((close / scale).toFixed(8)))
            ]
          });
          cnt++;
        }
        close = oldVal !== null ? oldVal : amount;
        open = amount;
        low = Math.min(close, open);
        high = Math.max(close, open);
      } else {
        open = amount;
        low = Math.min(low, open);
        high = Math.max(high, open);
      }

      lastHour = currentHour;
      oldVal = amount;
    }

    if (data.length > 0) {
      tmpchart.unshift({
        x: lastHour,
        y: [
          parseFloat(this.formatCoin((open / scale).toFixed(8))),
          parseFloat(this.formatCoin((high / scale).toFixed(8))),
          parseFloat(this.formatCoin((low / scale).toFixed(8))),
          parseFloat(this.formatCoin((close / scale).toFixed(8)))
        ]
      });
    }

    state.game.chart = tmpchart;
  },
  formatCoin (num) {
    const val = parseFloat(num)
    if (val >= 1e9) {
      return val.toFixed(0)
    } else if (val < 0) {
      return val.toFixed(8)
    } else {
      const precise = val.toPrecision(9)
      const fixed8 = val.toFixed(8)
      const lenPrecise = precise.length
      const lenFixed8 = fixed8.length
      return lenFixed8 > lenPrecise? precise : fixed8
    } 
  },
  processNumChart(data) {
    let currentHour;
    let lastHour = null;
    // let lastGame = null;
    let cummulativeVal, k = 0
    let tmpchart = [];
    let cnt = 0;
    let offset = new Date().getTimezoneOffset() / 60;  
    for (let transaction of data) {
      if (cnt > state.options.chart_size) break;
      currentHour = ((parseInt(transaction.created_at.slice(11,13)) - parseInt(offset))% 24)  + ':00';
      if (currentHour != lastHour) {
        if (lastHour != null) {
          let it = {
            x: lastHour,
            y: this.formatCoin(parseFloat(cummulativeVal/k*100).toFixed(8))
          }
          tmpchart.unshift(it);
          cummulativeVal = 0
          k = 0
          cnt ++;
        }
        cummulativeVal = parseFloat(transaction.amount)
        k++
      } else {
        cummulativeVal = cummulativeVal + parseFloat(transaction.amount)
        k++
      }
      lastHour = currentHour;
    }
    if (data.length > 0) {
      let it = {
        x: lastHour,
        y: this.formatCoin(parseFloat(cummulativeVal/k*100).toFixed(8))
      }
      tmpchart.unshift(it);
    }
    state.game.numChart = tmpchart;
  },
  get_player_stats() {
    axios
    .get('/api/transactions/stats')
    .then(res => {
        // state.playerStats = res.data.data;
        state.updatePlayerStats(res.data.data)
    })
  },
  get_my_stats() {
    // let trByGameId = {};
    // let winLoseHistory = [];
    // axios
    // .get('/api/transactions')
    // .then(res => {
    //     trByGameId = {};
    //     winLoseHistory = [];
    //     for (let transaction of res.data.data) {
    //         if (transaction.type !== 'win' && transaction.type !== 'bet') continue;
    //         if (trByGameId[transaction.game_id] === undefined)
    //             trByGameId[transaction.game_id] = [];
    //         trByGameId[transaction.game_id].push(transaction)
    //     }
    //     for (let gameId of Object.keys(trByGameId)) {
    //         if (trByGameId[gameId].length == 1) {
    //             winLoseHistory.push({
    //                 gameId,
    //                 'amount': parseFloat(trByGameId[gameId][0].amount)
    //             })
    //         } else {
    //             let winlose = parseFloat(trByGameId[gameId][0].amount) + parseFloat(trByGameId[gameId][1].amount)
    //             if (winlose == 0) continue;
    //             winLoseHistory.push({
    //                 gameId,
    //                 'amount': winlose
    //             });
    //         }
    //         winLoseHistory.sort((a, b) => {
    //             return b.gameId - a.gameId
    //         })
    //     }
    //     state.stats.splice(0,state.stats.length);
    //     winLoseHistory.slice(0,10).forEach(entry=>{
    //       state.stats.push(entry.amount)
    //     })
    // })

  },
  internal_clock() {
    if (!state.hasCsrf) {
      axios
        .get(config.csrf)
        .then(() => {
          state.hasCsrf = true;
          utils.update_user()
          utils.update_game()
          WebSocketClient.authenticate()
        })
    } else {
      utils.update_user()
      utils.update_game()
    }
  },
  redirectIfUnauthenticated () {
    if ( router.currentRoute.name != 'Login'
         && router.currentRoute.name != 'Register'
         && router.currentRoute.name != 'reset-password'
         && router.currentRoute.name != 'reset-password-form'
         && router.currentRoute.name != 'RegisterRef'
         && router.currentRoute.name != 'Hello'
         ) router.replace('/hello')
  },
  update_user (force=false) {
    if (!state.isLoggedIn) return;
    if (!force && Date.now() - state.lastUserUpdate < 10000) {
      return;
    }
    // if (!state.hasWallet) {
    //   axios.get(`${config.api}/wallet`)
    //     .then((response) => {
    //       state.wallet.address = response.data.data.address
    //       state.hasWallet = true;
    //       utils.update_user()
    //     })
    // } else {
    if (state.isUpdatingUser) return;
    state.isUpdatingUser = true;
    axios.get(`${config.api}/wallet`)
      .then((response) => {
        state.wallet.address = response.data.data.address
        state.hasWallet = true;
        //utils.update_user()
        axios.get(
        `${config.api}/auth/status`,
        ).then(response => {
          state.updateFromUserResponse(response);
          state.isLoggedIn = true;
          state.lastUserUpdate = Date.now()
          WebSocketClient.authenticate()
          state.isUpdatingUser = false;
        }).catch((err) => {
          console.warn(err)
          if (!state.isIgnition) {
            state.hasWallet = false;
            state.isLoggedIn = false;
          }
          state.lastUserUpdate = 0;
          state.isUpdatingUser = false;
          //~ state.clearStorage()
          //utils.redirectIfUnauthenticated()
        })
      }).catch((err) => {
          console.warn(err)
          //state.hasWallet = false;
          //state.isLoggedIn = false;
          state.lastUserUpdate = 0;
          state.isUpdatingUser = false;
          setTimeout(utils.update_user(),1000)
          //~ state.clearStorage()
          //utils.redirectIfUnauthenticated()
        })
    //} 
  },
  update_game(force=false,no_trans=false) {
    if (!state.isLoggedIn) return;
    if (!force && state.isUpdatingGame) return
    state.isUpdatingGame = true;
    axios.get(
      `${config.api}/game`,
    ).then(response => {
      if (response.data.success) {
        state.isUpdating = false;
        state.isIgnition = false;
        const token = decodeURIComponent(utils.getCookie('XSRF-TOKEN'));
        axios.defaults.headers.common['X-XSRF-TOKEN'] = token;
        axios.defaults.headers.common['X-CSRF-TOKEN'] = token;
        let m = response.data.data;
        if (!state.name) {
          axios.get(
            `${config.api}/user`,
          ).then(response => {
            if (response.data.name) {
              state.name = response.data.name;
            }
          })
        }
        if (state.game.id != response.data.data.id) state.game.isLocked = false;
        state.updateFromGameResponse(response);
        //const oogle = response.data.data.oogle
        state.angle = utils.m2a(m.my_multiplier)
        state.isLoggedIn = true;
        state.skin_id = response.data.data.investor_skin_id;
        //state.meanBet = response.data.data.meanBet;
        //state.level = response.data.data.level;
        //state.bidsPlaced = oogle ? oogle.totalBids : 0;
        //state.totalPool = oogle ? oogle.totalPool : 0;
        //state.balance = oogle ? oogle.value : 0;
        //state.oogle.id = oogle ? oogle.id : 0
        //state.oogle.value = oogle ? oogle.value : 0
        //state.oogle.maxValue = oogle ? oogle.max_value : 0;
        //state.oogle.experience = oogle ? oogle.experience : 0;
        //state.oogle.next_level_experience = oogle ? oogle.next_level_experience : 0;
        //state.oogle.skin = oogle ? oogle.skin.name : null
        //state.walletBalance = response.data.data.my_wallet_balance;
        state.gameEndsAt = response.data.data.ends_at
        state.game.id = response.data.data.id
        state.canActBefore = response.data.data.can_act_before;
        state.isJoined = response.data.data.is_joined;
        state.user.senator = response.data.data.senator
        state.user.patricius = response.data.data.patricius
        state.appVars.incense_1 = response.data.data.incense_1
        state.appVars.incense_2 = response.data.data.incense_2
        state.appVars.incense_3 = response.data.data.incense_3
        state.appVars.gdao_chest_supply = response.data.data.gdao_chest_supply
        state.appVars.caravan = response.data.data.caravan
        state.appVars.caravan_items = response.data.data.caravan_items
        state.appVars.isTreasureLock = response.data.data.chest_locked
        utils.get_my_stats();
        utils.get_player_stats();
        if (!no_trans)
          utils.loadTransactions();
        if ( router.currentRoute.name == 'Login' || router.currentRoute.name == 'Register' ) router.replace('/')
        state.isUpdatingGame = false
      }
    }).catch(error => {
      console.warn(error)
      console.log('ERROR DETECTED',error.response.status,error.response.status==404)
      if (error.response.status == 404) {
        if (state.isIgnition) {
          state.game.timeToEnd = '🕚';
          state.game.isLocked = true;
          state.game.isReload = true;
        }
        console.log('ERROR 404')
        if (state.isIgnition || (!state.isUpdating && !state.isUpdatingGame)) {
          console.log('ERROR UPDATING')
          state.isUpdating = true;
          setTimeout(()=>{
            console.log('ERROR REUPDATE TRIGGERED')
            state.isUpdating = false;
            console.log('ERROR REUPDATE STARTED')
            utils.update_game(true);
            // utils.get_player_stats();
          },1000)
        } else {
          console.log('ERROR ALREADY UPDATING')
        }
      } else if (error.response.status == 401) {
        if (!state.isIgnition) {
          state.isLoggedIn = false;
          state.clearStorage();
          utils.redirectIfUnauthenticated()
        }
        setTimeout(()=>{
          console.log('401 REUPDATE TRIGGERED')
          utils.update_game(true);
          // utils.get_player_stats();
        },1000)
      }
      
    })
  },
  getCookie (name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
    else if (parts.length === 3) return parts[1];
  }
}

export default utils;
