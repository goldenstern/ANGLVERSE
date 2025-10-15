import utils from '../utils'

const state = {
  game: {
    isJoined: false,
    id: null,
    gameEndsAt: "",
    canActBefore: "",
    timeToEnd: '',
    bidsPlaced: 0,
    totalPool: 0.0,
    isLocked: false,
    isReload: false,
    currentOogleIdx: JSON.parse(window.localStorage.getItem('menu-pos')) ? JSON.parse(window.localStorage.getItem('menu-pos')) : 0,
    chart: null,
    numChart: null,
  },
  user: {
    id: null,
    name: '',
    investor_skin_id: null,
    balance_ngls: 0.0,
    balance_bnb: 0.0,
    balance_busd: 0.0,
    ref_code: "",
    ref_link: "",
    ref_count: 0,
    ref_tokens: 0,
    completed_onboarding: false,
    start_pack: null,
    start_gas: null,
    xp: null,
    level: null,
    next_level_xp: null,
    senator: null,
    patricius: null
  },
  wallet: {
    address: ''
  },
  lastUserUpdate: 0,
  isLoggedIn: false,
  isIgnition: true,
  hasCsrf: false,
  hasWallet: false,
  isUpdating: false,
  isUpdatingUser: false,
  isUpdatingGame: false,
  stats: [],
  tutorialDone: !!JSON.parse(window.localStorage.getItem('tutorial-done')),
  tutorial2Done: !!JSON.parse(window.localStorage.getItem('tutorial2-done')),
  tutorial3Done: !!JSON.parse(window.localStorage.getItem('tutorial3-done')),
  riskChanged: JSON.parse(window.localStorage.getItem('risk-changed')) ? JSON.parse(window.localStorage.getItem('risk-changed')) : [],
  withdraw: null,
  walletBalance: '',
  playerStats: {
    bet: 0.0,
    won: 0.0,
    saldo: 0.0,
    spent: 0.0,
    earned: 0.0,
    period: {
      from: "",
      till: ""
    },
    charts: {},
    rawcharts: {},
    diffs: {}
  },
  oogles: [],
  lastOogles: {},
  items: [],
  selectedOogle: -1,
  oogle: {
    id: null,
    experience: 0,
    next_level_experience: 0,
    value: 0.0,
    maxValue: 0.0,
    skin: {}
  },
  skin_id: 1,
  level: null,
  meanBet: 0,
  forum: [],
  forumTS: null,
  appVars: {
    forum_activity_lock: true,
    forum_verse_lock: true,
    forum_scribe_lock: true,
    incense_1: null,
    incense_2: null,
    incense_3: null,
    gdao_chest_supply: null,
    caravan: null,
    caravan_items: null,
    isTreasureLock: null
  },
  options: {
    chart_size: JSON.parse(window.localStorage.getItem('chart-size')) ? JSON.parse(window.localStorage.getItem('chart-size')) : 48,
    forum_size: JSON.parse(window.localStorage.getItem('forum-size')) ? JSON.parse(window.localStorage.getItem('forum-size')) : 1,
    chart_mode: JSON.parse(window.localStorage.getItem('chart-mode')) ? JSON.parse(window.localStorage.getItem('chart-mode')) : 1,
  },


  updateSelectedOogle (newValue) {
    //~ console.log('updateSelectedOogle', this.selectedOogle, newValue)
    if (this.selectedOogle == newValue || newValue >= this.oogles.length) {
      return;
    }
    if (newValue < 0 || newValue) {
      this.oogle.id = null;
      this.oogle.experience = 0;
      this.oogle.next_level_experience = 0;
      this.oogle.value = 0.0;
      this.oogle.maxValue = 0.0;
      //this.oogle.skin;
    } else {
      // TODO deep copy
      for (let key of Object.keys(this.oogles[newValue])) {
        if (key == 'skin') {
          if (!this.oogle.skin) {
            this.oogle.skin = {}
          }
          for (let skinKey of Object.keys(this.oogles[newValue]['skin'])) {
            this.oogle.skin[skinKey] = this.oogles[newValue]['skin'][skinKey];
          }
        } else {
          this.oogle[key] = this.oogles[newValue][key];
        }
      }
    }
    this.selectedOogle = newValue;
    //~ console.log('updateSelectedOogle@state', this)
  },
  updateFromOoglesArray(oogles) {
    if (!oogles) return;
    if (this.game.isLocked) return;
    //~ console.log('updateFromOoglesArray', oogles);
    const oldLength = this.oogles.length;
    for (let i = 0; i < oogles.length; i++) {
      if (i < oldLength) {
        Object.assign(this.oogles[i], oogles[i]);
      } else {
        this.oogles.push(oogles[i])
      }
      //~ console.log(`Adding oogle ${i} id=${oogles[i].id}`);
    }
    if (oogles.length < oldLength) {
      if (this.selectedOogle >= oogles.length) {
        this.updateSelectedOogle(oogles.length - 1);
      }
      this.oogles.splice(oogles.length, oldLength - oogles.length);
    }
    //~ console.log('updateSelectedOogle', this.selectedOogle, this);
    if (this.selectedOogle < 0) {
      this.updateSelectedOogle(0);
    }
  },
  updateFromItemsArray(items) {
    if (!items) return;
    //~ console.log('updateFromOoglesArray', oogles);
    state.items.splice(0, state.items.length);
    const oldLength = this.items.length;
    for (let i = 0; i < items.length; i++) {
      if (i < oldLength) {
        Object.assign(this.items[i], items[i]);
      } else {
        this.items.push(items[i])
      }
      //~ console.log(`Adding oogle ${i} id=${oogles[i].id}`);
    }
    // console.log('ITEMS',this.items)
  },
  updateFromUserResponse (response) {
    const oogle = response.data.data.oogle
    this.user.name = response.data.data.name
    this.user.id = response.data.data.id
    this.user.investor_skin_id = response.data.data.investor_skin_id; //TODO XXX FIXME
    this.user.balance_bnb = response.data.data.balance_bnb;
    this.user.balance_ngls = response.data.data.balance_ngls;
    this.user.balance_busd = response.data.data.balance_busd;
    this.user.ref_link = response.data.data.ref_link
    this.user.ref_count = response.data.data.ref_count
    this.user.ref_tokens = response.data.data.ref_tokens
    this.user.xp = response.data.data.xp
    this.user.level = response.data.data.level
    this.user.next_level_xp = response.data.data.next_level_xp
    this.user.ref_code = response.data.data.ref_code
    this.user.completed_onboarding = response.data.data.completed_onboarding
    this.user.start_pack = response.data.data.start_pack ? response.data.data.start_pack : this.user.start_pack
    this.user.start_gas = response.data.data.start_gas
    this.user.senator = response.data.data.senator
    this.user.patricius = response.data.data.patricius
    this.balance = oogle ? oogle.value : 0
    this.oogle.value = oogle ? oogle.value : 0
    this.oogle.id = oogle ? oogle.id : 0
    this.oogle.maxValue = oogle ? oogle.max_value : 0
    this.oogle.experience = oogle ? oogle.experience : 0
    this.oogle.skin = oogle ? oogle.skin.name : null
    this.oogle.next_level_experience = oogle ? oogle.next_level_experience : 0
    this.walletBalance = response.data.data.wallet_balance
    this.angle = utils.m2a(response.data.data.multiplier)
    this.withdraw = response.data.data.withdraws
    //this.updateFromOoglesArray(response.data.data.oogles)
    // console.log('SKN',this.oogle.skin, this.oogles, this.oogle, response.data.data.oogles)
    this.store()
  },
  updateFromGameResponse (response) {
    //~ console.log('updateFromGameResponse', response)
    this.updateFromOoglesArray(response.data.data.oogles)
    this.updateFromItemsArray(response.data.data.items)
  },
  updatePlayerStats (newStats) {
		if (!newStats) return;
    this.playerStats.chart = newStats.bet
    this.playerStats.bet = newStats.bet
    this.playerStats.won = newStats.won
    this.playerStats.saldo = newStats.saldo
    this.playerStats.spent = newStats.spent
    this.playerStats.earned = newStats.earned
    this.playerStats.period.from = newStats.period.from
    this.playerStats.period.till = newStats.period.till
  },
  store () {
		localStorage.setItem('user', JSON.stringify(this.user))
  },
  load () {
		let cachedUser = JSON.parse(localStorage.getItem('user'))
		if (!cachedUser) {
			return;
		}
		for (let key in cachedUser) {
			this.user[key] = cachedUser[key]
		}
	},
	clearStorage () {
		localStorage.removeItem('user');
	}
};

state.load();


export default state;
console.log(state)
