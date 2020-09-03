# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.10.3] - 2020-09-03

### Fixed

- Fix measure for row height

## [0.10.2] - 2020-08-06

### Added

- Tests

## [0.10.1] - 2020-08-05

### Changed

- Trigger onMouseLeave event when moving mouse from table body area to table header area

## [0.10.0] - 2020-06-23

### Changed

- Expanded row style, removing line dividing initial line and extra content area

## [0.9.0] - 2020-06-10

### Added

- Expand rows to show "hidden" additional data functionality to `extendedTable` -`useExpandableRows` hook to provide control for row expansion

### Fixed

- `children` prop being erroneously required on `extendedTable`

## [0.8.0] - 2020-05-06

### Added

- New `extendedTable` which uses styleguide's table v2 -`usePersistedPagination` hook to be used with Table V2
- `useInverseTableSort` hook to be used with Table V2
- `usePersistedTableSort` hook which accepts both sorting directions to be used with Table
  V2
- `useDynamicMeasures` hook to be used with Table V2

## [0.7.3] - 2020-04-27

### Fixed

- Prop `pagination` type of `PersistedPaginatedTable`, it should be optional since it has a default value.

## [0.7.2] - 2020-03-12

## [0.7.1] - 2019-12-23

### Fixed

- Errors caused by string prop types in styleguide

## [0.7.0] - 2019-12-18

### Changed

- Updated `PersistedPaginatedTable` types

## [0.6.0] - 2019-12-02

### Added

- Support of Styleguide's Table `hasPageTopIndicator` prop.

## [0.5.7] - 2019-11-21

### Added

- Project API documentation

## [0.5.6] - 2019-10-31

### Added

- Accept and propagate prop onRowHover for persisted table

## [0.5.5] - 2019-10-28

### Changed

- Redirect to first page when user is in page that beyond the total of items

### Added

- Dynamic row height option to persisted table API

## [0.5.4] - 2019-09-25

### Changed

- Default sort order is now used as the persisted table preferred sort order

## [0.5.3] - 2019-09-06

### Changed

- Options for number of rows are now [10, 15, 25]

## [0.5.2] - 2019-09-03

### Fixed

- Sorting table bug that caused the page size to change to default

## [0.5.1] - 2019-09-03

### Added

- Documentation builder

## [0.5.0] - 2019-08-14

### Changed

- Options for number of rows are now [5, 15, 25, 50]

## [0.4.1] - 2019-08-06

### Fixed

- Labels 'Show rows' and 'of' are now internationalized. They were displaying in English, even if the user selected Portuguese or Spanish display.

## [0.4.0] - 2019-07-19

### Added

- New persisted table component, a paginated table that tracks table state by query string

## [0.3.0] - 2019-07-11

### Changed

- Adapt table to accept bulkActions parameters and empty state node
