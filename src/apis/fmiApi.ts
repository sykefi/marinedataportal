// tslint:disable:no-console
import { CommonParameters } from '@/queries/commonParameters'
import { Site } from '@/queries/site'
import { isDateInPeriod } from '@/helpers'
import { useMainStateStore } from '@/stores/mainStateStore'

const QUERY_URL = 'https://opendata.fmi.fi/wfs?service=WFS&version=2.0.0'

export interface IFmiResult {
  time: string
  parameterName: string
  value: string
  lat: number
  long: number
  dataSource: string
  siteName: string
  siteId: number
}

export async function GetRawXMLResponse(query: string) {
  let res: Document | null = null
  const mainState = useMainStateStore()
  try {
    res = await getXmlResponse(QUERY_URL + query)
  } catch (e) {
    console.error(e)
    mainState.setError(true)
    return null
  }
  return res
}

export async function GetSimpleFmiResponse(
  query: string,
  params: CommonParameters,
  sites: Site[]
) {
  const numberOfDaysInSingleQuery = 6
  const dateSpans = getDates(params, numberOfDaysInSingleQuery)
  const results: IFmiResult[] = []
  const mainState = useMainStateStore()

  if (!dateSpans) {
    return results
  }

  for (const site of sites) {
    const formattedParams = getParams(
      dateSpans,
      numberOfDaysInSingleQuery,
      site.id
    )
    for (const fp of formattedParams) {
      try {
        const res = await getXmlResponse(QUERY_URL + query + fp)
        const elements = res.getElementsByTagName('BsWfs:BsWfsElement')
        results.push(...parseSimpleResponse(Array.from(elements), site))
      } catch (e) {
        console.error(e)
        mainState.setError(true)
      }
    }
  }

  return results.sort(sortByTimeAndParameters)
}

export function sortByTimeAndParameters(a: IFmiResult, b: IFmiResult) {
  if (a.parameterName > b.parameterName) {
    return 1
  } else if (a.parameterName < b.parameterName) {
    return -1
  }

  if (a.siteId > b.siteId) {
    return 1
  } else if (a.siteId < b.siteId) {
    return -1
  }

  const dateA = new Date(a.time)
  const dateB = new Date(b.time)
  if (dateA > dateB) {
    return 1
  } else if (dateA < dateB) {
    return -1
  } else {
    return 0
  }
}

export function getParams(
  dateSpans: Date[],
  numberOfDaysInSingleQuery: number,
  siteId: number
) {
  const formattedParams: string[] = []
  let startDateIsHandled = false
  for (let i = 0; i < dateSpans.length - 1; i++) {
    const startDate = new Date(dateSpans[i].getTime())
    if (startDateIsHandled) {
      // Start date was already handled in the previous query
      addDay(startDate)
    }
    startDateIsHandled = true

    startDate.setUTCHours(0)
    startDate.setUTCMinutes(0)
    startDate.setUTCSeconds(0)

    const endDate = new Date(dateSpans[i + 1].getTime())
    endDate.setUTCHours(23)
    endDate.setUTCMinutes(59)
    endDate.setUTCSeconds(59)

    // For example, if chosen time span is May 1 - May 7, dateSpans array will contain dates May 1 and May 7.
    // In this case getDateSpanLengthInDays will return 7 which is > 6, but we don't want to skip it.
    if (
      getDateSpanLengthInDays(startDate, endDate) >
      numberOfDaysInSingleQuery + 1
    ) {
      // in multi-year queries with time period selection, there are gaps in the days
      // these gaps will be skipped, and the start of the gap is processed on the next iteration
      startDateIsHandled = false
      continue
    }
    formattedParams.push(formatParams(startDate, endDate, siteId))
  }
  return formattedParams
}

