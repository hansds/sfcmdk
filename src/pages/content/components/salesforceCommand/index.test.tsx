import { render, screen } from "@testing-library/react";
import App from "@src/pages/content/components/salesforceCommand";
import { sendTypedMessage } from "@src/shared/messaging/content";

describe("appTest", () => {
  test("render text", () => {
    // given
    const text = "content view";

    // when
    render(
      <App users={[]} customObjects={[]} sendTypedMessage={sendTypedMessage} />
    );

    // then
    screen.getByText(text);
  });
});
