export const initAnalytics = () => {
  const gaId = import.meta.env.VITE_GA_ID
  if (!gaId || document.getElementById('ga-script')) return
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`
  script.id = 'ga-script'
  document.head.appendChild(script)
  window.dataLayer = window.dataLayer || []
  const gtag = (...args) => window.dataLayer.push(args)
  gtag('js', new Date())
  gtag('config', gaId)
}
