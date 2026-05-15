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
      { text: 'Documentation', link: '/new-chapter' },
      { text: 'AgentCon', link: '/agentcon/' },
      { text: 'Partnerships', link: '/partnerships/overview' }
    ],
    sidebar: [
      {
        text: 'Chapter',
        collapsed: true,
        items: [
          { text: 'Start a new chapter', link: '/new-chapter' },
          { text: 'Chapter Onboarding', link: '/chapter-onboarding' },
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
          { text: 'Discord', link: '/chapter-benefits/discord' },
          { text: 'MeetUp', link: '/chapter-benefits/meetup' },  
          { text: 'LinkedIn Showcase Page', link: '/chapter-benefits/linkedin-showcase-page' },        ,
          { text: 'Digital Badges', link: '/chapter-benefits/badges' },
          { text: 'Canva Pro', link: '/chapter-benefits/canva' },
        ]
      },
      {
        text: 'Chapter Leads Meetings', link: '/chapter-leads-meeting/',
        collapsed: true,
        items: [
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
        text: 'Events Resources',
        collapsed: true,
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
          { text: 'Build //LOCALHOST', link: '/build/organize',
            collapsed: true,
            items: [
              { text: 'Register', link: '/build/register' },
              { text: 'Branding', link: '/build/branding' },
              { text: 'Content', link: '/build/content' },
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
                { text: 'Community Friend', link:  '/partnerships/community-partner'},
                { text: 'Partner', link: '/partnerships/partner' },
                { text: 'Strategic Partner', link: '/partnerships/strategic-partner' },
              ] 
          },
          { text: 'Newsletter',link: '/partnerships/newsletter'},
          { text: 'AgentCon Sponsorship', link: '/partnerships/agentcon-sponsorship' }
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
