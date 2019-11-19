# Paginated Table

## Description

The Paginated Table is a wrapper to the VTEX Styleguide Table that abstracts some of the logic that normally one should write to handle pagination with GraphQL

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, or open issue with your feature request.

## Table of Contents

- [Paginated Table](#paginated-table)
  - [Description](#description)
  - [Table of Contents](#table-of-contents)
  - [Usage](#usage)
    - [PaginatedTable](#paginatedtable)
    - [PersistedPaginatedTable](#persistedpaginatedtable)
  - [Troubleshooting](#troubleshooting)
  - [Contributing](#contributing)

## Usage

This app uses our styleguide as the Table engine. To know more about the VTEX Styleguide [click here.](https://styleguide.vtex.com/)

To use this app, you need to import it in your dependencies in `manifest.json`.

```json
  dependencies: {
    "vtex.paginated-table": "0.x"
  }
```

Then, import the `PaginatedTable` component into your app as

```jsx
import { PaginatedTable } from 'vtex.paginated-table'
```

If you prefer to use the `PersistedPaginatedTable`, you can do it as follows

```jsx
import { PersistedPaginatedTable } from 'vtex.paginated-table'
```

### PaginatedTable

Along the usual [Styleguide Table's props](https://styleguide.vtex.com/#/Components/Display/Table), this table has the following props:

| Prop name             | Type       | Description                                                                                           | Default value |
| --------------------- | ---------- | ----------------------------------------------------------------------------------------------------- | ------------- |
| `fetchMore`           | `Function` | A React Apollo `fetchMore` function to fetch data for the next/last page                              | Required      |
| `total`               | `Number`   | The total number of items in your data                                                                | Required      |
| `updateQuery`         | `Function` | A React Apollo `updateQuery` function that runs the `fetchMore` function in order to update your data | Required      |
| `updatePaginationKey` | `String`   | A key to force a table update when it changes                                                         | `''`          |
| `onSortChange`        | `Function` | A callback to be called whenever there is a Sort change in the Table                                  | `() => {}`    |

**OBS:**

- Detailed specifications for `fetchMore` and `updateQuery` can be seen in [this Apollo link](https://www.apollographql.com/docs/react/data/pagination/)
- The callback provided to `onSortChange` should have the following signature `(newSortedBy: string, newSortOrder: 'ASC' | 'DESC') => void`

### PersistedPaginatedTable

The `PersistedPaginatedTable` uses the page's query string to persist the table pagination state. It is meant to be used whenever the page has interactive elements that make the user to leave the page that contains the table without resetting the table state or to share a specific table state between users (e.g. by providing a link to the page that contains the table).

Along the usual [Styleguide Table's props](https://styleguide.vtex.com/#/Components/Display/Table), this table has the following props:

| Prop name                | Type                       | Description                                              | Default value |
| ------------------------ | -------------------------- | -------------------------------------------------------- | ------------- |
| `total`                  | `Number`                   | The total number of items in your data                   | Required      |
| `updatePaginationKey`    | `String`                   | A key to force a table update when it changes            | `''`          |
| `defaultElementsPerPage` | `Number`                   | The default number of elements per table page            | `15`          |
| `defaultSortOrder`       | One of [`'ASC'`, `'DESC'`] | The default sort order for the page                      | `'ASC'`       |
| `defaultSortedBy`        | `String`                   | The default column by which the table is to be sorted by | `''`          |

## Troubleshooting

You can check if others are passing through similar issues [here](https://github.com/vtex-apps/paginated-table/issues). Also feel free to [open issues](https://github.com/vtex-apps/paginated-table/issues/new) or contribute with pull requests.

## Contributing

Check it out [how to contribute](https://github.com/vtex-apps/awesome-io#contributing) with this project.
