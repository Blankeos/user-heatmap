<script lang="ts">
	import { trpc } from '$lib/trpc';
	import { IconLogo, IconMagnifyingGlass } from '../assets/icons';
	import Dropdown, { type DropdownOption } from '../components/dropdown.svelte';

	import { createQuery } from '@tanstack/svelte-query';
	import HeatmapGraph from '../components/heatmap-graph.svelte';

	// ===========================================================================
	// States
	// ===========================================================================
	let currentValue: 'last_week' | 'last_two_weeks' | 'last_month' | 'last_quarter' | 'last_year' =
		'last_week';

	let options: DropdownOption[] = [
		{
			value: 'last_week',
			text: 'Last week'
		},
		{
			value: 'last_two_weeks',
			text: 'Last 2 weeks'
		},
		{
			value: 'last_month',
			text: 'Last month'
		},
		{
			value: 'last_quarter',
			text: 'Last quarter'
		},
		{
			value: 'last_year',
			text: 'Last year'
		}
	];

	// ===========================================================================
	// Queries
	// ===========================================================================
	$: query = createQuery({
		queryKey: ['heatmap', currentValue],
		queryFn: () => trpc.visits.getHeatmap.query({ dateRange: currentValue })
	});
</script>

<svelte:head>
	<title>Web Traffics - Home</title>
</svelte:head>

<div class="min-h-screen flex flex-col">
	<nav class="max-w-8xl mx-auto px-7 w-full py-5 flex justify-between">
		<a href="/" class="flex items-center gap-x-2">
			<IconLogo />
		</a>
	</nav>

	<main class="flex-grow flex flex-col">
		<div class="bg-neutral-100 h-full flex-grow">
			<div class="max-w-8xl mx-auto px-7 w-full flex flex-col gap-y-5 py-10">
				<div class="flex justify-between items-center">
					<h2 class="text-xl md:text-2xl">Web Traffics</h2>

					<Dropdown {options} bind:currentValue />
				</div>

				<div class="bg-white rounded-lg border p-5 flex flex-col gap-y-4 min-h-56">
					<div class="flex justify-between gap-x-2">
						<h3 class="text-sm font-medium">Unique Destination Heatmap</h3>
						<span class="flex items-center gap-x-2 text-xs text-neutral-500 truncate"
							>Less to more visitors <span class="flex gap-x-1">
								<span class="rounded-full w-1.5 h-1.5" style:background-color="#FFECE3"></span>
								<span class="rounded-full w-1.5 h-1.5" style:background-color="#FBAB8F"></span>
								<span class="rounded-full w-1.5 h-1.5" style:background-color="#FF7875"></span>
								<span class="rounded-full w-1.5 h-1.5" style:background-color="#E6352B"></span>
								<span class="rounded-full w-1.5 h-1.5" style:background-color="#800020"></span>
							</span></span
						>
					</div>

					{#if $query.isLoading}
						<div class="flex justify-center flex-1 items-center flex-col">
							<IconMagnifyingGlass class="animate-bounce text-red-400" />
							<span class="text-sm text-red-400">Loading data...</span>
						</div>
					{:else if !$query.data?.length}
						<p class="flex justify-center flex-1 items-center text-sm text-neutral-500">
							🤕 No data for this time range.
						</p>
					{:else}
						<HeatmapGraph heatmapData={$query.data} />
					{/if}
				</div>
			</div>
		</div>
	</main>

	<footer class="max-w-8xl mx-auto px-7 w-full py-8 text-center text-neutral-700 text-sm">
		<p>© 2024 Web Traffics Inc. All rights reserved.</p>
	</footer>
</div>
