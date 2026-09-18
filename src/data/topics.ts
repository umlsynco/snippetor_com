export type TopicColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'sky' | 'teal'

export interface Topic {
  slug: string
  title: string
  description: string
  count: number
  color: TopicColor
  icon: 'layers' | 'puzzle' | 'user' | 'clipboard' | 'globe' | 'shield' | 'window'
}

export const topics: Topic[] = [
  {
    slug: 'weblayer',
    title: 'WebLayer',
    description: 'Embedding, web platform integration, lifecycle and Android WebLayer.',
    count: 12,
    color: 'blue',
    icon: 'layers',
  },
  {
    slug: 'chrome-extensions',
    title: 'Chrome Extensions',
    description: 'Extension architecture, messaging, permissions and integration points.',
    count: 9,
    color: 'green',
    icon: 'puzzle',
  },
  {
    slug: 'profile',
    title: 'Profile',
    description: 'Browser profiles, contexts, initialization and lifetime management.',
    count: 8,
    color: 'purple',
    icon: 'user',
  },
  {
    slug: 'copy-paste',
    title: 'Copy & Paste',
    description: 'Clipboard pipeline, data transfer, permissions and platform differences.',
    count: 7,
    color: 'orange',
    icon: 'clipboard',
  },
  {
    slug: 'network-ssl',
    title: 'Network / SSL',
    description: 'Network stack, requests, certificates, SSL errors and security.',
    count: 10,
    color: 'red',
    icon: 'globe',
  },
  {
    slug: 'sandbox-zygote',
    title: 'Sandbox & Zygote',
    description: 'Process model, zygote, sandbox initialization and platform specifics.',
    count: 11,
    color: 'sky',
    icon: 'shield',
  },
  {
    slug: 'webui',
    title: 'WebUI',
    description: 'Internal pages, controllers, data sources and UI framework.',
    count: 9,
    color: 'teal',
    icon: 'window',
  },
]
