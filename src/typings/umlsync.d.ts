// umlsync's package.json points `types` at a dist file that isn't actually
// built (dist/editor/index.d.ts doesn't exist) -- this shim stands in for it,
// same workaround react_snippet_framework uses for the same package.
declare module 'umlsync'
