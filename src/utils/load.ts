const jsonCache: Map<string, any> = new Map()
const imageCache: Map<string, HTMLImageElement> = new Map()

export async function loadJson(fileName: string): Promise<any> {
  if (jsonCache.has(fileName))
    return jsonCache.get(fileName)

  const response = await fetch(`/${fileName}.json`)
  if (!response.ok)
    throw new Error(`Failed to load JSON file: ${fileName}`)

  const jsonData = await response.json()
  jsonCache.set(fileName, jsonData)

  return jsonData
}

export function loadImage(fileName: string): HTMLImageElement {
  if (imageCache.has(fileName))
    return imageCache.get(fileName) ?? new Image()

  const image = new Image()
  image.src = fileName
  imageCache.set(fileName, image)

  return image
}
