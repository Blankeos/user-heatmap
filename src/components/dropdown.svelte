<script context="module" lang="ts">
	export type DropdownOption = {
		/**
		 * Has to be unique.
		 * Even without onClick, your currentValue will be set to this when
		 * the user clicks on the option.
		 */
		value: string;
		/** The display text of the option. Limitation (because of Svelte): Can't use JSX. */
		text: string;
		/**
		 * Add a custom callback to handle the click of an option.
		 */
		onClick?: (id: string) => void;
	};
</script>

<script lang="ts">
	import { clickOutside } from '$lib/actions.svelte';
	import { createEventDispatcher } from 'svelte';
	import { fly } from 'svelte/transition';
	import { IconChevronDown } from '../assets/icons';

	const dispatch = createEventDispatcher();

	// ===========================================================================
	// States
	// ===========================================================================
	let isOpen = false;

	/** @bindable with bind:currentValue */
	export let currentValue: string;

	export let options: DropdownOption[] = [];

	// ===========================================================================
	// Derived States
	// ===========================================================================

	$: currentOption = options.find((option) => option.value === currentValue);

	// ===========================================================================
	// Functions
	// ===========================================================================
	function toggleDropdown() {
		isOpen = !isOpen;
	}
</script>

<div use:clickOutside={() => (isOpen = false)}>
	<button
		on:click={toggleDropdown}
		class="text-neutral-600 bg-white border border-neutral-200 hover:bg-neutral-100 focus:ring-2 focus:outline-none focus:ring-neutral-300 font-medium rounded-lg text-sm pl-4 pr-2 text-center inline-flex items-center min-w-48 min-h-10"
		type="button"
	>
		<div class="flex w-full justify-between">
			<p>{currentOption?.text ?? currentOption?.value}</p>
			<div class="flex items-center border-l pl-2">
				<IconChevronDown />
			</div>
		</div>
	</button>

	{#if isOpen}
		<div
			in:fly={{ y: -10, duration: 200, opacity: 0.5 }}
			out:fly={{ y: -10, duration: 200, opacity: 0 }}
			class="absolute mt-2 min-w-72 z-10 bg-white divide-y divide-neutral-100 rounded-lg shadow w-44"
		>
			<ul class="py-2 text-sm text-neutral-700">
				{#each options as option (option.value)}
					<li>
						<button
							on:click={() => {
								currentValue = option.value;
								isOpen = false;

								option?.onClick?.(option.value);
							}}
							class="block w-full text-left px-4 py-2 hover:bg-neutral-100"
							>{option.text}
						</button>
					</li>
				{/each}
			</ul>
		</div>
	{/if}
</div>
