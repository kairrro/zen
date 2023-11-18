## Zen
Zen is a web app that sends fake roblox cookies and discord credentials to a discord webhook. I made this tool as a way to troll people who try to token grab / cookie log you.

I made this project with Express JS.

## How to use
1. Make sure you have [Node.js](https://nodejs.org/) installed
2. Enter the project directory
3. Run `npm install` to get the dependencies
4. Run `npm start` to run the program
5. Open `http://localhost:3000/`

## How it works
Zen has a list of random roblox ID's, image URL's and a few scraped discord usernames in the `public/media/files` directory. Every time you send a fake log, it takes information randomly from it and sends it to the webhook of choice.

## Encountered a bug?
Be sure to post it in the issues tab with a screenshot of how it was gotten or the console log.

## Preview
![image](https://raw.githubusercontent.com/damnkyro/media/blob/main/media/zen-media/panel.png)
![image](https://raw.githubusercontent.com/damnkyro/media/blob/main/media/zen-media/discord.png)
![image](https://raw.githubusercontent.com/damnkyro/media/blob/main/media/zen-media/roblox.png)
