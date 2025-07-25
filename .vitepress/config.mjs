import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Global AI Community",
  description: "Documentation for Chapters",
  themeConfig: {
    logo: 'https://globalai.community/images/favicon.ico',
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Documentation', link: '/new-chapter' }
    ],
    sidebar: [
      {
        text: 'General',
        items: [
          { text: 'Start a new chapter', link: '/new-chapter' },
        ]
      },
      {
        text: 'Benefits',
        items: [
          { text: 'Azure Subscriptions', 
            items: [
              { text: 'For organizers', link:  '/azure'},
              { text: 'For attendees', link: '/azure-client' },
            ] 
          },
          { text: 'Slack', link: '/slack' },
          { text: 'MeetUp', link: '/meetup' },
          { text: 'Digital Badges', link: '/badges' }
        ]
      },
      {
        text:'Platform',
        items: [
          { text: 'Event Management',link: '/platform-event-management'}
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
        text: 'Events',
        items: [
          { text: 'Organizer 101',link:'/organize-events'},
          {
            text: 'Event formats',
            link: '/events',
            items: [
              { text: 'Global Agentic Nights', link:  '/agentic-nights'},
              { text: 'AI Community Day', link:  '/ai-community-day'},
              { text: 'AgentCon', link: '/agentcon' },
              { text: 'Global AI Bootcamp 2026', link: '/global-ai-bootcamp-2026' },
            ]
          }
        ]
      }
    ],
    socialLinks: [
      { icon: 'github', link: 'https://github.com/GlobalAICommunity/docs' }
    ]
  }
})
