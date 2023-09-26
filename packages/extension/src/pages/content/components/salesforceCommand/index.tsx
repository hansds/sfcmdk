import { KeyboardEvent, useEffect, useRef, useState } from "react";
// import { useTheme } from "next-themes";
import { Command } from "../../../../cmdk/cmdk/src/index";
import { isProbablySalesforceId } from "../../../../shared/content/utils";
import { sendTypedMessage } from "../../../../shared/messaging/content";
import {
  MessageResponse,
  MessageType,
  RequestMap,
  SfCustomObject,
  SfUser,
} from "../../../../shared/messaging/types";
import { SALESFORCE_COMMANDS } from "../../../../shared/salesforce";
// import { setPaletteVisibility } from "../app";
import { useDebounce } from "use-debounce";
import { commandScore } from "../../../../cmdk/cmdk/src/command-score";
import {
  BookmarkIcon,
  DatabaseIcon,
  EnshiftIcon,
  ListIcon,
  OpenRecordIcon,
  RefreshIcon,
  ToolIcon,
  UserIcon,
} from "../icons";

type Props = {
  users: SfUser[];
  customObjects: SfCustomObject[];
  orgId: string;
  sendMessage: Parameters<typeof sendTypedMessage>[2];
  input?: string;
};

const CommandShortkey = {
  LOGIN_AS: "log",
  MANAGE_OBJECT: "obj",
  INSPECT_RECORD: "ins",
  OPEN_RECORD: "rec",
  INSPECT_CURRENT_RECORD: "inc",
  LIST_OBJECT: "lis",
  SETUP_ITEM: "set",
};

