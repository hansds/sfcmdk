import { RequestMap } from ".";
import { MessageRequest, MessageResponse } from "./types";

export function sendTypedMessage<T extends keyof RequestMap>(
  type: T,
  data: RequestMap[T]["request"]
): Promise<MessageResponse<T>> {
  const message: MessageRequest<T> = {
    type: type,
    data: data,
  };

  return chrome.runtime.sendMessage(message);
}
