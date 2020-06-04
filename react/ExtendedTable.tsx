import React from 'react'
import { EXPERIMENTAL_Table as Table } from 'vtex.styleguide'
import { IdMap } from './useExpandableRows'

interface Column {
  id?: string
  title?: any
  width?: number | string
  sortable?: boolean
  cellRenderer?: any
  extended?: boolean
  condensed?: string[]
}


interface TableProps {
  /** Return of the useTableMeasures hook */
  measures: any
  /** Array of columns */
  columns: Column[]
  /** Array of items */
  items: object[]
  /** Function that generates row keys */
  rowKey?: (data: { rowData: unknown }) => string
  /** If the table is empty or not */
  empty?: boolean
  /** If the Table is loading or not */
  loading?: { renderAs: () => React.ReactNode } | boolean
  /** Function trigged on a row click */
  onRowClick?: (data: { rowData: any }) => void
  /** Function that defines if a row is active or not */
  isRowActive?: (data: unknown) => boolean
  /** Table EmptyState component */
  emptyState?: any
  /** Sorting properties */
  sorting?: {
    sorted?: {
      by?: string,
      order?: string,
    },
    sort: (id: string) => void,
    clear: () => void
    // prop specific to this component
    defaultOrder?: string
  }
  /** Base testId */
  testId?: string
  /** If the rows should be highlighted on :hover */
  highlightOnHover?: boolean
  /** If the header is sticky or not */
  stickyHeader?: boolean

  // props specific to this component
  hovering?: any
  measuringRef?: any
  // return of useExpandableRows hook
  rowExpansion?: {
    isRowExpandedMap?: IdMap
  }
  children?: any
}

const HeadWithDefaultSorting = ({sorting}: {sorting: {
  sorted?: {
    by?: string,
    order?: string,
  },
  sort: (id: string) => void,
  clear: () => void
  defaultOrder?: string
}}) => {
 return (<Table.Sections.Head>
 {({ props, column, key }: any) => {
   const isCurrentlySortedColumn = sorting.sorted && sorting.sorted.by === column.id
   const sortingDefaultOrder = sorting.defaultOrder || 'ASC'
   const isAscending = !isCurrentlySortedColumn ? sortingDefaultOrder === 'ASC' : sorting.sorted?.order == 'ASC'
   return (
     <Table.Sections.Head.Cell key={key} style={{borderTopStyle: "none"}} {...props}>
       {column.title}
       <Table.Sections.Head.Cell.Suffix sorting={isCurrentlySortedColumn} ascending={isAscending} />
     </Table.Sections.Head.Cell>
   )
 }}
</Table.Sections.Head> )
}

const CollapsableRow = (props: {key: string,
  onMouseEnter: () => void,
  isExpanded: boolean
  columns: Column[],
  data: any
}) => {
  const { columns, isExpanded, ...rowProps} = props

  const rowPropsWithExtraInfo = {
    ...rowProps,
    data: {
      ...rowProps.data,
      isExpanded
    }
  }

  return (
    <>
    <Table.Sections.Body.Row
      {...rowPropsWithExtraInfo}
    />
    {
      isExpanded && <tr><td colSpan={columns.length} className="bb">
        <div className="flex justify-center items-center h3">
          {rowProps.data.extendedRowRenderer}
        </div>
      </td></tr>
    }
    </>
  )
}

const CustomTable = (props: TableProps) => {
  const { children, measuringRef, hovering, ...tableProps } = props

  const { onMouseEnter = () => {}, onMouseLeave = () => {} } = hovering || {}
  const { sorting } = tableProps
  return (
    <div onMouseLeave={onMouseLeave}>
      <Table composableSections {...tableProps}>
        {children}
        <Table.Sections>
          {
            !sorting ? 
              <Table.Sections.Head/>
            : (
              <HeadWithDefaultSorting sorting={sorting} />
            )
          }
          <Table.Sections.Body ref={measuringRef}>
            {({ key, props: rowProps }: { key: string; props: any }) => {
              return !rowProps.data.isExpandable ? (
                <Table.Sections.Body.Row
                  key={key}
                  onMouseEnter={() => onMouseEnter(rowProps.data.id)}
                  {...rowProps}
                />
              ) : (
                <CollapsableRow
                  key={key}
                  onMouseEnter={() => onMouseEnter(rowProps.data.id)}
                  tableProps={props}
                  isExpanded ={props.rowExpansion?.isRowExpandedMap[rowProps.data.id]}
                  {...rowProps}
                />
              )
            }}
          </Table.Sections.Body>
        </Table.Sections>
      </Table>
    </div>
  )
}

export default CustomTable
