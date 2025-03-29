import { vol } from 'memfs'
import { vi } from 'vitest'

const mockFetch = vi.fn().mockImplementation(async (url: string) => {
  try {
    const fileExists = vol.existsSync(url)

    if (!fileExists) {
      return {
        ok: false,
        status: 404,
        statusText: 'Not Found',
      }
    }

    const content = vol.readFileSync(url, 'utf-8') as string
    const parsedContent = JSON.parse(content)

    return {
      ok: true,
      status: 200,
      json: async () => parsedContent,
    }
  }
  catch (error) {
    return {
      ok: false,
      status: 500,
      statusText: 'Error reading file',
      error,
    }
  }
})

export default mockFetch
