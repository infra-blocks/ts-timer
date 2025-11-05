import EventEmitter from "node:events";
import type * as TypedEmitter from "typed-emitter";

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
export interface Timer {
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
  /**
   * Subscribes to timer events.
   *
   * @param event - The event name.
   * @param listener - The event listener callback.
   *
   * @see TimerEvents
   */
  on<K extends keyof TimerEvents>(event: K, listener: TimerEvents[K]): this;
}

class TimerImpl implements Timer {
  private readonly milliseconds: number;
  private readonly emitter: TypedEmitter.default<TimerEvents>;
  private handle?: NodeJS.Timeout;

  constructor(params: { milliseconds: number }) {
    const { milliseconds } = params;
    this.milliseconds = milliseconds;
    this.emitter = new EventEmitter() as TypedEmitter.default<TimerEvents>;
  }

  start(): this {
    // If the timer is already running, do nothing.
    if (this.handle != null) {
      return this;
    }
    this.handle = setTimeout(() => {
      this.emitter.emit("timeout");
    }, this.milliseconds);
    return this;
  }

  cancel(): this {
    // If the timer is already cancelled, do nothing.
    if (this.handle == null) {
      return this;
    }
    clearInterval(this.handle);
    this.handle = undefined;
    return this;
  }

  restart(): this {
    this.cancel();
    return this.start();
  }

  on<K extends keyof TimerEvents>(event: K, listener: TimerEvents[K]): this {
    this.emitter.on(event, listener);
    return this;
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
