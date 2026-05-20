export default function PreviewToolbar({ path = '/' }) {
	const exitHref = `/api/exit-draft?slug=${encodeURIComponent(path)}`;

	return (
		<div className="preview-toolbar">
			<strong>Draft preview</strong>
			<span>Showing unpublished Storyblok content.</span>
			<a href={exitHref}>Exit preview</a>
		</div>
	);
}
