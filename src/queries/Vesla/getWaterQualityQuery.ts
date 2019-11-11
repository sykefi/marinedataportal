import { CommonParameters } from '../commonParameters';
import getVeslaData from '@/apis/sykeApi';
import { chunkArray, buildODataEqualFilterFromArray } from '@/helpers';

const query = 'Result_Wide?\
$select=Time,AnalyteName,Site_Id,Site,SampleDepth_m,SampleDepthUpper_m,SampleDepthLower_m,Value&\
$orderby=Determination_Id,Site_Id,Time&';

async function getFilter(params: CommonParameters, determinationIds: number[]) {
  let filter = `$filter=Time ge datetimeoffset'${params.formattedDateStart}'` +
    ` and Time le datetimeoffset'${params.formattedDateEnd}'`;

  const ids = await getDeterminationIds(determinationIds);
  filter += buildODataEqualFilterFromArray(ids, 'Determination_Id', true);
  filter += buildODataEqualFilterFromArray(params.sites.map((s) => s.id), 'Site_Id', true);

  return filter;
}

async function getDeterminationIds(selectedIds: number[]) {
  const determQuery = 'MaaritysYhdMaaritys?$select=Maaritys_Id,MaaritysYhd_id';
  const res = await getVeslaData(determQuery) as Array<{ Maaritys_Id: number, MaaritysYhd_id: number }>;
  const selectedDetermIds: number[] = [];
  res.forEach((value) => {
    if (selectedIds.includes(value.MaaritysYhd_id)) {
      selectedDetermIds.push(value.Maaritys_Id);
    }
  });
  return selectedDetermIds;
}

export async function getWaterQuality(params: CommonParameters, selectedIds: number[]) {
  const ids = await getDeterminationIds(selectedIds);
  const chunks = chunkArray(ids, 2);
  const results: any[] = [];
  for (const chunk of chunks) {
    if (chunk.find((i) => i > 0)) {
      const filter = await getFilter(params, chunk);
      results.push(... await getVeslaData(query + filter));
    }
  }
  return results;
}

export async function getWaterQualitySiteIds(params: CommonParameters, selectedIds: number[]) {
  const ids = await getDeterminationIds(selectedIds);
  const chunks = chunkArray(ids, 2);
  const results: any[] = [];
  for (const chunk of chunks) {
    if (chunk.find((i) => i > 0)) {
      const filter = await getFilter(params, chunk);
      const q = 'Result_Wide?$select=Site_Id&' + filter;
      const res = await getVeslaData(q) as Array<{ Site_Id: number }>;
      results.push(...res.map((r) => r.Site_Id));
    }
  }
  return results;
}
