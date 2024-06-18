import getPagedODataResponse from '@/apis/sykeApi'

export async function sykeApiIsOnline() {
  const pages = getPagedODataResponse('', '')
  for await (const page of pages) {
    return page.value.length > 0
  }
}
