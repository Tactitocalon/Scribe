# Scribe

A simple Node.js script for Conan Exile's [Tot ! Chat](https://steamcommunity.com/sharedfiles/filedetails/?id=2847709656) plugin 
that logs chat messages to a text file, and also takes screenshots of Conan Exiles when a chat message is received.

## Installation and Usage

1. Download and install [Node.js](https://nodejs.org/en/download/prebuilt-installer).
2. On the [Releases](https://github.com/Tactitocalon/Scribe/releases) page, download the latest version of Scribe and
   extract to any folder.
3. Run `scribe.bat` to start the Scribe server. A successful Scribe server will have the following message: `Scribe server running`
4. In Conan Exiles, while in-game, open the Main Menu (ESC), and click the `Sudo Player Panel` button in the top right-hand corner of the screen. 
5. Navigate to `Chat & UI Settings` under the `Roleplay` section in the top left-hand corner of the screen.
6. Check the `Enable Webhook` button, and put the following text in the Webhook URL field: `http://localhost:3000/message`
7. Hit `Save Changes` in the bottom right-hand corner. Messages in Local chat in Conan Exiles will now be recorded by Scribe.
8. Scribe will create a `logs` folder which contains logged chat messages as text files, and a `screenshots` folder,
   which will store screenshots in folders sorted by date.

## Configuration

Scribe offers the following configuration options, which can be set by editing the `config.js` file:

| Variable                   | Default Value | Description                                                                                                                                 |
|----------------------------|---------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| config.hostname            | 127.0.0.1     | Hostname of the Scribe server. Should not be modified.                                                                                      |
| config.port                | 3000          | Port of the Scribe server. Only modify if some other application is already using this port.                                                |
| config.screenshotQuality   | 60            | JPG quality of the screenshots taken. Valid values range from 1 to 100, with 100 being maximum quality. Higher quality increases file size. |
| config.screenshotFrequency | 3             | Controls the frequency of screenshots taken. A value of 3 means a screenshot is taken every 3 chat messages.                                |
