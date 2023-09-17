import React, { useState } from "react";
import { getOrgIdFromDocument } from "../../../../shared/content/utils";
import { sendTypedMessage } from "../../../../shared/messaging/content";
import SalesforceCommand from "../salesforceCommand";
import {
  MessageType,
  SfCustomObject,
  SfUser,
} from "@src/shared/messaging/types";

export default function SalesforceCommandContext() {
  const orgId = getOrgIdFromDocument(document);

  const [users, setUsers] = useState<SfUser[]>([]);
  const [customObjects, setCustomObjects] = useState<SfCustomObject[]>([]);

  React.useEffect(() => {
    const fetchUsers = async () => {
      const response = await sendTypedMessage(MessageType.GetUsers, {
        orgId,
      });

      setUsers(response.data?.records ?? []);
    };

    fetchUsers();
  }, []);

  React.useEffect(() => {
    const fetchCustomObjects = async () => {
      const response = await sendTypedMessage(MessageType.GetCustomObjects, {
        orgId,
      });

      setCustomObjects(response.data?.records ?? []);
    };

    fetchCustomObjects();
  }, []);

  return (
    <SalesforceCommand
      users={users}
      customObjects={customObjects}
      orgId={orgId}
      sendTypedMessage={sendTypedMessage}
    />
  );
}
