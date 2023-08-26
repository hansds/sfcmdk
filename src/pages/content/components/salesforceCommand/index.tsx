import React, { useState } from "react";
// import { useTheme } from "next-themes";
import * as Popover from "@radix-ui/react-popover";
import { getOrgIdFromDocument } from "@src/shared/content/utils";
import { Command, useCommandState } from "cmdk";
import {
  UserIcon,
  RaycastLightIcon,
  WindowIcon,
  FinderIcon,
  StarIcon,
} from "../icons";
import { MessageType, User } from "@src/shared/messaging";
import { sendTypedMessage } from "@src/shared/messaging/content";

export default function SalesforceCommand() {
  // const { resolvedTheme: theme } = useTheme();
  const ref = React.useRef<HTMLDivElement | null>(null);
  const [value, setValue] = React.useState("linear");
  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listRef = React.useRef(null);
  const containerElement = React.useRef(null);
  const orgId = getOrgIdFromDocument(document);

  const [users, setUsers] = useState([]);

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
      // TODO: Fix any
      const response = await sendTypedMessage(MessageType.GetUsers, {
        orgId,
      });

      console.log(response);

      const records = (response.data as any).records;

      setUsers(records);
    };

    fetchUsers();
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
          placeholder="Search for apps and commands..."
        />
        <hr cmdk-raycast-loader="" />
        <Command.List ref={listRef}>
          <Command.Empty>No results found.</Command.Empty>
          <Command.Group heading="Commands">
            <Command.Item>
              <UserIcon />
              Login as…
            </Command.Item>
            {users.map((user, index) => {
              return (
                <LoginAsItem
                  key={index}
                  value={`Login as ${user.Name} (${user.Username})`}
                  onSelect={() => {
                    sendTypedMessage(MessageType.LoginAsUser, {
                      orgId,
                      userId: user.Id,
                    });
                  }}
                >
                  <UserIcon />
                  Login as {user.Name} ({user.Username})
                </LoginAsItem>
              );
            })}
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
