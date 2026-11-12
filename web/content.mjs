export const site = {
  name: 'Global AI Handbook',
  origin: 'https://docs.globalai.community',
  repository: 'https://github.com/GlobalAICommunity/docs',
};

export const sections = [
  { id: 'chapters', title: 'Chapters', label: 'Run a chapter', path: 'chapter-playbook/index.md' },
  { id: 'events', title: 'Events', label: 'Organize an event', path: 'events.md' },
  { id: 'resources', title: 'Resources', label: 'Tools & resources', path: 'resources/index.md' },
  { id: 'partners', title: 'Partners', label: 'Partner with us', path: 'partnerships/overview.md' },
  { id: 'updates', title: 'Updates', label: 'Updates & archive', path: 'updates/index.md' },
];

export const directories = {
  'chapter-playbook': 'chapters',
  'chapter-benefits': 'resources',
  'organisers-101': 'events',
  'agentcon': 'events',
  'global-ai-conference': 'events',
  'agentcamp': 'events',
  'build': 'updates',
  'branding': 'resources',
  'partnerships': 'partners',
  'chapter-leads-meeting': 'updates',
  'resources': 'resources',
  'updates': 'updates',
};

const rootSections = {
  'new-chapter.md': 'chapters',
  'event-format.md': 'events',
  'conference.md': 'events',
  'events.md': 'events',
  'agentic-nights.md': 'events',
  'global-ai-connect.md': 'events',
  'global-ai-on-tour.md': 'events',
  'construct.md': 'events',
  'hq-organized-events.md': 'events',
  'partner-led-events.md': 'events',
  'ai-community-day.md': 'updates',
  'event-photography-checklist.md': 'resources',
  'platform-event-management.md': 'resources',
  'presentations.md': 'resources',
  'workshops.md': 'resources',
  'streamyard.md': 'resources',
  'payment.md': 'partners',
};

export const navigation = {
  chapters: [
    ['Get started', ['chapter-playbook/index.md', 'new-chapter.md', 'chapter-playbook/onboarding.md']],
    ['Run your chapter', ['chapter-playbook/requirements.md', 'chapter-playbook/code-of-conduct.md', 'chapter-playbook/discord.md', 'chapter-playbook/linkedin.md', 'chapter-playbook/advisory-board.md']],
    ['Useful next steps', ['organisers-101/index.md', 'chapter-benefits/index.md', 'branding/index.md']],
  ],
  events: [
    ['Overview', ['events.md', 'event-format.md']],
    ['Seasonal events', ['global-ai-on-tour.md', 'agentic-nights.md', 'agentcamp/index.md', 'global-ai-connect.md', 'construct.md']],
    ['Year-round events', ['global-ai-conference/index.md', 'conference.md', 'partner-led-events.md', 'hq-organized-events.md', 'agentcon/index.md']],
    ['Organizer guide', ['organisers-101/index.md', 'event-photography-checklist.md']],
    ['Community Connect guide', ['global-ai-conference/eligibility-and-roles.md', 'global-ai-conference/application-and-timeline.md', 'global-ai-conference/call-for-speaker-content.md', 'global-ai-conference/venue-logistics.md', 'global-ai-conference/marketing-branding.md', 'global-ai-conference/post-event.md']],
  ],
  resources: [
    ['Find a resource', ['resources/index.md', 'chapter-benefits/index.md']],
    ['Tools & benefits', ['chapter-benefits/azure.md', 'chapter-benefits/azure-client.md', 'chapter-benefits/canva.md', 'streamyard.md']],
    ['Content & creative', ['workshops.md', 'presentations.md', 'branding/index.md', 'event-photography-checklist.md']],
  ],
  partners: [
    ['Work with us', ['partnerships/overview.md', 'partnerships/community-partner.md', 'partnerships/partner.md', 'partnerships/strategic-partner.md']],
    ['Sponsorship & content', ['partnerships/newsletter.md']],
    ['Already a partner', ['payment.md']],
  ],
  updates: [
    ['Community updates', ['updates/index.md', 'chapter-leads-meeting/index.md', 'chapter-leads-meeting/august-2026.md', 'chapter-leads-meeting/july-2026.md', 'chapter-leads-meeting/february-2026.md', 'chapter-leads-meeting/january-2026.md', 'chapter-leads-meeting/december-2025.md', 'chapter-leads-meeting/november-2025.md']],
    ['Previous programs', ['agentcamp/register.md', 'agentcamp/content.md', 'agentcamp/branding.md', 'agentcamp/faq.md', 'agentcamp/benefits.md', 'build/organize.md', 'build/content.md', 'build/register.md', 'build/branding.md', 'build/reimbursement.md', 'ai-community-day.md']],
    ['Previous tools', ['chapter-benefits/meetup.md']],
  ],
};

