// Example from https://beta.reactjs.org/learn

import { useState } from "react";
import styles from "./counters.module.css";
import { SalesforceCommand } from "@sfcmdk/extension";

import "@sfcmdk/extension/src/assets/style/theme.scss";
import "@sfcmdk/extension/src/assets/style/raycast.scss";

function MyButton() {
  const [count, setCount] = useState(0);

  function handleClick() {
    setCount(count + 1);
  }

  return (
    <div>
      <button onClick={handleClick} className={styles.counter}>
        Clicked {count} times
      </button>
    </div>
  );
}

export default function MyApp() {
  return (
    <div>
      <MyButton />
      <SalesforceCommand
        users={[]}
        customObjects={[]}
        orgId="dummyOrgId"
        sendTypedMessage={() => {
          return null;
        }}
      />
    </div>
  );
}
