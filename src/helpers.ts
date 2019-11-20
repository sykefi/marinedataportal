import { mainState } from './store/mainState';
import { searchParameterModule } from './store/searchParameterModule';

/**
 * Splits an array into chunks of specified size
 * @param array the array to split
 * @param size the size of the resulting chunks
 */
export function chunkArray<T>(array: T[], size: number) {
  return Array.from({ length: Math.ceil(array.length / size) })
    .map((_, i) => Array.from({ length: size })
      .map((x, j) => array[i * size + j]));
}

/**
 * Builds an OData 4 'in' filter. Result example: key in (1,2,3).
 * Returns an empty string if the array is empty.
 * @param array the array containing the simple values to chain
 * @param variable the variable name
 * @param startWithAnd if this filter is not the first, set this true to add the 'and' to the start of the query
 */
export function buildODataInFilterFromArray(array: any[], variable: string, startWithAnd: boolean) {
  if (array.length === 0) {
    return '';
  }

  if (array.length === 1) {
    return (startWithAnd ? ' and' : '') + ` ${variable} eq ${array[0]}`;
  }

  let filter = startWithAnd ? ' and ' : '';
  filter += variable + ' in (';
  array.forEach((val) => {
    if (val) {
      filter += val + ',';
    }
  });

  filter = filter.substring(0, filter.length - 1);
  filter += ')';
  return filter;
}


export function validateSearchParameters() {
  const errors: string[] = [];

  // Attribute validation
  if (mainState.selectedAttributeModules.length === 0) {
    errors.push('$noAttributesSelected');
  }

  const params = searchParameterModule;

  // Time span validation
  if (!params.timeSpanStart) {
    errors.push('$missingTimeSpanStart');
  }
  if (!params.timeSpanEnd) {
    errors.push('$missingTimeSpanEnd');
  } else if (params.timeSpanStart && params.timeSpanStart > params.timeSpanEnd) {
    errors.push('$timeSpanStartAfterTimeSpanEnd');
  }

  // Time period validation
  if (params.periodStart && !params.periodEnd) {
    errors.push('$missingPeriodEnd');
  } else if (!params.periodStart && params.periodEnd) {
    errors.push('$missingPeriodStart');
  } else if (params.periodStart && params.periodEnd) {
    if (params.periodStart > params.periodEnd) {
      errors.push('$periodStartAfterPeriodEnd');
    }
  }

  // Depth validation
  if (params.selectedDepth === 'depthInterval') {
    if (params.depthStart === null) {
      errors.push('$missingDepthStart');
    }
    if (params.depthEnd === null) {
      errors.push('$missingDepthEnd');
    } else if (params.depthStart && (params.depthStart >= params.depthEnd)) {
      errors.push('$depthStartGreaterThanDepthEnd');
    }
  } else if (params.selectedDepth === 'surfaceLayer') {
    params.depthStart = 0;
    // TODO v.depthEnd
  } else if (params.selectedDepth === 'bottomLayer') {
    // TODO
  }

  mainState.setErrorList(errors);
  return errors.length === 0;
}
