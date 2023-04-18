import attributeSelection from './attributeSelectionSv'
import timeSpanSelection from './timeSpanSelectionSv'
import siteSelection from './siteSelectionSv'
import fileDownload from './dataDownloadSv'
import surgeDetails from './surgeDetailsSv'
import temperatureDetails from './temperatureDetailsSv'
import waterQualityDetails from './waterQualityDetailsSv'
import general from './generalSv'
import footer from './footerSv'
import header from './headerSv'
import infoMenu from './infoMenuSv'
export default {
  ...attributeSelection,
  ...timeSpanSelection,
  ...siteSelection,
  ...fileDownload,
  ...surgeDetails,
  ...temperatureDetails,
  ...waterQualityDetails,
  ...general,
  ...footer,
  ...header,
  ...infoMenu,
}
