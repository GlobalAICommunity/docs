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
          { text: 'Azure Subscriptions', link: '/azure' },
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
        text: 'Events',
        items: [
          { text: 'Organizer 101',link:'/organize-events'},
          {
            text: 'Event formats',
            items: [
              { text: 'Global AI Agent Night', link:  '/agent-night'},
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
