import './globals.css';

export const metadata = {
	title: 'Storyblok + Vercel Demo',
	description:
		'A Storyblok CMS demo rendered with Next.js and ready for Vercel previews.',
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
