import type { TopicColor } from '../data/topics'
import { topicOutlineClasses } from '../utils/topicVisuals'

export function TopicGraphic({ color }: { color: TopicColor }) {
  const classes = topicOutlineClasses[color]

  return (
    <div className={`relative h-24 w-24 shrink-0 ${classes}`}>
      <div className="absolute left-0 top-6 h-16 w-16 rounded-xl border-2 bg-white" />
      <div className="absolute left-6 top-2 h-16 w-16 rounded-xl border-2 bg-white/60" />
      <div className="absolute left-3 top-9 h-16 w-16 rounded-xl border-2 bg-white/30" />
    </div>
  )
}
