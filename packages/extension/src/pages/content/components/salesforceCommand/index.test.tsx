import { render, screen } from "@testing-library/react";
import App from "@src/pages/content/components/salesforceCommand";
import { describe, test } from "@jest/globals";

describe("appTest", () => {
  test("render text", () => {
    // given
    const text = "content view";

    // when
    render(
      <App
        users={[]}
        customObjects={[]}
        orgId="dummyOrgId"
        sendMessage={chrome.runtime.sendMessage}
      />
    );

    // then
    screen.getByText(text);
  });
});
