import React, { useState } from "react";
// import { useTheme } from "next-themes";
import { getOrgIdFromDocument } from "@src/shared/content/utils";
import { MessageType } from "@src/shared/messaging";
import { sendTypedMessage } from "@src/shared/messaging/content";
import { Command, useCommandState } from "cmdk";
import {
  DatabaseIcon,
  EnshiftIcon,
  RefreshIcon,
  ToolIcon,
  UserIcon,
} from "../icons";
import { JSONArray } from "@src/shared/messaging/types";
import { SALESFORCE_COMMANDS } from "@src/shared/salesforce";
import { setPaletteVisibility } from "../app";

export default function SalesforceCommand() {
  // const { resolvedTheme: theme } = useTheme();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [value, setValue] = React.useState("");
  const [search, setSearch] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef(null);
  const containerElement = React.useRef(null);
  const orgId = getOrgIdFromDocument(document);

  const [users, setUsers] = useState<JSONArray>([]);
  const [customObjects, setCustomObjects] = useState<JSONArray>([]);

  React.useEffect(() => {
    document.addEventListener("salesforce-command-palette-opened", () => {
      inputRef?.current?.focus();
    });
  }, []);

  React.useEffect(() => {
    inputRef?.current?.focus();
  }, []);

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

  function bounce() {
    if (ref.current) {
      ref.current.style.transform = "scale(0.96)";
      setTimeout(() => {
        if (ref.current) {
          ref.current.style.transform = "";
        }
      }, 100);

      setSearch("");
      setPaletteVisibility(false);
    }
  }

  return (
    <div className="raycast" ref={containerElement}>
      <Command
        ref={ref}
        value={value}
        onValueChange={(v) => setValue(v)}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Enter") {
            bounce();
          }
        }}
      >
        <div cmdk-raycast-top-shine="" />
        <Command.Input
          ref={inputRef}
          autoFocus
          value={search}
          onValueChange={setSearch}
          placeholder="Search for commands..."
        />
        <hr cmdk-raycast-loader="" />
        <Command.List ref={listRef}>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Users">
            <Command.Item>
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
                  onSelect={() => {
                    sendTypedMessage(MessageType.LoginAsUser, {
                      orgId,
                      userId: user.Id,
                    });
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
          <Command.Group heading="Setup">
            <Command.Item>
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
            <Command.Item>
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
                    });
                  }}
                >
                  <ToolIcon />
                  Setup {setupItem.label as string}
                </SetupItem>
              );
            })}
          </Command.Group>
          <Command.Group heading="Command Palette">
            <Command.Item
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
          <EnshiftIcon />

          <button cmdk-raycast-open-trigger="">
            Open
            <kbd>↵</kbd>
          </button>

          <hr />
          <button cmdk-raycast-subcommand-trigger="">
            Open in new tab
            <kbd>⌥</kbd>
            <kbd>↵</kbd>
          </button>
        </div>
      </Command>
    </div>
  );
}

const LoginAsItem = (props) => {
  const search = useCommandState((state) => state.search);
  if (!search || !search.startsWith("log")) return null;
  return <Command.Item {...props} />;
};

const CustomObjectItem = (props) => {
  const search = useCommandState((state) => state.search);
  if (!search || !search.startsWith("obj")) return null;
  return <Command.Item {...props} />;
};

const SetupItem = (props) => {
  const search = useCommandState((state) => state.search);
  if (!search || !search.startsWith("set")) return null;
  return <Command.Item {...props} />;
};
