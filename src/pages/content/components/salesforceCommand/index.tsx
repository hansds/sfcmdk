import React, { useState } from "react";
// import { useTheme } from "next-themes";
import { getOrgIdFromDocument } from "@src/shared/content/utils";
import { MessageType } from "@src/shared/messaging";
import { sendTypedMessage } from "@src/shared/messaging/content";
import { Command, useCommandState } from "cmdk";
import { DatabaseIcon, RaycastLightIcon, ToolIcon, UserIcon } from "../icons";
import { JSONArray } from "@src/shared/messaging/types";

export default function SalesforceCommand() {
  // const { resolvedTheme: theme } = useTheme();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [value, setValue] = React.useState("linear");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef(null);
  const containerElement = React.useRef(null);
  const orgId = getOrgIdFromDocument(document);

  const [users, setUsers] = useState<JSONArray>([]);
  const [customObjects, setCustomObjects] = useState<JSONArray>([]);

  React.useEffect(() => {
    document.addEventListener("salesforce-command-palette-opened", () => {
      inputRef?.current?.focus();
      console.log(users);
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

      // setInputValue("");
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

          // if (isHome || inputValue.length) {
          //   return;
          // }

          // if (e.key === "Backspace") {
          //   e.preventDefault();
          //   popPage();
          //   bounce();
          // }
        }}
      >
        <div cmdk-raycast-top-shine="" />
        <Command.Input
          ref={inputRef}
          autoFocus
          placeholder="Search for commands..."
        />
        <hr cmdk-raycast-loader="" />
        <Command.List ref={listRef}>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Users">
            <Command.Item>
              <UserIcon />
              Login as…
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
            </Command.Item>
            {customObjects.map((customObject, index) => {
              return (
                <CustomObjectItem
                  key={index}
                  value={`Manage ${customObject.Label}`}
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
                    Manage {customObject.Label as string}
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
            </Command.Item>
          </Command.Group>
        </Command.List>

        <div cmdk-raycast-footer="">
          <RaycastLightIcon />

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
  if (!search) return null;
  return <Command.Item {...props} />;
};

const CustomObjectItem = (props) => {
  const search = useCommandState((state) => state.search);
  if (!search) return null;
  return <Command.Item {...props} />;
};
