import { MatPaginatorIntl } from '@angular/material/paginator'

export function FrenchPaginatorIntl() {
  const paginatorIntl = new MatPaginatorIntl()

  paginatorIntl.itemsPerPageLabel = 'Eléments/page'
  paginatorIntl.nextPageLabel = 'Page suivante'
  paginatorIntl.previousPageLabel = 'Page précédente'

  paginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0 || pageSize === 0) {
      return `0 de ${length}`
    }
    length = Math.max(length, 0)
    const startIndex = page * pageSize
    const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize
    return `${startIndex + 1} - ${endIndex} / ${length}`
  }
  return paginatorIntl
}