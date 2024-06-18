import getPagedODataResponse from '@/apis/sykeApi'

const query =
  '$select=DeterminationCombinationId,NameFi,NameSv,NameEn&\
$orderby=DeterminationCombinationId'

export interface IWaterQualityOption {
  id: number
  name_fi: string
  name_sv: string
  name_en: string
}

export async function getWaterQualityOptions() {
  const generator = getPagedODataResponse('DeterminationCombinations', query)
  const options: IWaterQualityOption[] = []
  for await (const batch of generator) {
    batch.value.forEach((value: any) => {
      options.push({
        id: value.determinationCombinationId,
        name_fi: value.nameFi,
        name_sv: value.nameSv,
        name_en: value.nameEn,
      })
    })
  }
  return options
}
