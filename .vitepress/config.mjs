import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "Global AI Community",
  description: "Documentation for Chapters",
  themeConfig: {
    logo: '/media/icon.png',
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
          { text: 'Digital Badges', link: '/badges' },
          { text: 'Streamyard', link: '/streamyard' }
        ]
      },
      {
        text: 'Events',
        items: [
          { text: 'Global AI Bootcamp 2025', link: '/global-ai-bootcamp-2025' },
          { text: 'AgentCon 2025', link: '/agentcon' }
        ]
      }
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/GlobalAICommunity/docs' }
    ]
  }
})
