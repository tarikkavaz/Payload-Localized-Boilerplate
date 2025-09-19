export const formatDateTime = (timestamp: string, locale: string = 'en-US'): string => {
  const now = new Date()
  let date = now
  if (timestamp) date = new Date(timestamp)

  // Use Intl.DateTimeFormat for locale-aware formatting
  // Current format: Turkish: "31.12.2025", English: "Dec 31, 2025"
  // 
  // To display full month names like "31 Aralık 2025" for Turkish:
  // Use: month: 'long', day: 'numeric' instead of current options
  // Example:
  // const options = locale.startsWith('tr') 
  //   ? { year: 'numeric', month: 'long', day: 'numeric' } // Turkish: "31 Aralık 2025"
  //   : { year: 'numeric', month: 'short', day: 'numeric' } // English: "Dec 31, 2025"
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: locale.startsWith('tr') ? '2-digit' : 'short', // Turkish uses numeric format, English uses short month names
    day: '2-digit'
  }).format(date)
}
