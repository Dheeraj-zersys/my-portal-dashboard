import { usePage } from '@inertiajs/react';

/**
 * Temporary stand-in for an un-ported screen. Shows the Inertia component name and the props
 * the backend sends, so the matching UI can be wired to them.
 * Delete once every page is integrated.
 */
export default function PagePlaceholder({ source }) {
    const { component, props } = usePage();

    return (
        <main style={{ fontFamily: 'monospace', padding: 24 }}>
            <h1>{component}</h1>
            <p>Not integrated yet. Port UI from: {source}</p>
            <pre style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(props, null, 2)}</pre>
        </main>
    );
}
