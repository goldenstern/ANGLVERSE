<template>
	<div id="chart2">
		<apexchart type="line" :height="height" :options="chartOptions" :series="series"></apexchart>
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
					type: 'line',
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
				stroke: {
					curve: 'straight'
				},
				dataLabels: {
					enabled: false
				},
				colors: ["#ff8ee4"],
				grid: {
					row: {
						colors: ['transparent', 'transparent'], // takes an array which will be repeated on columns
						opacity: 0.5
					},
				},
				title: {
					text: '',
					align: 'left'
				},
				annotations: {

				},
				xaxis: {
					type: 'category',
					tooltip: {
						enabled: false
					},
				},
				yaxis: {
					tooltip: {
						enabled: false
					},
					labels: {
						offsetX: -17
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
			'state.game.numChart': {
				deep: true,
				handler: function(){
					this.getData()
				}
			},
			'state.options.numLabels': {
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
						data: state.game.numChart
					}]
			}
		}
	}
</script>

<style>
	#chart2 .apexcharts-xaxis-label {
		color: #e5c44f;
		fill:  #e5c44f;
	}
	#chart2 .apexcharts-yaxis-label {
		color: #ff8ee4;
		fill:  #ff8ee4;
	}

	#chart2.chartmuted .apexcharts-xaxis-label {
		opacity: 0
	}
	#chart2.chartmuted .apexcharts-yaxis-label {
		opacity: 0
	}
	.apexcharts-toolbar {
		display: none!important;
	}
</style>
