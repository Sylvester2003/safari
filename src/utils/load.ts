const cache: Map<string, any> = new Map()

export async function loadJson(fileName: string): Promise<any> {
  if (cache.has(fileName))
    return cache.get(fileName)

  const response = await fetch(`/src/${fileName}.json`)
  if (!response.ok)
    throw new Error(`Failed to load JSON file: ${fileName}`)

  const jsonData = await response.json()
  cache.set(fileName, jsonData)

  return jsonData
}
