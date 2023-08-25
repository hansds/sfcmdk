# Salesforce Command Palette

Started from [chrome-extension-boilerplate-react-vite](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite)

## TODO's

- Add localstorage caching to reduce salesforce requests
- Add integration with Salesforce inspector: allowing you to inspect records by pasting the id: chrome-extension://aodjmnfhjibkcdimpodiifdjnnncaafh/inspect.html?host=[inject]&objectType=[inject]&recordId=xxx

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

All separate environemnts' metadata is stored and cached in localstorage.

## Acknowledgements

- Functionality was heaviliy inspired by [Salesforce Navigator for Lightning
  ](https://github.com/dannysummerlin/force-navigator)
- Icons were generated from [Icon by Raycast](https://icon.ray.so/?q=pers)
