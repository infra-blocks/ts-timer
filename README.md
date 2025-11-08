# ts-timer
[![Build](https://github.com/infra-blocks/ts-timer/actions/workflows/build.yml/badge.svg)](https://github.com/infra-blocks/ts-timer/actions/workflows/build.yml)
[![Release](https://github.com/infra-blocks/ts-timer/actions/workflows/release.yml/badge.svg)](https://github.com/infra-blocks/ts-timer/actions/workflows/release.yml)
[![codecov](https://codecov.io/gh/infra-blocks/ts-timer/graph/badge.svg?token=6UNEJLQE94)](https://codecov.io/gh/infra-blocks/ts-timer)

The package offers utilities to deal with tasks relating to timers (timeouts) and intervals. It exposes one factory function: `timer`.
`timer` returns an object that implements the `Timer` interface. The `Timer` interface reads as such:
```ts
export type TimerEvents = {
  timeout: () => void;
};

// The user can subscribe to "timeout" events through the inherited methods from `EmitterLike`.
export interface Timer extends EmitterLike<TimerEvents> {
  start(): this;
  cancel(): this;
  restart(): this;
}
```

The main advantage to using this code is to easily manage the `setTimeout` and matching `clearTimeout` calls, while reusing the same milliseconds
delay. This was developed in the context of having an interval that could get reset preemptively. Specifically, it was a buffer that could be flushed
in one of two scenarios: it had reached a certain size *or* a certain period of time had elapsed. This meant that the timer had to be cleared and
reset every time the buffer was flushed, even when it was flushed due to its size. The `timer` code resulting in the use of this package was more
compact and more readable than the equivalent with `(set|clear)Timeout`.
