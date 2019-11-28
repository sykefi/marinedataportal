import attributeSelection from './attributeSelectionEn';
import timeSpanSelection from './timeSpanSelectionEn';
import siteSelection from './siteSelectionEn';
import fileDownload from './dataDownloadEn';
import surgeDetails from './surgeDetailsEn';
import temperatureDetails from './temperatureDetailsEn';
import waterQualityDetails from './waterQualityDetailsEn';
import general from './generalEn';
export default {
    ...attributeSelection,
    ...timeSpanSelection,
    ...siteSelection,
    ...fileDownload,
    ...surgeDetails,
    ...temperatureDetails,
    ...waterQualityDetails,
    ...general,
};
