export type TopicColor = 'blue' | 'green' | 'purple' | 'orange' | 'red' | 'sky' | 'teal'

export interface Topic {
  slug: string
  title: string
  pageTitle: string
  description: string
  pageDescription: string
  quote: string
  count: number
  color: TopicColor
  icon: 'layers' | 'puzzle' | 'user' | 'clipboard' | 'globe' | 'shield' | 'window'
}

export const topics: Topic[] = [
  {
    slug: 'weblayers',
    title: 'WebLayer',
    pageTitle: 'WebLayers',
    description: 'Embedding, web platform integration, lifecycle and Android WebLayer.',
    pageDescription:
      'Notes and walkthroughs about WebLayer, including embedding, lifecycle, Java/Kotlin integration, multi-process architecture and platform specifics.',
    quote: 'The web, everywhere.',
    count: 12,
    color: 'blue',
    icon: 'layers',
  },
  {
    slug: 'chromeextensions',
    title: 'Chrome Extensions',
    pageTitle: 'Chrome Extensions',
    description: 'Extension architecture, messaging, permissions and integration points.',
    pageDescription:
      'Notes and walkthroughs about Chrome Extensions, including manifest structure, service workers, content scripts, messaging and permissions.',
    quote: 'Small permissions, big power.',
    count: 9,
    color: 'green',
    icon: 'puzzle',
  },
  {
    slug: 'profile',
    title: 'Profile',
    pageTitle: 'Profile',
    description: 'Browser profiles, contexts, initialization and lifetime management.',
    pageDescription:
      'Notes and walkthroughs about browser profiles, including initialization, keyed services, multi-profile support and lifetime management.',
    quote: 'One browser, many identities.',
    count: 8,
    color: 'purple',
    icon: 'user',
  },
  {
    slug: 'copypaste',
    title: 'Copy & Paste',
    pageTitle: 'Copy & Paste',
    description: 'Clipboard pipeline, data transfer, permissions and platform differences.',
    pageDescription:
      'Notes and walkthroughs about the clipboard pipeline, including data formats, permissions, cross-process transfer and platform differences.',
    quote: 'Every byte, carried carefully.',
    count: 7,
    color: 'orange',
    icon: 'clipboard',
  },
  {
    slug: 'networkssl',
    title: 'Network / SSL',
    pageTitle: 'Network / SSL',
    description: 'Network stack, requests, certificates, SSL errors and security.',
    pageDescription:
      'Notes and walkthroughs about the network stack, including requests, caching, TLS, certificates and SSL error handling.',
    quote: 'Trust, verified in milliseconds.',
    count: 10,
    color: 'red',
    icon: 'globe',
  },
  {
    slug: 'sandboxzygote',
    title: 'Sandbox & Zygote',
    pageTitle: 'Sandbox & Zygote',
    description: 'Process model, zygote, sandbox initialization and platform specifics.',
    pageDescription:
      'Notes and walkthroughs about the process model, including the zygote, sandbox initialization and platform-specific hardening.',
    quote: 'Isolation by design.',
    count: 11,
    color: 'sky',
    icon: 'shield',
  },
  {
    slug: 'webui',
    title: 'WebUI',
    pageTitle: 'WebUI',
    description: 'Internal pages, controllers, data sources and UI framework.',
    pageDescription:
      'Notes and walkthroughs about WebUI, including controllers, data sources, Mojo bindings and the internal UI framework.',
    quote: 'Chrome, built with the web.',
    count: 9,
    color: 'teal',
    icon: 'window',
  },
]

export function getTopic(slug: string): Topic | undefined {
  return topics.find((topic) => topic.slug === slug)
}
