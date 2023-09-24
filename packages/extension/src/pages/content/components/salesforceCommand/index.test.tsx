import { describe, jest, test } from "@jest/globals";
import { act, render } from "@testing-library/react";
import SalesforceCommand from ".";

class ResizeObserver {
  observe() {
    return jest.fn();
  }
  unobserve() {
    return jest.fn();
  }
  disconnect() {
    return jest.fn();
  }
}

describe("appTest", () => {
  window.ResizeObserver = ResizeObserver;
  window.HTMLElement.prototype.scrollIntoView = jest.fn();

  test("Benchmark rendering time of SalesforceCommand with updated input", () => {
    const startTime = performance.now();
    const { rerender } = render(
      <SalesforceCommand
        users={[]}
        customObjects={[]}
        orgId="dummyOrgId"
        sendMessage={(message) => Promise.resolve({ type: message.type })}
      />
    );

    // Update the input or props that trigger a re-render
    act(() => {
      rerender(
        <SalesforceCommand
          users={[]}
          customObjects={[]}
          orgId="dummyOrgId"
          sendMessage={(message) => Promise.resolve({ type: message.type })}
          input="sandbox"
        />
      );
    });

    const endTime = performance.now();
    const renderTime = endTime - startTime;

    if (renderTime > 500) {
      console.warn(
        "SalesforceCommand took more than 500ms to render with updated input. Consider optimizing the component."
      );
    } else {
      console.info(
        `SalesforceCommand took ${renderTime}ms to render with updated input.`
      );
    }
  });
});
