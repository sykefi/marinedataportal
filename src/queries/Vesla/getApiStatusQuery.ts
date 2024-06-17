import {getVeslaData} from '@/apis/sykeApi'

export async function sykeApiIsOnline() {
  const result = await getVeslaData('', '')
  return !!result
}
