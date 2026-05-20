import Link from 'next/link';
import {
	StoryblokServerComponent,
	StoryblokServerRichText,
	storyblokEditable,
} from '@storyblok/react/rsc';

function asBlocks(value) {
	return Array.isArray(value) ? value : [];
}

function isExternalHref(href) {
	return /^https?:\/\//.test(href);
}

function SmartLink({ href, children, className, ...props }) {
	if (!href) {
		return (
			<span className={className} {...props}>
				{children}
			</span>
		);
	}

	if (isExternalHref(href)) {
		return (
			<a
				className={className}
				href={href}
				rel="noreferrer"
				target="_blank"
				{...props}
			>
				{children}
			</a>
		);
	}

	return (
		<Link className={className} href={href} {...props}>
			{children}
		</Link>
	);
}

export function Page({ blok }) {
	const navItems = asBlocks(blok.nav_items);

	return (
		<div className="site-shell" {...storyblokEditable(blok)}>
			<header className="site-header">
				<Link className="brand-mark" href="/">
					<span className="brand-badge">B</span>
					<span>
						<strong>{blok.brand_name || 'Storyblok + Vercel'}</strong>
						<small>{blok.brand_caption || 'Composable preview demo'}</small>
					</span>
				</Link>
				<nav aria-label="Main navigation" className="site-nav">
					{navItems.map((nestedBlok) => (
						<StoryblokServerComponent
							blok={nestedBlok}
							key={nestedBlok._uid}
						/>
					))}
				</nav>
			</header>

			<main>
				{asBlocks(blok.body).map((nestedBlok) => (
					<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
			</main>

			<footer className="site-footer">
				<span>Storyblok Visual Editor-ready blocks rendered by Next.js.</span>
				<span>Deployable on Vercel preview and production environments.</span>
			</footer>
		</div>
	);
}

export function NavItem({ blok }) {
	return (
		<SmartLink
			className="nav-link"
			href={blok.href || '/'}
			{...storyblokEditable(blok)}
		>
			{blok.label}
		</SmartLink>
	);
}

export function HeroSection({ blok }) {
	const panelItems = asBlocks(blok.panel_items);

	return (
		<section className="hero-section" {...storyblokEditable(blok)}>
			<div className="hero-copy">
				<p className="eyebrow">{blok.eyebrow}</p>
				<h1>{blok.headline}</h1>
				<p className="hero-summary">{blok.summary}</p>
				<div className="hero-actions">
					<SmartLink className="button button-primary" href={blok.primary_href}>
						{blok.primary_label}
					</SmartLink>
					<SmartLink className="button button-secondary" href={blok.secondary_href}>
						{blok.secondary_label}
					</SmartLink>
				</div>
			</div>

			<div className="hero-visual">
				{blok.visual_image_url ? (
					<img
						alt={blok.visual_alt || ''}
						className="hero-image"
						src={blok.visual_image_url}
					/>
				) : null}
				<div className="hero-panel">
					<span className="panel-kicker">{blok.panel_kicker}</span>
					<strong>{blok.panel_title}</strong>
					<div className="panel-list">
						{panelItems.map((nestedBlok) => (
							<StoryblokServerComponent
								blok={nestedBlok}
								key={nestedBlok._uid}
							/>
						))}
					</div>
				</div>
			</div>
		</section>
	);
}

export function HeroPanelItem({ blok }) {
	return (
		<div className="panel-row" {...storyblokEditable(blok)}>
			<span>{blok.label}</span>
			<strong>{blok.value}</strong>
		</div>
	);
}

export function IntegrationPanel({ blok }) {
	const nodes = asBlocks(blok.nodes);

	return (
		<section className="section integration-section" {...storyblokEditable(blok)}>
			<div className="section-heading">
				<p className="eyebrow">{blok.eyebrow}</p>
				<h2>{blok.heading}</h2>
				<p>{blok.description}</p>
			</div>
			<div className="integration-flow">
				{nodes.map((nestedBlok) => (
					<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
			</div>
		</section>
	);
}

export function IntegrationNode({ blok }) {
	return (
		<article className="integration-node" {...storyblokEditable(blok)}>
			<span>{blok.badge}</span>
			<h3>{blok.title}</h3>
			<p>{blok.description}</p>
		</article>
	);
}

export function MetricStrip({ blok }) {
	return (
		<section className="metric-strip" {...storyblokEditable(blok)}>
			<div>
				<p className="eyebrow">{blok.eyebrow}</p>
				<h2>{blok.heading}</h2>
			</div>
			<div className="metric-grid">
				{asBlocks(blok.metrics).map((nestedBlok) => (
					<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
			</div>
		</section>
	);
}

export function Metric({ blok }) {
	return (
		<div className="metric" {...storyblokEditable(blok)}>
			<strong>{blok.value}</strong>
			<span>{blok.label}</span>
			<p>{blok.detail}</p>
		</div>
	);
}

export function FeatureGrid({ blok }) {
	return (
		<section className="section" {...storyblokEditable(blok)}>
			<div className="section-heading">
				<p className="eyebrow">{blok.eyebrow}</p>
				<h2>{blok.heading}</h2>
				<p>{blok.description}</p>
			</div>
			<div className="feature-grid">
				{asBlocks(blok.features).map((nestedBlok) => (
					<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
			</div>
		</section>
	);
}

export function FeatureCard({ blok }) {
	return (
		<article className="feature-card" {...storyblokEditable(blok)}>
			<span>{blok.tag}</span>
			<h3>{blok.title}</h3>
			<p>{blok.description}</p>
		</article>
	);
}

export function WorkflowSection({ blok }) {
	return (
		<section className="section workflow-section" {...storyblokEditable(blok)}>
			<div className="section-heading">
				<p className="eyebrow">{blok.eyebrow}</p>
				<h2>{blok.heading}</h2>
			</div>
			<div className="workflow-list">
				{asBlocks(blok.steps).map((nestedBlok) => (
					<StoryblokServerComponent blok={nestedBlok} key={nestedBlok._uid} />
				))}
			</div>
		</section>
	);
}

export function WorkflowStep({ blok }) {
	return (
		<article className="workflow-step" {...storyblokEditable(blok)}>
			<span>{blok.label}</span>
			<div>
				<h3>{blok.title}</h3>
				<p>{blok.description}</p>
			</div>
		</article>
	);
}

export function RichTextSection({ blok }) {
	return (
		<section className="section rich-text-section" {...storyblokEditable(blok)}>
			<div className="section-heading">
				<p className="eyebrow">{blok.eyebrow}</p>
				<h2>{blok.heading}</h2>
			</div>
			<div className="rich-text">
				<StoryblokServerRichText doc={blok.body} />
			</div>
		</section>
	);
}

export function CtaSection({ blok }) {
	return (
		<section className="cta-section" {...storyblokEditable(blok)}>
			<div>
				<p className="eyebrow">{blok.eyebrow}</p>
				<h2>{blok.heading}</h2>
				<p>{blok.description}</p>
			</div>
			<div className="hero-actions">
				<SmartLink className="button button-primary" href={blok.primary_href}>
					{blok.primary_label}
				</SmartLink>
				<SmartLink className="button button-secondary" href={blok.secondary_href}>
					{blok.secondary_label}
				</SmartLink>
			</div>
		</section>
	);
}
