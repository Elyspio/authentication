const isDev = process.env.NODE_ENV === "development"


export function getApiPath(api?: string) {
	let base = `http://localhost:4004${api ?? ""}`

	if (!isDev) {

		base = `${window.location.origin}${window.location.pathname}`
		base += (api ?? "")

	}

	if (base.slice(-1)[0] === "/") {
		base = base.slice(0, base.length - 1)
	}

	return base;

}

