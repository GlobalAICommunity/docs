export const site = {
  name: 'Global AI Handbook',
  origin: 'https://docs.globalai.community',
  repository: 'https://github.com/GlobalAICommunity/docs',
};

export const sections = [
  { id: 'chapters', title: 'Chapters', label: 'Run a chapter', path: 'chapter-playbook/index.md' },
  { id: 'events', title: 'Events', label: 'Organize an event', path: 'event-format.md' },
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
    ['Plan an event', ['event-format.md', 'organisers-101/index.md', 'event-photography-checklist.md']],
    ['Seasonal programs', ['global-ai-on-tour.md', 'agentic-nights.md', 'agentcamp/index.md', 'global-ai-connect.md', 'construct.md']],
    ['Global AI Conference', ['global-ai-conference/index.md', 'global-ai-conference/eligibility-and-roles.md', 'global-ai-conference/application-and-timeline.md', 'global-ai-conference/call-for-speaker-content.md', 'global-ai-conference/venue-logistics.md', 'global-ai-conference/marketing-branding.md', 'global-ai-conference/post-event.md']],
    ['AgentCon · invited organizers', ['agentcon/index.md', 'agentcon/events.md', 'agentcon/eligibility-and-roles.md', 'agentcon/event-overview.md', 'agentcon/core-requirments.md', 'agentcon/application-and-approval-process.md', 'agentcon/planning-timeline.md', 'agentcon/venue-logistics.md', 'agentcon/marketing-promotion-branding.md', 'agentcon/day-of-event-playbook.md', 'agentcon/post-event tasks.md', 'agentcon/appendices.md', 'agentcon/sponsors.md']],
    ['Other opportunities', ['partner-led-events.md', 'hq-organized-events.md']],
  ],
  resources: [
    ['Find a resource', ['resources/index.md', 'chapter-benefits/index.md']],
    ['Tools & benefits', ['chapter-benefits/azure.md', 'chapter-benefits/azure-client.md', 'chapter-benefits/canva.md', 'streamyard.md']],
    ['Content & creative', ['workshops.md', 'presentations.md', 'branding/index.md', 'event-photography-checklist.md']],
  ],
  partners: [
    ['Work with us', ['partnerships/overview.md', 'partnerships/community-partner.md', 'partnerships/partner.md', 'partnerships/strategic-partner.md']],
    ['Sponsorship & content', ['partnerships/agentcon-sponsorship.md', 'agentcon/events.md', 'partnerships/newsletter.md']],
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
  slack: 'This page refers to Slack. The January 2026 update announced a move to Discord; whether this program retains a separate Slack workspace needs confirmation from HQ.',
  attendance: 'The general AgentCon guidance specifies 300 attendees, while confirmed event targets vary, including 150 and 400. Confirm the requirements and commitments for your event with HQ.',
  schedule: 'The standard event hours differ from some confirmed event listings. Use the agreed local schedule and confirm it with HQ.',
};

// These are editorial review flags, not replacements for the policies they describe.
export const overrides = {
  'chapter-playbook/index.md': { headingAliases: { 'chapter-playbook': 'run-a-chapter', 'quick-reference': 'what-do-you-need-to-do' } },
  'branding/index.md': { headingAliases: { 'typography-specifications': 'typography', 'primary-colors': 'colors', 'accent-colors': 'colors', 'gray-scale': 'colors', 'color-usage-guidelines': 'accessibility' } },
  'new-chapter.md': { review: [reviewNotes.application], summary: 'Eligibility, responsibilities, and the application process for a new local chapter.' },
  'event-format.md': { review: [reviewNotes.slack] },
  'chapter-playbook/onboarding.md': { review: [reviewNotes.application, reviewNotes.meetup] },
  'chapter-playbook/requirements.md': { review: ['The escalation process at the end of this page is a proposal, not an approved policy.'] },
  'chapter-playbook/offboarding.md': { status: 'draft' },
  'chapter-playbook/transferring.md': { status: 'draft' },
  'chapter-playbook/code-of-conduct.md': { review: ['The linked chapter offboarding process is still a draft. The official Code of Conduct remains the authoritative reference.'] },
  'chapter-playbook/advisory-board.md': { review: [reviewNotes.slack] },
  'chapter-benefits/meetup.md': { status: 'archived', section: 'updates', title: 'Meetup retirement notice' },
  'chapter-benefits/canva.md': { review: ['The request process is marked as being updated. Confirm availability and current eligibility with support before relying on this benefit.'] },
  'streamyard.md': { review: [reviewNotes.slack, 'The asset-download instructions reference the retired Umbraco dashboard. Request the current workflow from support.'] },
  'platform-event-management.md': { status: 'draft', summary: 'A placeholder for future event publishing, registration, check-in, and reporting guidance.' },
  'partnerships/overview.md': { review: ['Community reach figures are not dated and differ across documents. Confirm current audience metrics with HQ when preparing an agreement.'] },
  'partnerships/agentcon-sponsorship.md': { review: [reviewNotes.attendance, 'The description of events hosted by 200+ chapters needs reconciliation with the invite-only 2027 program.'] },
  'partnerships/partnership-proposal.md': { review: [reviewNotes.attendance], summary: 'A specific partnership proposal, not the standard public partnership terms.' },
  'agentcon/index.md': { navTitle: 'Organizer guide', summary: 'The HQ-led, invite-only conference series for developers building with AI agents.' },
  'agentcon/eligibility-and-roles.md': { review: [reviewNotes.attendance, reviewNotes.slack] },
  'agentcon/event-overview.md': { review: [reviewNotes.attendance, reviewNotes.schedule] },
  'agentcon/core-requirments.md': { review: [reviewNotes.attendance] },
  'agentcon/venue-logistics.md': { review: [reviewNotes.attendance] },
  'agentcon/application-and-approval-process.md': { review: [reviewNotes.slack] },
  'agentcon/events.md': { navTitle: 'Events & locations', summary: 'Confirmed and proposed AgentCon locations, dates, venues, and attendance targets.' },
  'global-ai-conference/index.md': { navTitle: 'Organizer guide' },
  'global-ai-conference/call-for-speaker-content.md': { navTitle: 'Call for speakers template' },
  'global-ai-conference/eligibility-and-roles.md': { review: [reviewNotes.slack] },
  'global-ai-conference/application-and-timeline.md': { review: [reviewNotes.slack, 'The application form is not linked in this guide yet. Contact hq@globalai.community for the current application route.'] },
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
