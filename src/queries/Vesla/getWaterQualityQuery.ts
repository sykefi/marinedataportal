import { CommonParameters } from '../commonParameters';
import GetVeslaData from '@/apis/sykeApi';

const query = 'Result_Wide?\
$select=Time,AnalyteName,Site_Id,Site,SampleDepth_m,SampleDepthUpper_m,SampleDepthLower_m,Value&\
$orderby=Determination_Id,Site_Id,Time&';

async function getFilter(params: CommonParameters, selectedIds: number[]) {
  let filter = `$filter=Time ge datetimeoffset'${params.formattedDateStart}'` +
    ` and Time le datetimeoffset'${params.formattedDateEnd}' and (`;
  const ids = await getDeterminationIds(selectedIds);

  ids.forEach((id) => {
    filter += `Determination_Id eq ${id} or `;
  });

  filter = filter.substring(0, filter.length - 4);
  filter += ')';

  return filter;
}

async function getDeterminationIds(selectedIds: number[]) {
  const determQuery = 'MaaritysYhdMaaritys?$select=Maaritys_Id,MaaritysYhd_id';
  const res = await GetVeslaData(determQuery) as Array<{ Maaritys_Id: number, MaaritysYhd_id: number }>;
  const selectedDetermIds: number[] = [];
  res.forEach((value) => {
    if (selectedIds.includes(value.MaaritysYhd_id)) {
      selectedDetermIds.push(value.Maaritys_Id);
    }
  });
  return selectedDetermIds;
}

export async function getWaterQuality(params: CommonParameters, selectedIds: number[]) {
  const filter = await getFilter(params, selectedIds);
  const res = await GetVeslaData(query + filter);
  return res;
}

export async function getWaterQualitySiteIds(params: CommonParameters, selectedIds: number[]) {
  const filter = await getFilter(params, selectedIds);
  const q = 'Result_Wide?$select=Site_Id&' + filter;
  const res = await GetVeslaData(q) as Array<{ Site_Id: number }>;
  return res.map((r) => r.Site_Id);
}
