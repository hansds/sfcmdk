import React, { useState } from "react";
// import { useTheme } from "next-themes";
import {
  getOrgIdFromDocument,
  isProbablySalesforceId,
} from "@src/shared/content/utils";
import { MessageType } from "@src/shared/messaging";
import { sendTypedMessage } from "@src/shared/messaging/content";
import { Command, useCommandState } from "cmdk";
import {
  BookmarkIcon,
  DatabaseIcon,
  EnshiftIcon,
  RefreshIcon,
  ToolIcon,
  UserIcon,
} from "../icons";
import { JSONArray, MessageResponse } from "@src/shared/messaging/types";
import { SALESFORCE_COMMANDS } from "@src/shared/salesforce";
import { setPaletteVisibility } from "../app";
import { commandScore } from "@src/shared/content/command-score";
import SalesforceCommand from "../salesforceCommand";

export default function SalesforceCommandContext() {
  // const { resolvedTheme: theme } = useTheme();
  const orgId = getOrgIdFromDocument(document);

  const [loading, setLoading] = React.useState(false);
  const [value, setValue] = React.useState("");
  const [recordId, setRecordId] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [isMetaKeyActive, setIsMetaKeyActive] = React.useState(false);
  const [notification, setNotification] = React.useState("");

  const [users, setUsers] = useState<JSONArray>([]);
  const [customObjects, setCustomObjects] = useState<JSONArray>([]);

  const CommandValue = {
    INSPECT_RECORD: "ins inspect record",
    LIST_OBJECT: "lis list object",
  };

  React.useEffect(() => {
    const fetchUsers = async () => {
      const response = await sendTypedMessage(MessageType.GetUsers, {
        orgId,
      });

      setUsers(response.data.records);
    };

    fetchUsers();
  }, []);

  React.useEffect(() => {
    const fetchCustomObjects = async () => {
      const response = await sendTypedMessage(MessageType.GetCustomObjects, {
        orgId,
      });

      setCustomObjects(response.data.records);
    };

    fetchCustomObjects();
  }, []);

  function setRecordIdFromSearch(search: string): void {
    const last18chars = search.substring(search.length - 18);
    const newRecordId = isProbablySalesforceId(last18chars) ? last18chars : "";

    setRecordId(newRecordId);
  }

  return <SalesforceCommand users={users} customObjects={customObjects} />;
}
