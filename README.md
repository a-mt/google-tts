
# Google TTS

Simple web server that returns Google's Text To Speech mp3 url for then given parameters  
Uses [google-tts-api](https://github.com/zlargon/google-tts)

## Call

    ?q=<TEXT>&tl=<LANG>&ttsspeed=<SPEED>

| Parameter | Description
|---        |---
| q         | Text to read. 200 characters maximum
| tl        | [Language](https://cloud.google.com/speech/docs/languages). Default: "en"
| ttsspeed  | Speed (1 = normal, 0.24 = slow). Default: 1