<script lang="ts">
	import type { SVGAttributes } from 'svelte/elements';

	interface $$Props extends SVGAttributes<SVGSVGElement> {}
</script>

<svg
	width="20"
	height="20"
	viewBox="0 0 20 20"
	fill="none"
	xmlns="http://www.w3.org/2000/svg"
	{...$$props}
>
	<rect width="20" height="20" transform="matrix(0 1 -1 0 20 0)" />
	<path
		d="M15 8.08748L13.825 6.91248L10 10.7291L6.175 6.91248L5 8.08748L10 13.0875L15 8.08748Z"
		fill="#111827"
	/>
</svg>