const reviewNotes = {
  application: 'The start-a-chapter and onboarding guides currently link to different application forms. Confirm the current application route with support@globalai.community before applying.',
  meetup: 'This guide still refers to setting up a Meetup group, but later community updates announce the retirement of Meetup support. Confirm current setup instructions with support@globalai.community.',
};

// These are editorial review flags, not replacements for the policies they describe.
export const overrides = {
  'chapter-playbook/index.md': { headingAliases: { 'chapter-playbook': 'run-a-chapter', 'quick-reference': 'what-do-you-need-to-do' } },
  'agentic-nights.md': { headingAliases: { 'organizing-your-event': 'organizer-checklist' } },
  'branding/index.md': { headingAliases: { 'typography-specifications': 'typography', 'primary-colors': 'colors', 'accent-colors': 'colors', 'gray-scale': 'colors', 'color-usage-guidelines': 'accessibility' } },
  'new-chapter.md': { review: [reviewNotes.application], summary: 'Eligibility, responsibilities, and the application process for a new local chapter.' },
  'chapter-playbook/onboarding.md': { review: [reviewNotes.application, reviewNotes.meetup] },
  'chapter-playbook/requirements.md': { review: ['The escalation process at the end of this page is a proposal, not an approved policy.'] },
  'chapter-playbook/offboarding.md': { status: 'draft' },
  'chapter-playbook/transferring.md': { status: 'draft' },
  'chapter-playbook/code-of-conduct.md': { review: ['The linked chapter offboarding process is still a draft. The official Code of Conduct remains the authoritative reference.'] },
  'chapter-benefits/meetup.md': { status: 'archived', section: 'updates', title: 'Meetup retirement notice' },
  'chapter-benefits/canva.md': { review: ['The request process is marked as being updated. Confirm availability and current eligibility with support before relying on this benefit.'] },
  'streamyard.md': { review: ['The asset-download instructions reference the retired Umbraco dashboard. Request the current workflow from support.'] },
  'platform-event-management.md': { status: 'draft', summary: 'A placeholder for future event publishing, registration, check-in, and reporting guidance.' },
  'partnerships/overview.md': {
    navTitle: 'Explore partnerships',
    headingAliases: {
      'why-partner-with-the-global-ai-community': 'good-partnerships-start-with-something-worth-sharing',
      'partnership-levels': 'find-your-fit',
      'our-community-ecosystem': 'local-connections-more-ways-to-contribute',
      'expose-your-products-and-services': 'give-people-the-tools-to-try-an-idea',
      'agentcon-2027-sponsorship': 'global-ai-conference-2027-sponsorship',
    },
    review: ['Audience metrics are under review across partner materials. Request dated, approved figures from HQ when preparing an agreement.'],
  },
  'partnerships/partnership-proposal.md': { summary: 'A specific partnership proposal, not the standard public partnership terms.' },
  'conference.md': { summary: 'The HQ-run conference series for developers building with AI agents, previously known as AgentCon.' },
  'agentcon/index.md': { navTitle: 'AgentCon announcement', summary: 'AgentCon is discontinued and continues as the Global AI Conference. AgentCon Singapore is the final AgentCon event.' },
  'events.md': { navTitle: 'Events overview' },
  'event-format.md': { navTitle: 'Event calendar & formats', headingAliases: { 'global-ai-conference': 'global-ai-community-connect' } },
  'hq-organized-events.md': { headingAliases: { agentcon: 'global-ai-conference' } },
  'global-ai-conference/index.md': {
    navTitle: 'Global AI Community Connect',
    summary: 'The open, chapter-organized conference format previously called the Global AI Conference.',
    headingAliases: { 'the-global-ai-conference-organizer-guide': 'global-ai-community-connect-organizer-guide' },
  },
  'global-ai-conference/call-for-speaker-content.md': {
    navTitle: 'Call for speakers template',
    headingAliases: { 'global-ai-conference-call-for-speakers-cfs-page': 'global-ai-community-connect-call-for-speakers-cfs-page' },
  },
  'global-ai-conference/application-and-timeline.md': { review: ['The application form is not linked in this guide yet. Contact hq@globalai.community for the current application route.'] },
  'agentcamp/index.md': { summary: 'The Global AI Bootcamp season for February–April 2027. Organizer materials are still to be announced.' },
  'agentcamp/register.md': { title: 'AgentCamp 2026 · registration' },
  'agentcamp/content.md': { title: 'AgentCamp 2026 · workshops & talks' },
  'agentcamp/branding.md': { title: 'AgentCamp 2026 · branding' },
  'agentcamp/faq.md': { title: 'AgentCamp 2026 · FAQ' },
  'agentcamp/benefits.md': { title: 'AgentCamp 2026 · benefits' },
  'build/organize.md': { title: 'Build //localhost 2026 · organizer guide' },
  'build/register.md': { title: 'Build //localhost 2026 · registration' },
  'build/content.md': { title: 'Build //localhost 2026 · content' },
  'build/branding.md': { title: 'Build //localhost 2026 · branding' },
  'build/reimbursement.md': { title: 'Build //localhost 2026 · reimbursement' },
  'ai-community-day.md': { status: 'archived', review: ['The original program date range is ambiguous. These instructions are retained for reference, not as a current event offer.'] },
  'presentations.md': { summary: 'Reusable presentation decks, with source editions identified for organizers.', review: ['These materials include 2025 editions. Check the linked repositories and demos before delivery; inclusion is not a guarantee that every technical step is current.'] },
  'workshops.md': { summary: 'Hands-on workshops with duration, skill level, and Azure requirements.', review: ['These workshops come from the 2025 Bootcamp edition. Check the linked instructions and prerequisites before using them at a new event.'] },
};

