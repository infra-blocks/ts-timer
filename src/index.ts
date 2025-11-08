import { type EmitterLike, EmitterLikeBase } from "@infra-blocks/emitter";

export type TimerEvents = {
  /**
   * This event gets emitted every time a time condition is met.
   * @returns
   */
  timeout: () => void;
};

/**
 * This interface encapsulates the behavior of a timer.
 *
 * A timer needs to be explicitly started by calling {@link Timer.start}.
 * It can be cancelled midway by calling {@link Timer.cancel}.
 *
 * The convenience {@link Timer.restart} method is provided to restart a timer.
 * It is equivalent to canceling the timer, then starting it anew and has no special
 * semantics.
 */
export interface Timer extends EmitterLike<TimerEvents> {
  /**
   * Starts the timer.
   *
   * When the timer is already started, this is a no-op.
   */
  start(): this;
  /**
   * Cancels the ongoing timer.
   *
   * When the timer has already been cancelled, or hasn't been started yet,
   * this is a no-op.
   */
  cancel(): this;
  /**
   * Restarts the timer.
   *
   * Effectively equivalent to calling `cancel()` followed by `start()`.
   */
  restart(): this;
}

class TimerImpl extends EmitterLikeBase<TimerEvents> implements Timer {
  private readonly milliseconds: number;
  private handle?: NodeJS.Timeout;

  constructor(params: { milliseconds: number }) {
    super();
    const { milliseconds } = params;
    this.milliseconds = milliseconds;
  }

  start(): this {
    // If the timer is already running, do nothing.
    if (this.handle != null) {
      return this;
    }
    this.handle = setTimeout(() => {
      this.emit("timeout");
    }, this.milliseconds);
    return this;
  }

  cancel(): this {
    // If the timer is already cancelled, do nothing.
    if (this.handle == null) {
      return this;
    }
    clearTimeout(this.handle);
    this.handle = undefined;
    return this;
  }

  restart(): this {
    this.cancel();
    return this.start();
  }
}

/**
 * Initializes and returns an instance of {@link Timer}.
 *
 * The timer returned needs to be explicitly started by calling {@link Timer.start}.
 *
 * @param milliseconds - The duration of the timer in milliseconds.
 *
 * @returns A new instance of {@link Timer}.
 */
export function timer(milliseconds: number): Timer {
  return new TimerImpl({ milliseconds });
}
