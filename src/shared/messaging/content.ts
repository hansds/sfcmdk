import { RequestMap } from ".";
import { MessageResponse, MessageRequest } from "./types";

export function sendTypedMessage<T extends keyof RequestMap>(
  type: T,
  data: RequestMap[T]["request"]
): Promise<MessageResponse<T>> {
  const message: MessageRequest<T> = {
    type: type,
    data: data,
  };

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      message,
      (response: MessageResponse<T> | undefined) => {
        if (response) {
          resolve(response);
        } else {
          reject();
        }
      }
    );
  });
}
