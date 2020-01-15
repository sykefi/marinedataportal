import { GetRawXMLResponse } from '@/apis/fmiApi';

const query = '&request=DescribeFeatureType&';

export async function fmiApiIsOnline() {
    const result = await GetRawXMLResponse(query);
    if (result) {
        return true;
    }
    return false;
}
