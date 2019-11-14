import getVeslaData from '@/apis/sykeApi';

const query = 'determinationCombinations?api-version=1.0&\
$select=DeterminationCombinationId,NameFi,NameEn&\
$orderby=DeterminationCombinationId';

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
      id: value.determinationCombinationId,
      name_fi: value.nameFi,
      name_en: value.nameEn,
    });
  });
  return options;
}
