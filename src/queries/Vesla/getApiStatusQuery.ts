import getPagedODataResponse from '@/apis/sykeApi'

export async function sykeApiIsOnline() {
  let generator = getPagedODataResponse('', '')
  for await (let batch of generator){
    return batch.value.length > 0;
  }
}
