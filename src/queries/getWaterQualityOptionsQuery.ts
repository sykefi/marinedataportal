import getPagedODataResponse from '@/apis/sykeApi'

const query = '$select=MaaritysYhd_Id,Nimi, NimiEng&$orderby=MaaritysYhd_Id'

export interface IWaterQualityOption {
  id: number
  name_fi: string
  name_en: string
}

export async function getWaterQualityOptions() {
  var generator = getPagedODataResponse('MaaritysYhd', query)
  const options: IWaterQualityOption[] = []
  for await (let batch of generator){
    batch.value.forEach((value: any) => {
      options.push({
        id: value.MaaritysYhd_Id,
        name_fi: value.Nimi,
        name_en: value.NimiEng,
      })
    })
  }
  return options
}
