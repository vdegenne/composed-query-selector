// Function to recursively find all elements with shadow DOMs
function getAllShadowHosts(
	root: Document | ShadowRoot = document,
): HTMLElement[] {
	let shadowHosts: HTMLElement[] = [];

	// Find all elements in the current root (document or shadow root)
	const elements = root.querySelectorAll<HTMLElement>('*');

	elements.forEach((element) => {
		if (element.shadowRoot) {
			shadowHosts.push(element);
			// Recursively search within this shadow DOM
			shadowHosts = shadowHosts.concat(getAllShadowHosts(element.shadowRoot));
		}
	});

	return shadowHosts;
}

// Function to query elements in the document and all shadow DOMs
export function composedQuerySelector<K extends keyof HTMLElementTagNameMap>(
	selector: K,
): HTMLElementTagNameMap[K][];
export function composedQuerySelector<E extends Element = Element>(
	selector: string,
): E[];
export function composedQuerySelector(selector: string): Element[] {
	// Start by querying in the document
	let results: Element[] = Array.from(document.querySelectorAll(selector));

	// Get all shadow hosts and query within their shadow DOMs
	const shadowHosts = getAllShadowHosts();
	shadowHosts.forEach((host) => {
		const shadowRoot = host.shadowRoot;
		if (shadowRoot) {
			results = results.concat(
				Array.from(shadowRoot.querySelectorAll(selector)),
			);
		}
	});

	return results;
}
