const express = require('express');
const app = express();
const port = 3000;

const { sendRobloxLogs } = require("./utils/roblox.js");
const { sendDiscordLogs } = require("./utils/discord.js");

app.use(express.static('public'));
app.use(express.json());

app.get('/', async (req, res) => {
    res.sendFile(`${__dirname + '/index.html'}`);
});

async function handleLogsRequest(req, res, sendLogsFunction) {
    try {
        const payload = req.body;
        const webhook = payload['webhook'];

        const result = await sendLogsFunction(webhook);

        switch (true) {
            case result.includes("rate limited"):
                return res.status(429).json({ message : result });

            case result === "This webhook does not exist":
                return res.status(404).json({ message : result });

            case result.includes("404"):
                return res.status(404).json({message : "Unknown Webhook"});
                
            default:
                return res.status(200).json({ message: result });
        }

    } catch (error) {
        console.error(`An error occurred: ${error.message}`);
        return res.status(400).send("An error occurred...");
    }
}

app.post("/api/discord", async (req, res) => {
    await handleLogsRequest(req, res, sendDiscordLogs);
});

app.post("/api/roblox", async (req, res) => {
    await handleLogsRequest(req, res, sendRobloxLogs);
});

app.use((req, res) => {
    res.status(404).send('Not found.')
});

app.listen(port, () => {
    console.log(`Listening on http://localhost:${port}`)
});