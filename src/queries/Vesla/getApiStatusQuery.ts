import getPagedODataResponse from '@/apis/sykeApi'

export async function sykeApiIsOnline() {
  const generator = getPagedODataResponse('', '')
  for await (const batch of generator) {
    return batch.value.length > 0
  }
}
