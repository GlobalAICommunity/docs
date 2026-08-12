import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Global AI Community",
  description: "Documentation for Chapters",
  markdown: {
    image: {
     
      lazyLoading: true
    }
  },
  themeConfig: {
    logo: 'https://globalai.community/images/favicon.ico',
    i18nRouting: true,
    externalLinkIcon: true,
    nav: [
      { text: 'Chapter Playbook', link: '/chapter-playbook/' },
      { text: 'Event Formats', link: '/event-format' },
      { text: 'Partnerships', link: '/partnerships/overview' }
    ],
    sidebar: [
      {
        text: 'Chapter Playbook', link: '/chapter-playbook/',
        collapsed: true,
        items: [
          { text: 'Start', link: '/new-chapter' },
          { text: 'Onboarding', link: '/chapter-playbook/onboarding' },
          { text: 'Requirements', link: '/chapter-playbook/requirements' },
          { text: 'Offboarding', link: '/chapter-playbook/offboarding' },
          { text: 'Transfer', link: '/chapter-playbook/transferring' },
          { text: 'Code of Conduct', link: '/chapter-playbook/code-of-conduct' },
          { text: 'Advisory Board', link: '/chapter-playbook/advisory-board' },
          { text: 'Discord', link: '/chapter-playbook/discord' },
          { text: 'LinkedIn', link: '/chapter-playbook/linkedin' },
          { text: 'Organizing Events', link: '/organisers-101/' },
          { text: 'Event Photography', link: '/event-photography-checklist' },
        ]
      },
      {
        text: 'Chapter Benefits', link: '/chapter-benefits/',
        collapsed: true,
        items: [
          { text: 'Azure Subscriptions', 
            collapsed: true,
            items: [
              { text: 'For organizers', link:  '/chapter-benefits/azure'},
              { text: 'For attendees', link: '/chapter-benefits/azure-client' },
            ] 
          },
          { text: 'Canva Pro', link: '/chapter-benefits/canva' },
        ]
      },
      {
        text: 'Chapter Leads Meetings', link: '/chapter-leads-meeting/',
        collapsed: true,
        items: [
          { text: 'August 2026', link: '/chapter-leads-meeting/august-2026' },
          { text: 'July 2026', link: '/chapter-leads-meeting/july-2026' },
          { text: 'February 2026', link: '/chapter-leads-meeting/february-2026' },
          { text: 'January 2026', link: '/chapter-leads-meeting/january-2026' },
          { text: 'December 2025', link: '/chapter-leads-meeting/december-2025' },
          { text: 'November 2025', link: '/chapter-leads-meeting/november-2025' },
        ]
      },
      {
        text: 'Global AI Branding',
        collapsed: true,
        items: [
          { text: 'Branding Assets and Design Guidelines', link: '/branding' },
        ]
      }, 
      {
        text: 'Event Formats',
        link: '/event-format',
        collapsed: false,
        items: [
          { text: 'Overview', link: '/event-format' },
          {
            text: 'Seasonal events 2026/2027',
            collapsed: false,
            items: [
              { text: 'Global AI On Tour', link: '/global-ai-on-tour' },
              { text: 'Global AI Nights', link: '/agentic-nights' },
              { text: 'Global AI Bootcamp', link: '/agentcamp/' },
              { text: 'Global AI Connect', link: '/global-ai-connect' },
              { text: 'Global AI Construct', link: '/construct' },
            ]
          },
          {
            text: 'Year-round events',
            collapsed: true,
            items: [
              {
                text: 'Global AI Conference',
                link: '/global-ai-conference/',
                collapsed: true,
                items: [
                  { text: 'Eligibility and Roles', link: '/global-ai-conference/eligibility-and-roles' },
                  { text: 'Application, Approval & Timeline', link: '/global-ai-conference/application-and-timeline' },
                  { text: 'Call for Speaker Content', link: '/global-ai-conference/call-for-speaker-content' },
                  { text: 'Venue, Logistics & Event Day', link: '/global-ai-conference/venue-logistics' },
                  { text: 'Marketing, Promotion & Branding', link: '/global-ai-conference/marketing-branding' },
                  { text: 'Post-Event, Resources & Sponsors', link: '/global-ai-conference/post-event' },
                ]
              },
            ]
          },
          {
            text: 'Partner-led opportunities',
            link: '/partner-led-events',
            collapsed: true,
            items: [
              { text: 'GitHub Dev Day', link: '/partner-led-events#github-dev-day' },
            ]
          },
          {
            text: 'HQ-organized events',
            link: '/hq-organized-events',
            collapsed: true,
            items: [
              {
                text: 'AgentCon',
                link: '/agentcon/',
                collapsed: true,
                items: [
                  { text: 'Events', link: '/agentcon/events' },
                  { text: 'Eligibility and Roles', link: '/agentcon/eligibility-and-roles' },
                  { text: 'Event Overview', link: '/agentcon/event-overview' },
                  { text: 'Core Requirements', link: '/agentcon/core-requirments' },
                  { text: 'Invitation and Approval Process', link: '/agentcon/application-and-approval-process' },
                  { text: 'Planning Timeline', link: '/agentcon/planning-timeline' },
                  { text: 'Venue & Logistics', link: '/agentcon/venue-logistics' },
                  { text: 'Marketing, Promotion & Branding', link: '/agentcon/marketing-promotion-branding' },
                  { text: 'Day-of-Event Playbook', link: '/agentcon/day-of-event-playbook' },
                  { text: 'Post-Event Tasks', link: '/agentcon/post-event tasks' },
                  { text: 'Appendices', link: '/agentcon/appendices' },
                  { text: 'Sponsors', link: '/agentcon/sponsors' },
                ]
              },
              { text: 'Fly With Copilot', link: '/hq-organized-events#fly-with-copilot' },
              { text: 'Future of Work Summit', link: '/hq-organized-events#future-of-work-summit' },
              { text: 'MCP Community Days', link: '/hq-organized-events#mcp-community-days' },
            ]
          },
        ]
      },
      {
        text:'Partnerships',
        link: '/partnerships/overview',
        collapsed: true,
        items: [
          { text: 'Overview',
            link: '/partnerships/overview',
            collapsed: false,
              items: [
                { text: 'Community Partner', link:  '/partnerships/community-partner'},
                { text: 'Partner', link: '/partnerships/partner' },
                { text: 'Strategic Partner', link: '/partnerships/strategic-partner' },
              ] 
          },
          { text: 'Newsletter',link: '/partnerships/newsletter'},
          { text: 'AgentCon 2027 Sponsorship', link: '/partnerships/agentcon-sponsorship' }
        ]
      },      
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/GlobalAICommunity/docs' },
      { icon: 'x', link: 'https://x.com/GlobAICommunity' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/company/global-ai-community' },
      { icon: 'discord', link: 'https://discord.gg/NMryZKPC3m' }
    ],
    editLink: {
      pattern: 'https://github.com/GlobalAICommunity/docs/edit/main/:path',
      text: 'Edit this page on GitHub'
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present Global AI Community'
    },
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    search: {
      provider: 'local'
    }
  }
})