const conferenceSite = 'https://globalaiconference.city/';

// Removed pages keep their URLs as redirects. Targets are handbook paths or external URLs.
export const redirects = {
  'agentcon/events.md': conferenceSite,
  'agentcon/sponsors.md': `${conferenceSite}sponsor.html`,
  'partnerships/agentcon-sponsorship.md': `${conferenceSite}sponsor.html`,
  ...Object.fromEntries(['appendices', 'application-and-approval-process', 'core-requirments', 'day-of-event-playbook',
    'eligibility-and-roles', 'event-overview', 'marketing-promotion-branding', 'planning-timeline', 'post-event tasks', 'venue-logistics']
    .map(name => [`agentcon/${name}.md`, 'conference.md'])),
};

export function metadataFor(path) {
  const directory = path.split('/')[0];
  const section = path === 'index.md' ? null : directories[directory] ?? rootSections[path];
  if (section === undefined) throw new Error(`Assign a section to ${path} in web/content.mjs.`);
  let status = 'current';
  if (directory === 'build' || (directory === 'agentcamp' && path !== 'agentcamp/index.md')) status = 'archived';
  if (directory === 'chapter-leads-meeting' && path !== 'chapter-leads-meeting/index.md') status = 'historical';
  return { section, status, review: [], ...overrides[path], ...(status === 'archived' ? { section: 'updates' } : {}) };
}

export function pathToUrl(path) {
  return '/' + path.replace(/(^|\/)index\.md$/, '$1').replace(/\.md$/, '.html')
    .split('/').map(encodeURIComponent).join('/');
}
