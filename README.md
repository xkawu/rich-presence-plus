# Rich Presence +

Rich Presence + is an lightweight, fast and reliable **open source** Javascript project, to custom your Discord Rich Presence **as you want**.

# How to run Rich Presence + ?

-   `git clone https://github.com/xkawu/rich-presence-plus`
-   install [NodeJS](https://nodejs.org/en) (NodeJS v20 or above) and [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
-   run `cd rich-presence-plus`
-   `npm install`
-   execute `start.bat`

## `config.json`

### Table of fields

| Field   | Desc                            | Type   | Value                  |
| :------ | :------------------------------ | :----- | :--------------------- |
| `appId` | Your Discord Dev Application ID | string | Discord Application ID |
| `mode`  | The mode that you want to use   | string | `folder` or `dev`      |

### `mode` specifications

-   `folder`: The `presets` folder is **required**. [See how to use](https://github.com/xkawu/rich-presence-plus?tab=readme-ov-file#how-to-use-folder-mode-)
-   `dev`: You can do anything with this mode, from static to dynamic values from API. [See how to use](https://github.com/xkawu/rich-presence-plus?tab=readme-ov-file#how-to-use-dev-mode-)

`config.json` template :

```json
{
    "appId": "Your Discord Dev Portal App id",
    "mode": "the mode"
}
```

## Preset Data

### Table of fields

| Field            | Desc                                                              | Type           | Condition                                     |
| :--------------- | :---------------------------------------------------------------- | :------------- | :-------------------------------------------- |
| `details`        | Rich Presence `details` field.                                    | string         | -                                             |
| `state`          | Rich Presence `state` field.                                      | string         | -                                             |
| `largeImageKey`  | Url to the image that you want to use (`.png`, `.jpg`, `.gif`...) | string         | valid image URL                               |
| `largeImageText` | Text that will appear when mouse hover the large image.           | string         | if `largeImageKey` is here                    |
| `smallImageKey`  | Url to the image that you want to use (`.png`, `.jpg`, `.gif`...) | string [`URL`] | valid image URL                               |
| `smallImageText` | Text that will appear when mouse hover the small image.           | string         | if `smallImageKey` is here                    |
| `startTimestamp` | The time when you started the Presence                            | Date OR number | has to be a Date or a unix number             |
| `endTimestamp`   | The time when you will end the Presence                           | Date OR number | has to be a Date or a unix number             |
| `spectateSecret` | Secret code for your spectate session                             | string         | cannot set one if you have buttons            |
| `joinSecret`     | Secret code for your program/game session                         | string         | cannot set one if you have buttons            |
| `matchSecret`    | Secret code for your match session                                | string         | cannot set one if you have buttons            |
| `partyId`        | Your party ID                                                     | string         | -                                             |
| `partySize`      | This is used for like `1 of 5`, `1` is partySize                  | number         | to be visible, you need to have field `state` |
| `partyMax`       | This is used for like `1 of 5`, `5` is partyMax                   | number         | to be visible, you need to have field `state` |
| `buttons`        | Buttons that is clickable on your profile                         | array          | -                                             |
| `instance`       | If it is an instance or not                                       | boolean        | -                                             |

### `buttons` array specifications

_Note: You cannot set more than 2 buttons._
| Field | Desc |
| :----- | :--- |
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

## How to use `folder` mode ?

To use `folder` mode, you have to create a `.json` file inside `presets` folder with the name that you want. Then edit it as you want, put the data you like inside of it, but make sure to respect [The table of fields](https://github.com/xkawu/rich-presence-plus?tab=readme-ov-file#table-of-fields-1) !

## How to use `dev` mode ?

To use `dev` mode, it is simple, if you want to display a data that changes from an API, display stuff from your computer etc... you can do it easly and EZ!

### Basics

It is inside `presets.js` that you have to code.

Your function **needs to be exported** and **needs to be async** or it may not work or break in running time.
You can create the number of functions that you want, Rich Presence + will go through all of your functions that you exported.

An example of a really basic template :

```js
const preset = async () => {
    return {
        details: "Rich Presence +",
        largeImageKey: "https://cdn3.emoji.gg/emojis/9588-silver-star.png",
        buttons: [
            {
                label: "Rich Presence +",
                url: "https://github.com/xkawu/rich-presence-plus",
            },
        ],
    };
};

module.exports = { preset };
```

Here is an example when calling an API inside of it :

```js
const preset = async () => {
    const joke = await fetch("https://api.chucknorris.io/jokes/random")
        .then((res) => res.json())
        .then((body) => {
            return body.value;
        });

    return {
        details: "Chuck Norris Joke time",
        state: joke,
    };
};

module.exports = { preset };
```

## Alternatives

### Wealthy Presence

An alternative developed by sqmasep in TypeScript.
[Go to project Github page](https://github.com/sqmasep/wealthy-presence)
