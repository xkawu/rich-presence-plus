# Rich Presence +

An open source project to custom your Rich Presence.

You can set it static (means 1 presence only that doesnt change) or dynamic, that means every x seconds, it will change your presence (cannot go below 15s).

config.json should looks like below

```
{
    "appId": "Your Discord Dev Portal App id"
    "mode": "static" OR "dynamic" (dynamic will go thru /presets and get every single file.json and use it as presence)
    "staticPreset": "./presets/yourconfig.json" // only if mode static is enable, to avoid getting the first file in the presets folder to be used, u can set a pre-defined presence
}
```
