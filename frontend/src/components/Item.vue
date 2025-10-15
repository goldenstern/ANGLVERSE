<template>
	<div class="item" v-if="loaded">
		<img :style="{width: width + 'px', transform: 'scale('+size+')'}" :class="{flipped: flip}" :src="skinUrl">
	</div>
</template>

<script>
	import state from '../store/state'

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
			uiColor: null
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
				default: 100
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
				this.loaded = true
		},
		watch: {

		},
		computed: {
			formula () {
				return Math.sqrt((this.value/baseValue-1)/16 + 1)//(this.value/baseValue-1)/512 + 1;//(Math.max(this.value/baseValue,1)-1)/16 + 1
			},
			size: function() {
				if ( this.manual && this.manual["scale"]) {
					return this.scalable
					? (this.flip ? -this.manual['scale'] : this.manual['scale'])
					:  (this.flip ? -1 : 1);
				} else {
					return this.flip ? -this.formula : this.formula;
				}
			},
			skinUrl: function() {
				var images = require.context('../assets/collections/', true, /\.png|svg$/);
				if (this.manual['path'] !== undefined) {
					return images(`./` + this.manual['path'])
				}
				if (this.manual['skin'] !== undefined) {
					return images(`./${this.manual['collection']}/item/` + this.manual['skin'])
				}
				return null		
			}
		},
		methods: {
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
</style>
