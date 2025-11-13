# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2025-11-13

### Fixed

- Now clear inner state when timer expires. The code was previously keeping the handle
set until `cancel` or `restart` were called. Because the handle is a timer object that can
potentially hold a great amount of memory, it should be aggressively cleaned up. Not only
that, but it makes sense to be able to call `start` again after a timer has expired.

## [0.2.0] - 2025-11-08

### Added

- The ability to subscribe to timer events with the `once` method. This happened for free
when implementing the *excellent* `EmitterLikeBase` class as a refactoring to reuse code.

## [0.1.0] - 2025-11-05

### Added

- Initial release of the package! Exposing a timer that uses `setTimeout` with an event emitter API
and that can be restarted!


[0.2.0]: https://github.com/infra-blocks/ts-checks/compare/v0.2.0...v0.1.0
[0.1.0]: https://github.com/infra-blocks/ts-timer/releases/tag/v0.1.0
