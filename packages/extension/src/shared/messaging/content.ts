import { MessageRequest, MessageResponse, RequestMap } from "./types";

export function sendTypedMessage<T extends keyof RequestMap>(
  type: T,
  data: RequestMap[T]["request"],
  sendMessage: (message: MessageRequest<T>) => Promise<MessageResponse<T>>
): Promise<MessageResponse<T>> {
  const message: MessageRequest<T> = {
    type: type,
    data: data,
  };

  return sendMessage(message);
}
