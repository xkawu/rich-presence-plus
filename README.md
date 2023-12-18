# Rich Presence +

An **open source** project to custom your Discord Rich Presence **as you want**.

# How to run ?

-   `git clone https://github.com/xkawu/rich-presence-plus`
-   install [NodeJS](https://nodejs.org/en) and [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
-   run `cd rich-presence-plus`
-   `npm install`
-   `node .`

## `config.json`

### Table of fields

| Field          | Desc                                                     | Type   | Limits                         |
| :------------- | :------------------------------------------------------- | :----- | :----------------------------- |
| `appId`        | Your Discord Dev Application ID                          | string | /                              |
| `mode`         | The mode that you want to use                            | string | `static` or `dynamic`          |
| `staticPreset` | If you want to set a specific Presence for `static` mode | path   | Should start with `./presets/` |

### `modes` specifications

-   `static`: This will set **only 1 presence**. It is "static".
-   `dynamic`: This mode is like a "bot", but it is not a self-bot, **it's legal to us**e, it will chance after x seconds to whatever you want. To set it up, change the mode inside `config.json` to `dynamic`, it will go through each files inside the `presets` folder, **make sure that your Rich Presence presets files are correct**.
-   Template :

```json
{
    "appId": "Your Discord Dev Portal App id",
    "mode": "'static' OR 'dynamic'",
    "staticPreset": "./presets/yourconfig.json"
}
```

## Presets

### Table of fields

| Field            | Desc                                                              | Type           | Limits              |
| :--------------- | :---------------------------------------------------------------- | :------------- | :------------------ |
| `details`        | Rich Presence `details` field.                                    | string         | Text length         |
| `state`          | Rich Presence `state` field.                                      | string         | Text length         |
| `largeImageKey`  | Url to the image that you want to use (`.png`, `.jpg`, `.gif`...) | string [`URL`] | ?                   |
| `largeImageText` | Text that will appear when mouse hover the large image.           | string         | Text length         |
| `smallImageKey`  | Url to the image that you want to use (`.png`, `.jpg`, `.gif`...) | string [`URL`] | ?                   |
| `smallImageText` | Text that will appear when mouse hover the small image.           | string         | Text length         |
| `startTimestamp` | The time when you started the Presence                            | Date OR number | Date                |
| `endTimestamp`   | The time when you will end the Presence                           | Date OR number | Date                |
| `spectateSecret` | Secret code for your spectate session                             | string         | ?                   |
| `joinSecret`     | Secret code for your program/game session                         | string         | ?                   |
| `matchSecret`    | Secret code for your match session                                | string         | ?                   |
| `partyId`        | Your party ID                                                     | string         | ?                   |
| `partySize`      | This is used for like `1 of 5`, `1` is partySize                  | number         | Numbers length      |
| `partyMax`       | This is used for like `1 of 5`, `5` is partyMax                   | number         | Numbers length      |
| `buttons`        | Buttons that is clickable on your profile                         | array          | 2 items (2 buttons) |
| `instance`       | If it is an instance or not                                       | boolean        | /                   |

### `buttons` array specifications

_Note: You cannot set more than 2 buttons._
| Field | Desc |
| :----- | :---: |
| `label` | The text that will be on the button |
| `url` | The link that will redirect the button when clicked |

Template:

```json
{
    "details": "Details",
    "state": "State",
    "largeImageKey": "url to image",
    "largeImageText": "Text on hover",
    "smallImageKey": "url to image",
    "smallImageText": "Text on hover",
    "startTimestamp": "Date or numbers",
    "endTimestamp": "Date or numbers",
    "spectateSecret": "secret string",
    "joinSecret": "secret string",
    "matchSecret": "secret string",
    "partyId": "id",
    "partySize": 1,
    "partyMax": 5,
    "buttons": [
        {
            "label": "Button Text",
            "url": "https://"
        }
    ],
    "instance": "boolean"
}
```
