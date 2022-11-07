import axios from 'axios'
import { JSDOM } from 'jsdom'

export async function getTitleFromURL(url: string): Promise<string> {
  try {
    const res = await axios.get(url)
    const doc = new JSDOM(res.data, { contentType: 'text/html' })
    const title = doc.window.document
      .querySelector('head')
      .querySelectorAll('title')[0]

    return title?.innerHTML || getDomainName(url)
  } catch (_err) {
    return getDomainName(url)
  }
}

export function validUrl(url: string): boolean {
  return new RegExp(
    '^(https?:\\/\\/)?' + // validate protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // validate domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // validate OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // validate port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // validate query string
      '(\\#[-a-z\\d_]*)?$', // validate fragment locator
    'i'
  ).test(url)
}

export function getDomainName(url: string): string {
  const fetchUrl = new URL(url).hostname.split('.')
  return fetchUrl[fetchUrl.length - 2]
}
