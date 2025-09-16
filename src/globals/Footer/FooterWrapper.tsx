import { getCachedGlobal } from '@/utilities/getGlobals'
import { TypedLocale } from 'payload'
import { Footer } from './Component'

export async function FooterWrapper({ locale }: { locale: TypedLocale }) {
  const footer = await getCachedGlobal('footer', 1, locale)()
  return <Footer footer={footer} />
}
