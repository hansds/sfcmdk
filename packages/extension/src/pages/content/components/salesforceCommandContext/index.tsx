import React, { useState } from "react";
import { getOrgIdFromDocument } from "../../../../shared/content/utils";
import { MessageType } from "../../../../shared/messaging";
import { sendTypedMessage } from "../../../../shared/messaging/content";
import { JSONArray } from "../../../../shared/messaging/types";
import SalesforceCommand from "../salesforceCommand";

export default function SalesforceCommandContext() {
  const orgId = getOrgIdFromDocument(document);

  const [users, setUsers] = useState<JSONArray>([]);
  const [customObjects, setCustomObjects] = useState<JSONArray>([]);

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
