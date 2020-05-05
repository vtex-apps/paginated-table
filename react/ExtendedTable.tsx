import React from 'react'
import { EXPERIMENTAL_Table as Table } from 'vtex.styleguide'

const CustomTable = (props: any) => {
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
              <Table.Sections.Head>
                {({ props, column, key }: any) => {
                  const isCurrentlySortedColumn = sorting.sorted && sorting.sorted.by === column.id
                  const sortingDefaultOrder = sorting.defaultOrder || 'ASC'
                  const isAscending = !isCurrentlySortedColumn ? sortingDefaultOrder === 'ASC' : sorting.sorted?.order == 'ASC'
                  return (
                    <Table.Sections.Head.Cell key={key} {...props}>
                      {column.title}
                      <Table.Sections.Head.Cell.Suffix sorting={isCurrentlySortedColumn} ascending={isAscending} />
                    </Table.Sections.Head.Cell>
                  )
                }}
              </Table.Sections.Head>
            )
          }
          <Table.Sections.Body ref={measuringRef}>
            {({ key, props: rowProps }: { key: string; props: any }) => {
              return (
                <Table.Sections.Body.Row
                  key={key}
                  onMouseEnter={() => onMouseEnter(rowProps.data.id)}
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
