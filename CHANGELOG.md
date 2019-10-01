# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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