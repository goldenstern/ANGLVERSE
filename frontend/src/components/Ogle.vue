		<template>
			<div class="oogle" v-if="loaded">
				<div class="pixel-pop" :class="{activatepop: pop && popCoin, win: coinDiff >= 0, lose: coinDiff < 0}" :style="{bottom: (100*size)+'px'}">{{coinDiff > 0 ? '+' : ''}}{{coinDiff ? parseFloat(coinDiff).toFixed(8) : ''}}ANGLS</div>
				<div v-if="xpDiff > 0" class="pixel-pop" :class="{activatepop: pop, delay: popCoin}" :style="{bottom: (100*size)+'px'}">{{xpDiff > 0 ? '+' : ''}}{{xpDiff ? xpDiff : ''}}XP</div>
				<img v-if="!this.manual && oogle.value && oogle.value == 0" :style="{width: width + 'px', transform: 'scale('+size+')'}" :class="{flipped: flip}" src="../assets/collections/basic/loss.png">
				<img v-else :style="{width: width + 'px', transform: 'scale('+size+')'}" :class="{flipped: flip}" :src="skinUrl">
				<div v-if="oogle && oogle.level != -1 && (risk !== null && risk > 0) || ( oogle && oogle.risk > 0 && risk == null)" style="z-index: 21;" class="eye" :class="{hidden: oogle.value == 0}" :style="{ bottom: 55 + 50 * (size - 1)  + 'px', 'background-color': uiColor, transform: 'scale(' + size * 20 * (k+1) + ')' }"></div>
			</div>
		</template>

		<script>
			import state from '../store/state'
			import config from '../config'
			import axios from 'axios'
			import WebsocketClient from '../wsclient'

			const baseValue = 1; 

			function col2rgb(color) {
				return [(color&0xFF0000)>>16, (color&0xFF00)>>8, color&0xFF];
			}

			const firstColor = 0xFFFFFF;
			const secondColor = 0xE5C44F;
			const thirdColor = 0xFF8EE4;
			const [r1, g1, b1] = col2rgb(firstColor)
			const [r2, g2, b2] = col2rgb(secondColor)
			const [r3, g3, b3] = col2rgb(thirdColor)

			export default {
				data: () => ({
					state,
					oogle: null,
					loaded: false,
					uiColor: null,
					savedXP: null,
					savedNextXP: null,
					savedCoin: null,
					coinDiff: null,
					xpDiff: null,
					pop : false,
					popCoin: false,
					gid: null
				}),
				props: {
					oogleId: Number,
					scalable: {
						type: Boolean,
						default: true,
					},
					flip: {
						type: Boolean,
						default: false
					},
					width: {
						type: Number,
						default: 75
					},
					manual: {
						type: Object,
						default: null
					},
					value: {
						type: Number,
						default: 1
					},
					k: {
						type: Number,
						default: 0
					},
					risk: {
						type: Object,
						default: null
					},
					// uiColor: {
					// 	type: String,
					// 	default: "#00ffe0"
					// }
				},
				mounted () {
					if (!this.manual && this.oogleId) {
						let id = state.oogles.findIndex(x => x.id == this.oogleId);
						if (state.oogles[id]) {
							this.oogle = state.oogles[id]
							this.update_angle_color()
							// this.savedXP = this.oogle.experience
							// this.savedNextXP = this.oogle.next_level_experience
							// this.savedCoin = this.oogle.value
							this.gid = state.game.id
						} else {
							axios.get(`${config.api}/oogles/${this.oogleId}`)
							.then(response => {
								this.oogle = response.data.data
								this.update_angle_color()
								// this.savedXP = this.oogle.experience
								// this.savedNextXP = this.oogle.next_level_experience
								// this.savedCoin = this.oogle.value
								this.gid = state.game.id
							})
						}
						//console.log("LAST STATE PRE", state.lastOogles[this.oogleId])
						if (!(this.oogleId in state.lastOogles)) {
							state.lastOogles[this.oogleId] = JSON.parse(JSON.stringify(this.oogle));
							//console.log("LAST STATE CRREAQTED", state.lastOogles[this.oogleId])
						}
						this.loaded = true
						WebsocketClient.addHandler('game_ended', this.onGameEndedEidolEvent);
					} else {
						this.loaded = true
					}
					
				},
				watch: {
					'state.game.id': {
						handler: function() {
							if (this.oogleId) {
								let id = state.oogles.findIndex(x => x.id == this.oogleId);
								if (state.oogles[id]) {
									this.oogle = state.oogles[id]
									this.update_angle_color()
									this.calculateVals()
								} else {
									axios.get(`${config.api}/oogles/${this.oogleId}`)
									.then(response => {
										this.oogle = response.data.data
										this.update_angle_color()
										this.calculateVals()
									})
								}

							}
						}
					},						
					'state.oogles': {
						deep: true,
						handler: function() {
							if (this.oogleId) {
								let id = state.oogles.findIndex(x => x.id == this.oogleId);
								if (state.oogles[id]) {
									this.oogle = state.oogles[id]
									this.update_angle_color()
									this.calculateVals()
								} else {
									axios.get(`${config.api}/oogles/${this.oogleId}`)
									.then(response => {
										this.oogle = response.data.data
										this.update_angle_color()
										this.calculateVals()
									})
								}

							}						
						}
					},
				},
				computed: {
					formula () {
						return Math.sqrt((this.value/baseValue-1)/16 + 1)//(this.value/baseValue-1)/512 + 1;//(Math.max(this.value/baseValue,1)-1)/16 + 1
					},
					size: function() {
						if ( this.manual && this.manual["collection"]) {
							return this.scalable
							? (this.flip ? -this.manual['scale'] : this.manual['scale'])
							:  (this.flip ? -1 : 1);
						} else {
							return this.flip ? -this.formula : this.formula;
						}
					},
					skinUrl: function() {
						var images = require.context('../assets/collections/', true, /\.svg$/);
						if (this.oogle === null && this.manual === null) {
							return '';
						} else if (this.oogle === null && this.manual !== null) {
							return images(`./${this.manual['collection']}/${this.manual['type']}/${this.manual['rarity']}/` + this.manual['skin'])
						} else {
							return images(`./${this.oogle.collection}/${this.oogle.type}/${this.oogle.rarity}/` + this.oogle.skin.image)
						}
						
					}
				},
				methods: {
					calculateVals () {
						if (this.gid == state.game.id)
							return
						//console.log("STATE CHANGED", state.lastOogles[this.oogleId],this.oogle)
						this.gid = state.game.id;
						let xp = false;
						if (state.lastOogles[this.oogleId].value != this.oogle.value) {
							this.coinDiff = this.oogle.value - state.lastOogles[this.oogleId].value;
							state.lastOogles[this.oogleId].value = this.oogle.value;
							this.popCoin = true;
						}
						if (state.lastOogles[this.oogleId].next_level_experience != this.oogle.next_level_experience) {
							this.xpDiff = (state.lastOogles[this.oogleId].next_level_experience-state.lastOogles[this.oogleId].experience) + this.oogle.experience
							state.lastOogles[this.oogleId].experience = this.oogle.experience
							state.lastOogles[this.oogleId].next_level_experience = this.oogle.next_level_experience
							if (this.xpDiff > 0) xp = true;
						} else if (state.lastOogles[this.oogleId].experience != this.oogle.experience) {
							this.xpDiff = this.oogle.experience - state.lastOogles[this.oogleId].experience
							state.lastOogles[this.oogleId].experience = this.oogle.experience
							if (this.xpDiff > 0) xp = true;
						}
						// if (state.oogles[id].lastCoin != this.oogle.value) {
						// 	this.coinDiff = this.oogle.value - state.oogles[id].lastCoin;
						// 	state.oogles[id].lastCoin = this.oogle.value;
						// 	this.popCoin = true;
						// }
						// if (state.oogles[id].lastNextExp != this.oogle.next_level_experience) {
						// 	this.xpDiff = (state.oogles[id].lastNextExp-state.oogles[id].lastExp) + this.oogle.experience
						// 	state.oogles[id].lastExp = this.oogle.experience
						// 	state.oogles[id].lastNextExp = this.oogle.next_level_experience
						// 	xp = true;
						// } else if (state.oogles[id].lastExp != this.oogle.experience) {
						// 	this.xpDiff = this.oogle.experience - state.oogles[id].lastExp
						// 	state.oogles[id].lastExp = this.oogle.experience
						// 	xp = true;
						// }
						if (this.popCoin || xp) {
							this.pop = true
						}
						setTimeout(()=>{
							this.pop = false
							this.popCoin = false;
						},15000)
					},
					onGameEndedEidolEvent() {
						console.log("GAMEENDED_IDOL")
						this.calculateVals()
					},
					update_angle_color() {
						const f1 = Math.abs((this.oogle.risk - 0.5)/0.5);
						const f2 = 1 - f1;
						const f3 = (this.oogle.risk - 0.5)/0.5 > 0 ? (this.oogle.risk - 0.5)/0.5 : 0;
						const f4 = (0.5 - this.oogle.risk)/0.5 > 0 ? (0.5 - this.oogle.risk)/0.5 : 0;
						this.uiColor = '#' + parseInt(r1*f4 + r2*f2 + r3*f3 ).toString(16).padStart(2, '0')
						+ parseInt(g1*f4 + g2*f2 + g3*f3 ).toString(16).padStart(2, '0')
						+ parseInt(b1*f4 + b2*f2 + b3*f3 ).toString(16).padStart(2, '0');
					}
				}
			}
		</script>

		<style scoped>
			.flipped {
				transform: scaleX(-1);
			}
			img {
				transform-origin: bottom;
			}

			.eye {
				position: absolute;
				width: 4px;
				height: 4px;
				left: 50%;
				bottom: 60px;
				margin-left: -2px;
				margin-bottom: -2px;
				background: #fff;
				border-radius: 50%;
				opacity: .5;
				-webkit-animation: pul2 2s infinite;
				animation: pul2 2s infinite;
				transform-origin: center center;
			}

			.hidden {
				display: none;
			}

			@keyframes pul2 {

				0% {
					width: 2px;
					height: 2px;
					margin-left: -1px;
					margin-bottom: -1px;
					opacity: 0.5;
				}

				80% {
					width: 6px;
					height: 6px;
					margin-left: -3px;
					margin-bottom: -3px;
					opacity: 0;
				}

				100% {
					width: 2px;
					height: 2px;
					margin-left: -1px;
					margin-bottom: -1px;
					opacity: 0;
				}
			}

			@keyframes pop {

				0% {
					transform: translateX(-50%) translateY(0%);
					opacity: 0;
				}

				5% {
					transform: translateX(-50%) translateY(0%);
					opacity: 1;
				}

				100% {
					transform: translateX(-50%) translateY(-300%);
					opacity: 0;
				}
			}

			.pixel-pop {
				opacity: 0;
				font-family: Superstar;
				position: absolute;
				font-size: 90px;
				bottom: 100px;
				left: 50%;
				transform: translateX(-50%);
			}

			.activatepop {
				-webkit-animation: pop 5s forwards 1s;
				animation: pop 5s forwards 1s;
			}

			.win {
				color: #e5c44f;
			}
			.lose {
				color: #ff8ee4;
			}

			.delay {
				animation-delay: 2s!important;
			}


		</style>
