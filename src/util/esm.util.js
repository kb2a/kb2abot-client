import getDirname from "es-dirname"

export async function importFresh(modulePath) {
	const cacheBustingModulePath = `${modulePath}?update=${Date.now()}`;
	return (await import(cacheBustingModulePath)).default;
}

export const __dirname = getDirname()