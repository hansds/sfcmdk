import { KeyboardEvent, useEffect, useRef, useState } from "react";
// import { useTheme } from "next-themes";
import { commandScore } from "@src/shared/content/command-score";
import {
  getOrgIdFromDocument,
  isProbablySalesforceId,
} from "@src/shared/content/utils";
import { MessageType } from "@src/shared/messaging";
import { sendTypedMessage } from "@src/shared/messaging/content";
import { JSONArray, MessageResponse } from "@src/shared/messaging/types";
import { SALESFORCE_COMMANDS } from "@src/shared/salesforce";
import { Command, useCommandState } from "cmdk";
import { setPaletteVisibility } from "../app";
import {
  BookmarkIcon,
  DatabaseIcon,
  EnshiftIcon,
  RefreshIcon,
  ToolIcon,
  UserIcon,
} from "../icons";

type Props = {
  users: JSONArray;
  customObjects: JSONArray;
  sendTypedMessage: typeof sendTypedMessage;
};

export default function SalesforceCommand({
  users,
  customObjects,
  sendTypedMessage,
}: Props) {
  // const { resolvedTheme: theme } = useTheme();
  const orgId = getOrgIdFromDocument(document);

  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef(null);
  const containerElement = useRef(null);

  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState("");
  const [recordId, setRecordId] = useState("");
  const [search, setSearch] = useState("");
  const [isMetaKeyActive, setIsMetaKeyActive] = useState(false);
  const [notification, setNotification] = useState("");

  const CommandValue = {
    INSPECT_RECORD: "ins inspect record",
    LIST_OBJECT: "lis list object",
  };

  useEffect(() => {
    document.addEventListener(
      "salesforce-command-palette-opened",
      paletteOpened
    );
  }, []);

  function bounce() {
    if (ref.current) {
      ref.current.style.transform = "scale(0.96)";
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.transform = "";
        }
      }, 100);

      // setSearch("");
      // setPaletteVisibility(false);
    }
  }

  function paletteOpened() {
    inputRef?.current?.focus();

    const recordId =
      window.location.pathname.split("/").pop() === "view"
        ? window.location.pathname.split("/").slice(-2)[0]
        : "";

    setRecordId(recordId);
  }

  function setRecordIdFromSearch(search: string): void {
    const last18chars = search.substring(search.length - 18);
    const newRecordId = isProbablySalesforceId(last18chars) ? last18chars : "";

    setRecordId(newRecordId);
  }

  function filter(value: string, search: string): number {
    // If a record id is entered, we want to make sure it's the first result
    if (value === CommandValue.INSPECT_RECORD && recordId) {
      return 9999999;
    }

    return commandScore(value, search);
  }

  function handleError(response: MessageResponse<any>) {
    if (response.error) {
      setNotification(response.error);
      setPaletteVisibility(true);
      setLoading(false);
    }
  }

  return (
    <div className="raycast" ref={containerElement}>
      <Command
        ref={ref}
        value={value}
        filter={filter}
        onValueChange={(v) => setValue(v)}
        onKeyDown={(e: KeyboardEvent) => {
          setIsMetaKeyActive(e.metaKey);
          if (e.key === "Enter") {
            bounce();
          }
        }}
        onKeyUp={(e: KeyboardEvent) => {
          setIsMetaKeyActive(e.metaKey);
        }}
      >
        <div cmdk-raycast-top-shine="" />
        <Command.Input
          ref={inputRef}
          autoFocus
          value={search}
          onValueChange={(v) => {
            setSearch(v);
            setRecordIdFromSearch(v);
            setNotification("");
          }}
          placeholder="Search for commands..."
        />
        <hr cmdk-raycast-loader="" className={loading ? "loading" : ""} />
        <Command.List ref={listRef}>
          <Command.Empty>No results found.</Command.Empty>

          {/* Data */}
          <Command.Group heading="Data">
            <Command.Item
              value={CommandValue.INSPECT_RECORD}
              onSelect={async () => {
                if (recordId === "") return;

                const response = await sendTypedMessage(
                  MessageType.OpenRecord,
                  {
                    orgId,
                    recordId: recordId,
                    newTab: isMetaKeyActive,
                  }
                );

                handleError(response);
              }}
            >
              <BookmarkIcon />
              Inspect record…
              {recordId && <span cmdk-item-match="">{recordId}</span>}
              <div cmdk-item-shortcut="">ins</div>
            </Command.Item>

            <Command.Item value={CommandValue.LIST_OBJECT}>
              <DatabaseIcon />
              List object…
              <div cmdk-item-shortcut="">lis</div>
            </Command.Item>
            {customObjects.map((customObject, index) => {
              return (
                <ListObjectItem
                  key={index}
                  value={`List ${customObject.PluralLabel}`}
                  className="cmdk-item--with-aside"
                  onSelect={() => {
                    sendTypedMessage(MessageType.OpenObjectList, {
                      orgId,
                      apiName: customObject.QualifiedApiName as string,
                      newTab: isMetaKeyActive,
                    });
                  }}
                >
                  <div cmdk-item-main="">
                    <DatabaseIcon />
                    List {customObject.PluralLabel as string}
                  </div>
                  <div cmdk-item-aside="">
                    {customObject.NamespacePrefix as string}
                  </div>
                </ListObjectItem>
              );
            })}
          </Command.Group>

          {/* Users */}
          <Command.Group heading="Users">
            <Command.Item value="login as">
              <UserIcon />
              Login as…
              <div cmdk-item-shortcut="">log</div>
            </Command.Item>
            {users.map((user, index) => {
              return (
                <LoginAsItem
                  key={index}
                  value={`Login as ${user.Name}`}
                  className="cmdk-item--with-aside"
                  onSelect={async () => {
                    setLoading(true);
                    const response = await sendTypedMessage(
                      MessageType.LoginAsUser,
                      {
                        orgId,
                        userId: user.Id,
                      }
                    );

                    handleError(response);
                  }}
                >
                  <div cmdk-item-main="">
                    <UserIcon />
                    Login as {user.Name as string}
                  </div>
                  <div cmdk-item-aside="">{user.Username as string}</div>
                </LoginAsItem>
              );
            })}
          </Command.Group>

          {/* Setup */}
          <Command.Group heading="Setup">
            <Command.Item value="manage object">
              <DatabaseIcon />
              Manage object…
              <div cmdk-item-shortcut="">obj</div>
            </Command.Item>
            {customObjects.map((customObject, index) => {
              return (
                <CustomObjectItem
                  key={index}
                  value={`Manage object ${customObject.Label}`}
                  className="cmdk-item--with-aside"
                  onSelect={() => {
                    sendTypedMessage(MessageType.ManageObject, {
                      orgId,
                      objectId: customObject.DurableId as string,
                      newTab: isMetaKeyActive,
                    });
                  }}
                >
                  <div cmdk-item-main="">
                    <DatabaseIcon />
                    Manage object {customObject.Label as string}
                  </div>
                  <div cmdk-item-aside="">
                    {customObject.NamespacePrefix as string}
                  </div>
                </CustomObjectItem>
              );
            })}
            <Command.Item value="setup">
              <ToolIcon />
              Setup…
              <div cmdk-item-shortcut="">set</div>
            </Command.Item>
            {SALESFORCE_COMMANDS.map((setupItem, index) => {
              return (
                <SetupItem
                  key={index}
                  value={`Setup ${setupItem.label}`}
                  onSelect={() => {
                    sendTypedMessage(MessageType.NavigateToSalesforcePath, {
                      orgId,
                      path: setupItem.path,
                      newTab: isMetaKeyActive,
                    });
                  }}
                >
                  <ToolIcon />
                  Setup {setupItem.label as string}
                </SetupItem>
              );
            })}
          </Command.Group>

          {/* Command Palette */}
          <Command.Group heading="Command Palette">
            <Command.Item
              value="refresh metadata"
              onSelect={() => {
                sendTypedMessage(MessageType.RefreshMetadata, {
                  orgId,
                });
              }}
            >
              <RefreshIcon />
              Refresh metadata
            </Command.Item>
          </Command.Group>
        </Command.List>

        <div cmdk-raycast-footer="">
          {(notification && (
            <div cmdk-raycast-notification="">
              <div cmdk-raycast-notification-message="error">
                <div
                  cmdk-raycast-notification-bubble=""
                  className="temporary"
                ></div>
                {notification}
              </div>
            </div>
          )) || <EnshiftIcon />}

          <div cmdk-raycast-footer-actions="">
            <button cmdk-raycast-open-trigger="">
              Open
              <kbd>↵</kbd>
            </button>

            <hr />
            <button cmdk-raycast-subcommand-trigger="">
              Open in new tab
              <kbd>⌘</kbd>
              <kbd>↵</kbd>
            </button>
          </div>
        </div>
      </Command>
    </div>
  );
}

const LoginAsItem = (props: any) => {
  const search = useCommandState((state) => state.search);
  if (!search || !search.startsWith("log")) return null;
  return <Command.Item {...props} />;
};

const CustomObjectItem = (props: any) => {
  const search = useCommandState((state) => state.search);
  if (!search || !search.startsWith("obj")) return null;
  return <Command.Item {...props} />;
};

const ListObjectItem = (props: any) => {
  const search = useCommandState((state) => state.search);
  if (!search || !search.startsWith("lis")) return null;
  return <Command.Item {...props} />;
};

const SetupItem = (props: any) => {
  const search = useCommandState((state) => state.search);
  if (!search || !search.startsWith("set")) return null;
  return <Command.Item {...props} />;
};
