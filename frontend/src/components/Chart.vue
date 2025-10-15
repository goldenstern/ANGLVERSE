<template>
	<div id="chart">
		<apexchart v-if="turn" type="candlestick" :height="height" :options="chartOptions" :series="series"></apexchart>
	</div>
</template>

<script>
	import state from '../store/state'
	//import config from '../config'
	//import axios from 'axios'
	import VueApexCharts from 'vue-apexcharts'

	export default {
		data: () => ({
			state,
			loaded: false,
			series: [],
			turn: false,
			chartOptions: {
				chart: {
					type: 'candlestick',
					height: ((1080 / window.innerWidth) * window.innerHeight) - 560,
					zoom: {
						enabled: false
					},
					dataLabels: {
						enabled: true,
					},
					sparkline: {
						enabled: false
					},
					legend: {
						show: false
					},
				},
				plotOptions: {
					candlestick: {
						colors: {
							upward: '#e5c44f',
							downward: '#ff8ee4'
						},
						wick: {
							useFillColor: true
						}
					}
				},
				title: {
					text: '',
					align: 'left'
				},
				annotations: {

				},
				xaxis: {
					type: 'string',
					tooltip: {
						enabled: false
					}
				},
				yaxis: {
					tooltip: {
						enabled: false
					}
				}
			},
		}),
		components: {
			apexchart: VueApexCharts,
		},
		props: {
			oogleId: Number,
			verse: Boolean,
			maxValue: Number,
			noLossValue: Number,
			baseValue: Number
		},
		mounted () {
			this.loaded = true;
			this.getData();
			
		},
		computed: {
			height () {
				return ((1080 / window.innerWidth) * window.innerHeight) - 560;
			}
		},
		watch: {
			'state.playerStats': {
				deep: true,
				handler: function(){
					this.getData()
				}
			},
			'state.game.chart': {
				deep: true,
				handler: function(){
					this.getData()
				}
			},
			'state.options.chart_size': {
				deep: true,
				handler: function(){
					this.getData()
				}
			},
		},
		methods: {
			getData() {
				if (this.oogleId) {
					if (this.maxValue && this.noLossValue) {
						let opt = {
								yaxis: [
									{
									y: parseFloat(this.maxValue),
									borderColor: parseFloat(this.baseValue) < parseFloat(this.maxValue) ? '#ff8ee4' : '#e5c44f',
									borderWidth: 2,
									label: {
										borderColor: parseFloat(this.baseValue) < parseFloat(this.maxValue) ? '#ff8ee4' : '#e5c44f',
										orientation: 'horizontal',
										style: {
											color: parseFloat(this.baseValue) < parseFloat(this.maxValue) ? '#ff8ee4' : '#e5c44f',
										},
										text: 'Top Value',
										borderWidth: 0
									}
									},
									{
									y: parseFloat(this.noLossValue),
									borderColor: parseFloat(this.baseValue) < parseFloat(this.noLossValue) ? '#ff8ee4' : '#e5c44f',
									borderWidth: 2,
									label: {
										borderColor: parseFloat(this.baseValue) < parseFloat(this.noLossValue) ? '#ff8ee4' : '#e5c44f',
										orientation: 'horizontal',
										style: {
											color: parseFloat(this.baseValue) < parseFloat(this.noLossValue) ? '#ff8ee4' : '#e5c44f',
										},
										text: 'No Loss Value',
										borderWidth: 0
									}
									}
								]
							}
							this.chartOptions.annotations = opt
							this.turn = true
					}
					this.series = [{
						data: state.playerStats.charts[this.oogleId]
					}]
				} 
			}
		}
	}
</script>

<style>
	.apexcharts-yaxis-label, .apexcharts-xaxis-label {
		color: #e5c44f;
		fill:  #e5c44f;
	}
	.apexcharts-toolbar {
		display: none!important;
	}
</style>
