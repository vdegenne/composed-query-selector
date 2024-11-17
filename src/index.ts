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
export function querySelectorAll<K extends keyof HTMLElementTagNameMap>(
	selector: K,
	from?: Element | Document,
): HTMLElementTagNameMap[K][];
export function querySelectorAll<E extends Element = Element>(
	selector: string,
	from?: Element | Document,
): E[];
export function querySelectorAll(selector: string, from = document): Element[] {
	// Start by querying in the document
	let results: Element[] = Array.from(from.querySelectorAll(selector));

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

export function querySelector<K extends keyof HTMLElementTagNameMap>(
	selector: K,
	from?: Element | Document,
): HTMLElementTagNameMap[K];
export function querySelector<E extends Element = Element>(
	selector: string,
	from?: Element | Document,
): E;
export function querySelector(selector: string, from = document): Element {
	return querySelectorAll(selector, from)[0];
}