export default function SalesforceCommand({
  users,
  customObjects,
  orgId,
  sendMessage,
  input,
}: Props) {
  // const { resolvedTheme: theme } = useTheme();

  const ref = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const containerElement = useRef(null);

  const [loading, setLoading] = useState(false);
  const [recordId, setRecordId] = useState("");
  const [currentRecordId, setCurrentRecordId] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch] = useDebounce(search, 250);

  const [isMetaKeyActive, setIsMetaKeyActive] = useState(false);
  const [notification, setNotification] = useState("");

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

    setCurrentRecordIdFromLocation();
  }

  function setCurrentRecordIdFromLocation() {
    const recordId =
      window.location.pathname.split("/").pop() === "view"
        ? window.location.pathname.split("/").slice(-2)[0]
        : "";

    setCurrentRecordId(recordId);
  }

  function setRecordIdFromSearch(search: string): void {
    const last18chars = search.substring(search.length - 18);
    const newRecordId = isProbablySalesforceId(last18chars) ? last18chars : "";

    setRecordId(newRecordId);
  }

  function filter(value: string, search: string): number {
    // If a record id is entered, we want to make sure it's the first result
    if (
      (value === CommandShortkey.INSPECT_RECORD && recordId) ||
      (value === CommandShortkey.INSPECT_RECORD && currentRecordId) ||
      (value === CommandShortkey.OPEN_RECORD && recordId)
    ) {
      return 9999999;
    }

    return commandScore(value, search);
  }

  function isShortkeyMatchOrBestSuggestion(
    key: string,
    search: string
  ): boolean {
    return search.startsWith(key) || (search.length >= 4 && search[3] !== " ");
  }

  function handleError(response: MessageResponse<keyof RequestMap>) {
    if (response.error) {
      setNotification(response.error);
      // setPaletteVisibility(true);
      setLoading(false);
    }
  }

  // Optionally simulate input unless the user wants to type
  useEffect(() => {
    if (!input || inputRef.current === document.activeElement) return;
    else if (input === "⏎") {
      const command = listRef.current?.querySelector(
        'div[cmdk-item][role="option"]'
      ) as HTMLDivElement | null;
      if (command) command.click();
      bounce();
    } else if (input === "␡") {
      setSearch("");
    } else {
      setSearch((value) => value + input);
    }
  }, [input]);

  return (
    <div className="raycast" ref={containerElement}>
      <Command
        ref={ref}
        filter={filter}
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

          {/* Best Matches */}
          {debouncedSearch.length >= 3 &&
            !isProbablySalesforceId(debouncedSearch) && (
              <Command.Group heading="Best Matches">
                {/* Setup Items */}
                {isShortkeyMatchOrBestSuggestion(
                  CommandShortkey.SETUP_ITEM,
                  debouncedSearch
                ) &&
                  SALESFORCE_COMMANDS.map((setupItem, index) => {
                    return (
                      <Command.Item
                        key={index}
                        value={`${CommandShortkey.SETUP_ITEM} ${setupItem.value}`}
                        onSelect={() => {
                          sendTypedMessage(
                            MessageType.NavigateToSalesforcePath,
                            {
                              orgId,
                              path: setupItem.path,
                              newTab: isMetaKeyActive,
                            },
                            sendMessage
                          );
                        }}
                      >
                        <ToolIcon />
                        Setup {setupItem.label as string}
                      </Command.Item>
                    );
                  })}

                {/* List Objects */}
                {isShortkeyMatchOrBestSuggestion(
                  CommandShortkey.LIST_OBJECT,
                  debouncedSearch
                ) &&
                  customObjects.map((customObject, index) => {
                    return (
                      <Command.Item
                        key={index}
                        value={`${CommandShortkey.LIST_OBJECT} ${customObject.PluralLabel}`}
                        className="cmdk-item--with-aside"
                        onSelect={() => {
                          sendTypedMessage(
                            MessageType.OpenObjectList,
                            {
                              orgId,
                              apiName: customObject.QualifiedApiName as string,
                              newTab: isMetaKeyActive,
                            },
                            sendMessage
                          );
                        }}
                      >
                        <div cmdk-item-main="">
                          <ListIcon />
                          List {customObject.PluralLabel as string}
                        </div>
                        <div cmdk-item-aside="">
                          {customObject.NamespacePrefix as string}
                        </div>
                      </Command.Item>
                    );
                  })}

                {/* Login As */}
                {isShortkeyMatchOrBestSuggestion(
                  CommandShortkey.LOGIN_AS,
                  debouncedSearch
                ) &&
                  users.map((user, index) => {
                    return (
                      <Command.Item
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
                            },
                            sendMessage
                          );

                          handleError(response);
                        }}
                      >
                        <div cmdk-item-main="">
                          <UserIcon />
                          Login as {user.Name as string}
                        </div>
                        <div cmdk-item-aside="">{user.Username as string}</div>
                      </Command.Item>
                    );
                  })}

                {/* Manage Objects */}
                {isShortkeyMatchOrBestSuggestion(
                  CommandShortkey.MANAGE_OBJECT,
                  debouncedSearch
                ) &&
                  customObjects.map((customObject, index) => {
                    return (
                      <Command.Item
                        key={index}
                        value={`${CommandShortkey.MANAGE_OBJECT} ${customObject.Label}`}
                        className="cmdk-item--with-aside"
                        onSelect={() => {
                          sendTypedMessage(
                            MessageType.ManageObject,
                            {
                              orgId,
                              objectId: customObject.DurableId as string,
                              newTab: isMetaKeyActive,
                            },
                            sendMessage
                          );
                        }}
                      >
                        <div cmdk-item-main="">
                          <DatabaseIcon />
                          Manage object {customObject.Label as string}
                        </div>
                        <div cmdk-item-aside="">
                          {customObject.NamespacePrefix as string}
                        </div>
                      </Command.Item>
                    );
                  })}
              </Command.Group>
            )}

          {/* Data */}
          <Command.Group heading="Data">
            {recordId && (
              <Command.Item
                value={CommandShortkey.INSPECT_RECORD}
                onSelect={async () => {
                  if (recordId === "") return;

                  const response = await sendTypedMessage(
                    MessageType.OpenRecord,
                    {
                      orgId,
                      recordId: recordId,
                      newTab: isMetaKeyActive,
                    },
                    sendMessage
                  );

                  handleError(response);
                }}
              >
                <OpenRecordIcon />
                Inspect record…
                {recordId && <span cmdk-item-match="">{recordId}</span>}
                <div cmdk-item-shortcut="">ins</div>
              </Command.Item>
            )}
            {currentRecordId && (
              <Command.Item
                value={CommandShortkey.INSPECT_CURRENT_RECORD}
                onSelect={async () => {
                  if (currentRecordId === "") return;

                  const response = await sendTypedMessage(
                    MessageType.InspectRecord,
                    {
                      orgId,
                      recordId: currentRecordId,
                      newTab: isMetaKeyActive,
                    },
                    sendMessage
                  );

                  handleError(response);
                }}
              >
                <BookmarkIcon />
                Inspect current record…
                <span cmdk-item-match="">{currentRecordId}</span>
                <div cmdk-item-shortcut="">
                  {CommandShortkey.INSPECT_CURRENT_RECORD}
                </div>
              </Command.Item>
            )}
            {recordId && (
              <Command.Item
                value={CommandShortkey.OPEN_RECORD}
                onSelect={async () => {
                  if (recordId === "") return;

                  const response = await sendTypedMessage(
                    MessageType.OpenRecord,
                    {
                      orgId,
                      recordId: recordId,
                      newTab: isMetaKeyActive,
                    },
                    sendMessage
                  );

                  handleError(response);
                }}
              >
                <BookmarkIcon />
                Open record…
                <span cmdk-item-match="">{recordId}</span>
                <div cmdk-item-shortcut="">{CommandShortkey.OPEN_RECORD}</div>
              </Command.Item>
            )}

            <Command.Item value={CommandShortkey.LIST_OBJECT}>
              <ListIcon />
              List object…
              <div cmdk-item-shortcut="">lis</div>
            </Command.Item>
          </Command.Group>

          {/* Users */}
          <Command.Group heading="Users">
            <Command.Item value="login as">
              <UserIcon />
              Login as…
              <div cmdk-item-shortcut="">log</div>
            </Command.Item>
          </Command.Group>

          {/* Setup */}
          <Command.Group heading="Setup">
            <Command.Item value="manage object">
              <DatabaseIcon />
              Manage object…
              <div cmdk-item-shortcut="">obj</div>
            </Command.Item>
            <Command.Item value="setup">
              <ToolIcon />
              Setup…
              <div cmdk-item-shortcut="">set</div>
            </Command.Item>
          </Command.Group>

          {/* Command Palette */}
          <Command.Group heading="Command Palette">
            <Command.Item
              value="refresh metadata"
              onSelect={() => {
                sendTypedMessage(
                  MessageType.RefreshMetadata,
                  {
                    orgId,
                  },
                  sendMessage
                );
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
