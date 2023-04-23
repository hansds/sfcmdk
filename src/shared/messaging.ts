enum MessageType {
  GetSessionId = "getSessionId",
  FetchCustomObjects = "fetchCustomObjects",
}

export interface Request {
  type: MessageType.GetSessionId;
}

export interface GetSessionIdResponse {
  sessionId: string;
}

export function receiveMessages(
  request: Request,
  sender,
  sendResponse: (response?: any) => void
) {
  if (request.type == MessageType.GetSessionId) {
    const sessionId = getSessionId();
    sendResponse(sessionId);
  } else if (request.type == MessageType.FetchCustomObjects) {
    sendResponse([]);
  }
}

export async function getSessionId(): Promise<GetSessionIdResponse> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: MessageType.GetSessionId },
      (response) => {
        console.log("response", response);

        if (response) {
          resolve(response);
        } else {
          reject();
        }
      }
    );
  });
}
