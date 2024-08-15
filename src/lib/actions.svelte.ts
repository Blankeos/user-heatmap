/* eslint-disable @typescript-eslint/no-explicit-any */

/** Dispatch event `callback` when an outside click of `node` is detected. */
export function clickOutside(node: any, callback: () => void) {
	const handleClick = (event: any) => {
		if (node && !node.contains(event.target) && !event.defaultPrevented) {
			callback();
		}
	};

	document.addEventListener('click', handleClick, true);

	return {
		destroy() {
			document.removeEventListener('click', handleClick, true);
		},
		update(callback: () => void) {
			const updatedHandleClick = (event: any) => {
				if (node && !node.contains(event.target) && !event.defaultPrevented) {
					callback();
				}
			};

			// Remove in case it was previously added.
			document.removeEventListener('click', updatedHandleClick, true);
			document.removeEventListener('click', handleClick, true);

			// Add the updated one.
			document.addEventListener('click', updatedHandleClick, true);
		}
	};
}
