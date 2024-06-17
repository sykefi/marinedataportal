import { getVeslaData } from '@/apis/sykeApi'

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
  const res = await getVeslaData('DeterminationCombinations', query)
  const options: IWaterQualityOption[] = []
  if (res) {
    res.forEach((value) => {
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
