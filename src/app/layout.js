import './globals.css';
import StoryblokProvider from '@/components/StoryblokProvider';

export const metadata = {
	title: 'Storyblok + Vercel Demo',
	description:
		'A Storyblok CMS demo rendered with Next.js and ready for Vercel previews.',
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<StoryblokProvider>
					{children}
				</StoryblokProvider>
			</body>
		</html>
	);
}
