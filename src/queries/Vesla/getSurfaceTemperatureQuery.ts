import { CommonParameters } from '../commonParameters';
import getVeslaData from '@/apis/sykeApi';

const query = 'Result_Wide?\
$select=Time,Site_Id,Site,SampleDepth_m,SampleDepthUpper_m,SampleDepthLower_m,Value,Unit&\
$orderby=Site_Id,Time&';

function getFilter(params: CommonParameters) {
  return `$filter=Determination_Id eq 383` +
    ` and Time ge datetimeoffset'${params.formattedDateStart}'` +
    ` and Time le datetimeoffset'${params.formattedDateEnd}'`;
}

export async function getSurfaceTemperatures(params: CommonParameters) {
  // todo: location (coord, station name)
  // todo: nextlink
  const res = await getVeslaData(query + getFilter(params));
  return res;
}
