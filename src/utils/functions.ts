import axios from 'axios'
import { JSDOM } from 'jsdom'

export async function getTitleFromURL(url: string): Promise<string> {
  const fetchUrl = new URL(url)
  const res = await axios.get(fetchUrl.toString())

  const doc = new JSDOM(res.data, { contentType: 'text/html' })
  const title = doc.window.document
    .querySelector('head')
    .querySelectorAll('title')[0]

  return title.innerHTML || fetchUrl.hostname
}
