import './globals.css';

export const metadata = {
	title: 'Storyblok + Vercel Demo',
	description:
		'Visual Storyblok authoring with a Next.js frontend delivered on Vercel.',
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				{children}
			</body>
		</html>
	);
}
