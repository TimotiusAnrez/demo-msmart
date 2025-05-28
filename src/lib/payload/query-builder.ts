import { Where } from 'payload'

// Type for all possible operators in PayloadCMS queries
type Operator =
  | 'equals'
  | 'not_equals'
  | 'greater_than'
  | 'greater_than_equal'
  | 'less_than'
  | 'less_than_equal'
  | 'like'
  | 'contains'
  | 'in'
  | 'not_in'
  | 'exists'

// Type for field conditions
type FieldCondition<T = any> = {
  equals?: T
  not_equals?: T
  greater_than?: number
  greater_than_equal?: number
  less_than?: number
  less_than_equal?: number
  like?: string
  contains?: T[]
  in?: T[]
  not_in?: T[]
  exists?: boolean
}

// Type for AND conditions
type AndCondition = {
  and: WhereCondition[]
}

// Type for OR conditions
type OrCondition = {
  or: WhereCondition[]
}

// Combined condition type
type WhereCondition = {
  [key: string]: FieldCondition | AndCondition | OrCondition | any
}

/**
 * PayloadCMS Query Builder
 *
 * A utility to build and validate PayloadCMS query conditions
 */
export class PayloadQueryBuilder {
  private conditions: WhereCondition = {}

  /**
   * Creates a new query builder instance
   */
  constructor() {}

  /**
   * Add a field condition with a specific operator
   */
  where(field: string, operator: Operator, value: any): PayloadQueryBuilder {
    // Skip undefined, null, or NaN values
    if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
      return this
    }

    // Initialize field if not exists
    if (!this.conditions[field]) {
      this.conditions[field] = {}
    }

    // Add the condition
    this.conditions[field][operator] = value
    return this
  }

  /**
   * Add an equals condition
   */
  equals(field: string, value: any): PayloadQueryBuilder {
    return this.where(field, 'equals', value)
  }

  /**
   * Add a not equals condition
   */
  notEquals(field: string, value: any): PayloadQueryBuilder {
    return this.where(field, 'not_equals', value)
  }

  /**
   * Add a like condition (text search)
   */
  like(field: string, value: string): PayloadQueryBuilder {
    if (typeof value === 'string' && value.trim() !== '') {
      return this.where(field, 'like', value)
    }
    return this
  }

  /**
   * Add a contains condition (for arrays)
   */
  contains(field: string, value: any[]): PayloadQueryBuilder {
    return this.where(field, 'contains', value)
  }

  /**
   * Add an in condition (value must be in array)
   */
  in(field: string, values: any[]): PayloadQueryBuilder {
    if (Array.isArray(values) && values.length > 0) {
      return this.where(field, 'in', values)
    }
    return this
  }

  /**
   * Add a not in condition (value must not be in array)
   */
  notIn(field: string, values: any[]): PayloadQueryBuilder {
    if (Array.isArray(values) && values.length > 0) {
      return this.where(field, 'not_in', values)
    }
    return this
  }

  /**
   * Add a greater than condition
   */
  greaterThan(field: string, value: number): PayloadQueryBuilder {
    return this.where(field, 'greater_than', value)
  }

  /**
   * Add a greater than or equal condition
   */
  greaterThanEqual(field: string, value: number): PayloadQueryBuilder {
    return this.where(field, 'greater_than_equal', value)
  }

  /**
   * Add a less than condition
   */
  lessThan(field: string, value: number): PayloadQueryBuilder {
    return this.where(field, 'less_than', value)
  }

  /**
   * Add a less than or equal condition
   */
  lessThanEqual(field: string, value: number): PayloadQueryBuilder {
    return this.where(field, 'less_than_equal', value)
  }

  /**
   * Add an exists condition
   */
  exists(field: string, value: boolean): PayloadQueryBuilder {
    return this.where(field, 'exists', value)
  }

  /**
   * Add a nested field condition
   */
  nested(path: string, operator: Operator, value: any): PayloadQueryBuilder {
    const parts = path.split('.')
    if (parts.length <= 1) {
      return this.where(path, operator, value)
    }

    let current = this.conditions
    for (let i = 0; i < parts.length - 1; i++) {
      const part = parts[i]
      if (!current[part]) {
        current[part] = {}
      }
      current = current[part]
    }

    const lastPart = parts[parts.length - 1]
    if (!current[lastPart]) {
      current[lastPart] = {}
    }

    // Skip undefined, null, or NaN values
    if (value === undefined || value === null || (typeof value === 'number' && isNaN(value))) {
      return this
    }

    current[lastPart][operator] = value
    return this
  }

  /**
   * Add an AND condition
   */
  and(conditions: WhereCondition[]): PayloadQueryBuilder {
    if (Array.isArray(conditions) && conditions.length > 0) {
      this.conditions.and = conditions
    }
    return this
  }

  /**
   * Add an OR condition
   */
  or(conditions: WhereCondition[]): PayloadQueryBuilder {
    if (Array.isArray(conditions) && conditions.length > 0) {
      this.conditions.or = conditions
    }
    return this
  }

  /**
   * Merge another query builder's conditions
   */
  merge(queryBuilder: PayloadQueryBuilder): PayloadQueryBuilder {
    this.conditions = {
      ...this.conditions,
      ...queryBuilder.build(),
    }
    return this
  }

  /**
   * Merge raw where conditions
   */
  mergeWhere(where: WhereCondition): PayloadQueryBuilder {
    this.conditions = {
      ...this.conditions,
      ...where,
    }
    return this
  }

  /**
   * Build the final where condition object
   */
  build(): Where {
    return this.conditions as Where
  }

  /**
   * Static method to create a new query builder
   */
  static create(): PayloadQueryBuilder {
    return new PayloadQueryBuilder()
  }
}

/**
 * Helper function to create search conditions for common search patterns
 */
export function createSearchQuery(
  searchTerm?: string | null,
  searchFields: string[] = [],
): WhereCondition | null {
  if (!searchTerm || typeof searchTerm !== 'string' || searchTerm.trim() === '') {
    return null
  }

  const trimmedSearch = searchTerm.trim()

  if (searchFields.length === 0) {
    return null
  }

  // For a single field, just return a simple condition
  if (searchFields.length === 1) {
    return {
      [searchFields[0]]: {
        like: trimmedSearch,
      },
    }
  }

  // For multiple fields, create an OR condition
  return {
    or: searchFields.map((field) => ({
      [field]: {
        like: trimmedSearch,
      },
    })),
  }
}

/**
 * Helper function to safely get pagination parameters
 */
export function getPaginationParams(
  page?: string | number | null,
  defaultPage = 1,
  limit = 10,
): { page: number; limit: number } {
  let pageNum = defaultPage

  if (page !== undefined && page !== null) {
    const parsed = Number(page)
    if (!isNaN(parsed) && parsed > 0) {
      pageNum = parsed
    }
  }

  return {
    page: pageNum,
    limit,
  }
}

/**
 * Helper function to get sort parameters
 */
export function getSortParams(
  sort?: string | null,
  defaultField = 'createdAt',
  defaultOrder: 'asc' | 'desc' = 'desc',
): Record<string, 1 | -1> {
  if (!sort) {
    return { [defaultField]: defaultOrder === 'desc' ? -1 : 1 }
  }

  const isDesc = !sort.startsWith('-')
  const field = isDesc ? sort : sort.substring(1)

  return { [field]: isDesc ? 1 : -1 }
}
