// tslint:disable:max-line-length
import { encodeDataURI } from './datauri'
import { ImageSource } from './ImageSource'

export const generateAvatar = (text: string): ImageSource => {
  let initials = text
    .split(' ')
    .filter(word => word.length > 1)
    .map(word => word[0].toUpperCase())
    .join('')

  const firstWord = text.split(' ')[0]
  if (firstWord === firstWord.toUpperCase()) {
    initials = firstWord
  }

  const [width, height] = [16, 16]
  const color = '#888'
  const fontSize = width / Math.min(Math.max(2, initials.length), 4)

  // tslint:disable-next-line:prettier
  const buf = Buffer.from(/*html*/`<?xml version="1.0"?>
    <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
    <svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" viewBox='0 0 ${width} ${height}'>
      <defs>
        <style type="text/css">
          .shadow {
            text-shadow: 0px 0px 10px #0008;
          }
        </style>
      </defs>
      <rect fill="${color}" x="0" y="0" height="${height}" width="${width}"></rect>
      <text
        class="shadow"
        fill="#ffffff"
        font-family="sans-serif"
        font-size="${fontSize}"
        text-anchor="middle"
        dominant-baseline="central"
        x="${width / 2}"
        y="${height / 2}"
      >
        ${escape(initials)}
      </text>
    </svg>
  `)

  const mime = 'image/svg+xml'
  const uri = encodeDataURI({ buf, mime }, 'base64')
  return new ImageSource({ width, height, uri })
}

const escapeChars: Record<string, string> = {
  '&': '&amp;',
  '"': '&quot;',
  '<': '&lt;',
  '>': '&gt;',
}

const escape = (s: string) => {
  return s.replace(/[&"<>]/g, c => {
    return escapeChars[c]
  })
}
