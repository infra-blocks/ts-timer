import { expect, sinon } from "@infra-blocks/test";
import { injectFakeTimersFixtures } from "@infra-blocks/test/mocha/bdd";
import { timer } from "../../src/index.js";

declare module "mocha" {
  interface Context {
    clock: sinon.SinonFakeTimers;
  }
}

describe("timer", () => {
  injectFakeTimersFixtures();

  it("should dispatch to the callback at the proper time ", function () {
    const handler = sinon.fake();
    timer(100).on("timeout", handler).start();
    this.clock.tick(99);
    expect(handler).to.not.have.been.called;
    this.clock.tick(1);
    expect(handler).to.have.been.calledOnce;
  });
  it("should handle double starts as if it had been called only once", function () {
    const handler = sinon.fake();
    const t = timer(100).on("timeout", handler).start();
    this.clock.tick(90);
    expect(handler).to.not.have.been.called;
    t.start();
    this.clock.tick(10);
    expect(handler).to.have.been.calledOnce;
    this.clock.tick(100);
    // Still called only once.
    expect(handler).to.have.been.calledOnce;
  });
  it("should treat a start after an expiration as a restart", function () {
    const handler = sinon.fake();
    const t = timer(100).on("timeout", handler).start();
    this.clock.tick(100);
    expect(handler).to.have.been.calledOnce;
    t.start();
    this.clock.tick(100);
    expect(handler).to.have.been.calledTwice;
  });
  it("should treat cancellation as a no-op when not started", () => {
    // It's not throwing.
    timer(100).cancel();
  });
  it("should prevent the timeout callback from being called when cancelled", function () {
    const handler = sinon.fake();
    const t = timer(100).on("timeout", handler).start();
    this.clock.tick(50);
    expect(handler).to.not.have.been.called;
    t.cancel();
    this.clock.tick(50);
    expect(handler).to.not.have.been.called;
  });
  it("should be able to be restarted after completion", function () {
    const handler = sinon.fake();
    const t = timer(100).on("timeout", handler).start();
    this.clock.tick(100);
    expect(handler).to.have.been.calledOnce;
    t.restart();
    this.clock.tick(100);
    expect(handler).to.have.been.calledTwice;
  });
  it("should be able to be restarted mid-timer", function () {
    const handler = sinon.fake();
    const t = timer(100).on("timeout", handler).start();
    this.clock.tick(50);
    expect(handler).to.not.have.been.called;
    t.restart();
    this.clock.tick(50);
    expect(handler).to.not.have.been.called;
    this.clock.tick(50);
    expect(handler).to.have.been.calledOnce;
  });
  it("should be able to be restarted after cancellation", function () {
    const handler = sinon.fake();
    const t = timer(100).on("timeout", handler).start();
    this.clock.tick(50);
    expect(handler).to.not.have.been.called;
    t.cancel();
    this.clock.tick(50);
    t.restart();
    this.clock.tick(50);
    expect(handler).to.not.have.been.called;
    this.clock.tick(50);
    expect(handler).to.have.been.calledOnce;
  });
});
