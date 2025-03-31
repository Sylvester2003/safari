const jsonCache: Map<string, any> = new Map()
const imageCache: Map<string, HTMLImageElement> = new Map()

/**
 * Loads a JSON file from the specified path and caches it for future use.
 *
 * @param fileName - The name of the JSON file to load (without the .json extension).
 * @returns A promise that resolves to the loaded JSON data.
 */
export async function loadJson(fileName: string): Promise<any> {
  if (jsonCache.has(fileName))
    return jsonCache.get(fileName)

  const response = await fetch(`/src/${fileName}.json`)
  if (!response.ok)
    throw new Error(`Failed to load JSON file: ${fileName}`)

  const jsonData = await response.json()
  jsonCache.set(fileName, jsonData)

  return jsonData
}

/**
 * Loads an image from the specified path and caches it for future use.
 *
 * @param fileName - The name of the image file to load (without the file extension).
 * @returns The loaded HTMLImageElement.
 */
export function loadImage(fileName: string): HTMLImageElement {
  if (imageCache.has(fileName))
    return imageCache.get(fileName) ?? new Image()

  const image = new Image()
  image.src = fileName
  imageCache.set(fileName, image)

  return image
}
