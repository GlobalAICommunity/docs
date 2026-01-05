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
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/new-chapter' }
    ],
    sidebar: [
      {
        text: 'Chapter',
        items: [
          { text: 'Start a new chapter', link: '/new-chapter' },
          { text: 'Chapter Onboarding', link: '/chapter-onboarding' },
        ]
      },      
      {
        text: 'Chapter Benefits',
        items: [
          { text: 'Azure Subscriptions', 
            collapsed: true,
            items: [
              { text: 'For organizers', link:  '/azure'},
              { text: 'For attendees', link: '/azure-client' },
            ] 
          },
          { text: 'Slack', link: '/slack' },
          { text: 'MeetUp', link: '/meetup' },
          { text: 'StreamYard', link: '/streamyard' },
          { text: 'Digital Badges', link: '/badges' }
        ]
      },
      {
        text: 'Chapter Lead Meetings',
        collapsed: true,
        items: [
          { text: 'December 2025', link: '/chapter-leads-meeting/december-2025' },
          { text: 'November 2025', link: '/chapter-leads-meeting/november-2025' },
        ]
      },
      {
        text: 'Global AI Branding',
        items: [
          { text: 'Branding Assets and Design Guidelines', link: '/branding' },
        ]
      },
      {
        text:'Content',
        items: [
          { text: 'Workshops',link: '/workshops'},
          { text: 'Presentations',link: '/presentations'}
        ]
      },      
      {
        text: 'Events Resources',
        items: [
          { text: 'Organizer 101',link:'/organisers-101/',
            collapsed: true,
            items:[
              {text: 'Email Templates',
                items:[
                  {text: 'Speaker Communication Template', link:'/organisers-101/speaker-communication-template/'},
                ]
              },
              { text: 'Event Photography Checklist',link:'/event-photography-checklist/'},
            ]
          }
        ]
      },         
      {
        text: 'Event formats',
        collapsed: false,            
        items: [             
          { text: 'AI Community Day', link:  '/ai-community-day'},
          { text: 'AgentCon', link: '/agentcon/',
            collapsed: true,
            items: [
              { text: 'Eligibility and Roles', link: '/agentcon/eligibility-and-roles' },
              { text: 'Event Overview', link: '/agentcon/event-overview' },
              { text: 'Core Requirments', link: '/agentcon/core-requirments' },
              { text: 'Application and Approval Process', link: '/agentcon/application-and-approval-process' },
              { text: 'Planning Timeline', link: '/agentcon/planning-timeline' },
              { text: 'Venue & Logistics', link: '/agentcon/venue-logistics' },
              { text: 'Marketing, Promotion & Branding Guidelines', link: '/agentcon/marketing-promotion-branding' },
              { text: 'Day-of-Event Playbook', link: '/agentcon/day-of-event-playbook' },
              { text: 'Post-Event Tasks', link: '/agentcon/post-event tasks' },
              { text: 'Appendices', link: '/agentcon/appendices' },
              { text: 'Sponsors', link: '/agentcon/sponsors' },
            ]
          },
          { text: 'AgentCamp 2026', link: '/agentcamp/',
            collapsed: true,
            items: [
              { text: 'Register', link: '/agentcamp/register' },
              { text: 'Branding', link: '/agentcamp/branding' },
              { text: 'Content', link: '/agentcamp/content' },
              { text: 'Benefits', link: '/agentcamp/benefits' },
              { text: 'FAQ', link: '/agentcamp/faq' },
            ]
          },
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/GlobalAICommunity/docs' },
      { icon: 'x', link: 'https://x.com/GlobAICommunity' },
      { icon: 'linkedin', link: 'https://www.linkedin.com/company/global-ai-community' }
    ],
    editLink: {
      pattern: 'https://github.com/GlobalAICommunity/docs/edit/main/:path',
      text: 'Edit this page on GitHub'
    },
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-present Global AI Community'
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
