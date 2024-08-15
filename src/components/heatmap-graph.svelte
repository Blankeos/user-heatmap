<script lang="ts">
	import * as d3 from 'd3';
	import { onDestroy, onMount } from 'svelte';
	import { spring } from 'svelte/motion';

	export let heatmapData:
		| {
				country: string;
				hour: number;
				count: number;
		  }[]
		| undefined;

	let heatmapGraphRef: HTMLDivElement;

	let svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
	let currentWidth: number = 0;
	let currentHeight: number = 0;

	let tooltipHovered = false;
	let tooltipPosition = spring(
		{
			x: 0,
			y: 0
		},
		{ stiffness: 0.2, damping: 0.8 }
	);
	let tooltipData = { country: '', hour: 0, count: 0 };

	function initializeGraph() {
		if (!heatmapData) return;

		// set the dimensions and margins of the graph
		const margin = { top: 30, right: 30, bottom: 30, left: 30 };

		if (document.documentElement.clientWidth < 970) {
			currentWidth = 800 - margin.left - margin.right;
		} else {
			currentWidth = 1500 - margin.left - margin.right;
		}
		currentHeight = 400 - margin.top - margin.bottom;

		// append the svg object to the body of the page
		svg = d3
			.select('#heatmap-graph')
			.append('svg')
			.attr(
				'viewBox',
				`0 0 ${currentWidth + 30} ${currentHeight + 30 + 30}`
				// '0 0 2000 600'
				// '0 0 ' + Math.min(currentWidth, currentWidth) + ' ' + Math.min(currentWidth, currentWidth)
			)
			.attr('preserveAspectRatio', 'xMinYMin meet')
			// .attr('width', width + margin.left + margin.right)
			// .attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr('transform', `translate(${margin.left},${margin.top})`);
	}

	function renderGraphData() {
		if (!heatmapData || !svg) return;

		svg.selectAll('*').remove();

		/**
		 * Get the y labels from the heatmapData (this is the country, unique)
		 */
		const yLabels = Object.keys(
			heatmapData
				.map((d) => d.country)
				.reduce(
					(_xLabels, currentValue, index) => {
						_xLabels[currentValue] = 1;
						return _xLabels;
					},
					{} as Record<string, number>
				)
		);

		/**
		 * Get the x labels from the heatmapData (this is the hour_of_day, unique and sorted)
		 */
		const xLabels = Object.keys(
			heatmapData
				.map((d) => d.hour)
				.reduce(
					(_yLabels, currentValue, index) => {
						_yLabels[currentValue] = 1;
						return _yLabels;
					},
					{} as Record<string, number>
				)
		)
			.map((d) => parseInt(d))
			.sort((a, b) => a - b)
			.map((d) => d.toString());

		// Build X scales and axis:
		const x = d3.scaleBand().range([0, currentWidth]).domain(xLabels).padding(0.3);
		svg
			.append('g')
			.attr('transform', `translate(0, ${currentHeight})`)
			.call(d3.axisBottom(x))
			.attr('color', '#767474');

		// Build Y scales and axis:
		const y = d3.scaleBand().range([currentHeight, 0]).domain(yLabels).padding(0.15);
		svg.append('g').call(d3.axisLeft(y)).attr('color', '#767474');

		// Build color scale
		// @ts-ignore
		const myColor = d3
			.scaleLinear()
			// @ts-ignore
			.range(['#FFECE3', '#FBAB8F', '#FF7875', '#E6352B', '#800020'])
			.domain([1, 100]);

		// Three function that change the tooltip when user hover / move / leave a cell
		const mouseover = function (event: any, d: any) {
			tooltipHovered = true;
		};
		const mousemove = function (event: any, d: (typeof heatmapData)[number]) {
			$tooltipPosition.x = event.clientX - heatmapGraphRef.getBoundingClientRect().left / 2;
			$tooltipPosition.y = event.clientY - heatmapGraphRef.getBoundingClientRect().top;
			tooltipData = { country: d.country, hour: d.hour, count: d.count };
		};
		const mouseleave = function (d: any) {
			tooltipHovered = false;
		};

		const radius = Math.min(x.bandwidth(), y.bandwidth()) / 2;

		// add the squares
		svg
			.selectAll()
			.data(heatmapData, function (d) {
				return d!.count + ':' + d!.country;
			})
			.enter()
			.append('circle')
			// @ts-ignore
			.attr('cx', function (d: any) {
				return x(d!.hour.toString())! + x.bandwidth() / 2;
			})
			// @ts-ignore
			.attr('cy', function (d: any) {
				return y(d!.country)! + y.bandwidth() / 2;
			})
			.attr('r', radius)
			.style('fill', function (d) {
				return myColor(d!.count);
			})
			.on('mouseover', mouseover)
			.on('mousemove', mousemove)
			.on('mouseleave', mouseleave);
	}

	/**
	 * TODO: Improve responsiveness on resize.
	 * STUB: This is a placeholder for now.
	 */
	function resizeGraph() {
		if (!svg) return;
	}

	onMount(() => {
		initializeGraph();
		renderGraphData();
	});

	// On Data Change, update graph data.
	$: {
		if (heatmapData) {
			renderGraphData();
		}
	}

	onDestroy(() => {
		svg.remove();
	});
</script>

<div
	style:opacity={tooltipHovered ? 1 : 0}
	style:transform={`translate(${$tooltipPosition.x}px, ${$tooltipPosition.y}px)`}
	class="bg-white transition-opacity rounded-lg border p-2 absolute flex flex-col gap-y-1 text-xs pointer-events-none text-neutral-800"
>
	<span>
		<b>Country: </b>
		{tooltipData.country}
	</span>
	<span>
		<b>Hour of Day: </b>
		{tooltipData.hour}
	</span>
	<span>
		<b>Unique Visitors: </b>
		{tooltipData.count}
	</span>
</div>

<div id="heatmap-graph" class="" bind:this={heatmapGraphRef}></div>
