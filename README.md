# Salesforce Command Palette

## Structure

_Users_

- Login as
  - Login as > Firstname Lastname (username) [ProfileName]
- View user

_Setup_

- Manage Objects
  - Manage Object > Account
- Find in Setup ...
  - Setup > Apps > App Manager

_Data_

- View record by Id [depends on Salesforce Inspector]
- Copy current record Id

_Command Palette_

- Refresh metadata
- About

## Technical

### Multiple environments

The extension works by extracting the `orgId` from the current environment document's cookie. The metadata is then requested from the background script by finding the correct `sessionId` for the `orgId` in the cookies.

All separate environments' metadata is stored and cached in localstorage.

### Setup items

We get the setup items with the following script. The commands are not parsed live.

```javascript
const openAllParents = () => {
  const parents = document.querySelectorAll(
    ".onesetupSetupNavTree .parent[aria-expanded='false'] .slds-tree__item-label"
  );

  parents.forEach((e, i) => {
    setTimeout(() => {
      console.log("opening", e);
      e.click();

      console.log(i + 1, parents.length);
      if (parents.length == i + 1) {
        openAllParents();
      }
    }, i * 500);
  });
};

openAllParents();

const setupItems = [];
const headersByLevel = {};
const menuItems = document.querySelectorAll(
  ".onesetupSetupNavTree li.tree-node"
);

const getLabels = (level) => {
  let labels = [];

  for (let i = level; i >= 0; i--) {
    if (headersByLevel[i]) {
      labels = [headersByLevel[i], ...labels];
    }
  }

  return labels;
};

menuItems.forEach((e) => {
  const anchor = e.querySelector(".slds-tree__item > .slds-tree__item-label");

  // Manage header sections
  if (anchor) {
    headersByLevel[e.ariaLevel] = anchor.innerText;
  } else {
    headersByLevel[e.ariaLevel - 1] = e
      .querySelector(".section-header")
      .innerText.toLowerCase()
      .replace(/\b\w/g, (match) => match.toUpperCase());
  }

  const labels = getLabels(e.ariaLevel);
  const label = labels.join(" > ");

  if (anchor) {
    setupItems.push({
      label: label,
      path: anchor.href.split("/").slice(3).join("/"),
    });
  }
});
```

## Acknowledgements

- Functionality was heaviliy inspired by [Salesforce Navigator for Lightning
  ](https://github.com/dannysummerlin/force-navigator)
- Icons were generated from [Icon by Raycast](https://icon.ray.so/?q=pers) along with gradients from [UIGradients](https://uigradients.com/)
- Started from [chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)
