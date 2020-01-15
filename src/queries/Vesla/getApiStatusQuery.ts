import getVeslaData from '@/apis/sykeApi';

export async function sykeApiIsOnline() {
    const result = await getVeslaData('');
    if (result) {
        return true;
    }
    return false;
}