function parseSimpleResponse(elements: Element[], site: Site) {
  const results: IFmiResult[] = []
  for (const element of elements) {
    const time =
      element.getElementsByTagName('BsWfs:Time')[0].firstChild!.nodeValue!
    const parameterName = element.getElementsByTagName('BsWfs:ParameterName')[0]
      .firstChild!.nodeValue!
    const value = element.getElementsByTagName('BsWfs:ParameterValue')[0]
      .firstChild!.nodeValue!
    const result: IFmiResult = {
      time: new Date(time).toISOString(),
      parameterName,
      value,
      lat: site.lat,
      long: site.long,
      siteId: site.id,
      siteName: site.name,
      dataSource: 'FMI',
    }
    results.push(result)
  }
  return results
}

function formatParams(dateStart: Date, dateEnd: Date, siteId: number) {
  let s = ''
  s += '&starttime=' + dateStart.toISOString()
  s += '&endtime=' + dateEnd.toISOString()
  s += '&fmisid=' + siteId

  return s
}

async function getXmlResponse(url: string): Promise<Document> {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(response.statusText)
  }
  const text = await response.text()

  const oParser = new DOMParser()
  const document = oParser.parseFromString(text, 'application/xml')
  return document
}

/** Get all the dates between a start and an end date
 * @param blockSizeDays How to split the time range, in number of days. Example: to get a range of weeks, size is 7
 */
export function getDates(params: CommonParameters, blockSizeDays: number) {
  let dateArray: Date[] = []
  let currentDate = new Date(params.dateStart.getTime())
  while (currentDate <= params.dateEnd) {
    dateArray.push(new Date(currentDate.getTime()))
    if (params.periodStartTime === params.periodEndTime) {
      // If only one date is queried, it will serve as end date as well
      dateArray.push(new Date(currentDate.getTime()))
    }
    currentDate = addDay(currentDate)
  }

  // In case time period starts on the same day as time span ends,
  // the last day has to serve as a start date and end date
  const comparableDateEnd = new Date(params.dateEnd.getTime())
  comparableDateEnd.setUTCFullYear(2000)
  if (params.periodStartTime === comparableDateEnd.getTime()) {
    dateArray.push(new Date(params.dateEnd.getTime()))
  }

  if (params.datePeriodMonths) {
    dateArray = dateArray.filter(checkDatePeriod)
  }
  if (dateArray.length === 0) {
    return
  }

  const filtered: Date[] = []
  filtered.push(dateArray[0])

  for (let i = 0; i < dateArray.length; i += 1) {
    const previousLast = filtered[filtered.length - 1]
    // goal here is to get a list of dates that are <= `timeSpan` away from each other
    // this is done so we can build queries with a maximum number of days to reduce the number of queries
    if (i === dateArray.length - 1) {
      filtered.push(dateArray[i])
    } else {
      const nextInRange =
        getDateSpanLengthInDays(previousLast, dateArray[i + 1]) <= blockSizeDays
      if (!nextInRange) {
        filtered.push(dateArray[i])
      }
      // current iterable and the next one are in range, skip this and proceed to next date
    }
  }

  if (
    !isInArray(filtered, params.dateEnd) &&
    (!params.datePeriodMonths || checkDatePeriod(params.dateEnd))
  ) {
    filtered.push(params.dateEnd)
  }

  return filtered

  function checkDatePeriod(date: Date) {
    const month = date.getUTCMonth() + 1
    const day = date.getUTCDate()
    return isDateInPeriod(month, day, params)
  }

  // https://stackoverflow.com/questions/39899332/check-date-against-an-array-of-dates
  function isInArray(datesArray: Date[], value: Date) {
    return !!datesArray.find((item) => item.getTime() === value.getTime())
  }
}

function addDay(date: Date) {
  date.setDate(date.getDate() + 1)
  return date
}

function getDateSpanLengthInDays(startDate: Date, endDate: Date) {
  const differenceInTime = endDate.getTime() - startDate.getTime()
  return Math.round(differenceInTime / (1000 * 3600 * 24))
}
