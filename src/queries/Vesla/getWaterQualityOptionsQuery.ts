import getVeslaData from '@/apis/sykeApi';

const query = 'MaaritysYhd?\
$select=MaaritysYhd_Id,Nimi, NimiEng,&\
$orderby=MaaritysYhd_Id&';

export interface IWaterQualityOption {
  id: number;
  name_fi: string;
  name_en: string;
}

export async function getWaterQualityOptions() {
  const res = await getVeslaData(query);
  const options: IWaterQualityOption[] = [];
  res.forEach((value) => {
    options.push({
      id: value.MaaritysYhd_Id,
      name_fi: value.Nimi,
      name_en: value.NimiEng,
    });
  });
  return options;
}
