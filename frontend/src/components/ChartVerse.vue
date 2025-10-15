<template>
	<div id="chart">
		<apexchart type="candlestick" :height="height" :options="chartOptions" :series="series"></apexchart>
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
			maxValue: Number
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
				if (this.verse)
					this.series = [{
						data: state.game.chart
					}]
			}
		}
	}
</script>

<style>
	.apexcharts-yaxis-label, .apexcharts-xaxis-label {
		color: #e5c44f;
		fill:  #e5c44f;
	}
	#chart.chartmuted .apexcharts-xaxis-label {
		opacity: 0
	}
	#chart.chartmuted .apexcharts-yaxis-label {
		opacity: 0
	}
	.apexcharts-toolbar {
		display: none!important;
	}
</style>
