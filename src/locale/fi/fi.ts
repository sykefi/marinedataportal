import attributeSelection from './attributeSelectionFi';
import timeSpanSelection from './timeSpanSelectionFi';
import siteSelection from './siteSelectionFi';
import fileDownload from './fileDownloadFi';
import surgeDetails from './surgeDetailsFi';
import temperatureDetails from './temperatureDetailsFi';
import waterQualityDetails from './waterQualityDetailsFi';
export default {
    ...attributeSelection,
    ...timeSpanSelection,
    ...siteSelection,
    ...fileDownload,
    ...surgeDetails,
    ...temperatureDetails,
    ...waterQualityDetails,
};
