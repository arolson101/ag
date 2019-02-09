import { FavicoProps } from '../online'

export const encodeFavico = (favico: FavicoProps): string => {
  const data: FavicoProps = {
    ...favico,
    // sort by ascending size
    source: [...favico.source].sort((a, b) => a.width! - b.width!),
  }

  return JSON.stringify(data)
}

export const decodeFavico = (data: string): FavicoProps => {
  return JSON.parse(data)
}
