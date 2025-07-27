import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import 'dayjs/locale/fr'

// Configure dayjs with relative time plugin and French locale
dayjs.extend(relativeTime)
dayjs.locale('fr')

export function formatLastPlayed(timestamp: string): string {
  if (!timestamp || timestamp === '0') {
    return 'Jamais joué'
  }

  const date = dayjs(parseInt(timestamp) * 1000)
  const now = dayjs()
  
  // If more than 1 year ago, show the date
  if (now.diff(date, 'year') >= 1) {
    return `Il y plus d'un an`
  }
  
  // Otherwise show relative time
  return `Joué ${date.fromNow()}`
} 