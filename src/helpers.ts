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
 * Builds an OData 3 'in' filter by chaining 'eq' filters. Result example: (key eq 1 or key eq 2 or key eq 3).
 * Returns an empty string if the array is empty.
 * @param array the array containing the simple values to chain
 * @param variable the variable name
 * @param startWithAnd if this filter is not the first, set this true to add the 'and' to the start of the query
 */
export function buildODataEqualFilterFromArray(array: any[], variable: string, startWithAnd: boolean) {
  if (array.length === 0) {
    return '';
  }
  let filter = startWithAnd ? ' and(' : '(';
  array.forEach((val) => {
    filter += `${variable} eq ${val} or `;
  });

  filter = filter.substring(0, filter.length - 4);
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
