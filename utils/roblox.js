const { createReadStream } = require('fs');
const { createInterface } = require('readline');
const { randomLocation } = require("./location");

async function randomRobloxInfo(){
    const robux = Math.floor(Math.random() * 6000);
    const rap = Math.floor(Math.random() * 7000);

    const characters = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let robloxCookie = "_|WARNING:-DO-NOT-SHARE-THIS.--Sharing-this-will-allow-someone-to-log-in-as-you-and-to-steal-your-ROBUX-and-items.|_";

    for (let i = 0; i < 744; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        robloxCookie += characters.charAt(randomIndex);
    };

    const robloxInfo = { robux, rap, robloxCookie };

    return robloxInfo;
};

async function GetData(url){
    let maxRetries = 3;

    for (let retry = 0; retry <= maxRetries; retry++){
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type' : 'application/json',
            }
        });
    
        if (response.ok){
            return await response.json();
        }
        
        if (retry < maxRetries){
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

async function formatDate(inputDate){
    const date = new Date(inputDate);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);

    return `${month}/${day}/${year}`;
}

async function robloxAPI() {
    const filePath = './public/media/files/robloxIDs.txt';
    const lines = [];
  
    const readStream = createInterface({
        input: createReadStream(filePath),
    });
  
    const readStreamPromise = new Promise((resolve) => {
        readStream.on('line', (line) => {
            lines.push(line);
    });
  
    readStream.on('close', () => {
        resolve();
        });
    });
  
    await readStreamPromise;
  
    if (lines.length !== 0) {
        const randomIndex = Math.floor(Math.random() * lines.length);
        const randomID = lines[randomIndex];
  
        try {
            const [friendCount, userInfo, getHeadshot] = await Promise.all([
                GetData(`https://friends.roblox.com/v1/users/${randomID}/friends/count`),
                GetData(`https://users.roblox.com/v1/users/${randomID}`),
                GetData(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${randomID}&size=352x352&format=Png&isCircular=false`),
            ]);
    
            const { count } = friendCount;
            const { name, created, id, displayName } = userInfo;
            let imageUrl = getHeadshot.data[0].imageUrl;
    
            if (imageUrl === '') {
                imageUrl = "https://images.rbxcdn.com/fab3a9d08d254fef4aea4408d4db1dfe-loading_dark.gif"
            }
    
            const creationDate = await formatDate(created);
    
            return { count, name, creationDate, id, displayName, imageUrl };
        } 

        catch (error) {
            console.error(`Error while fetching data: ${error}`);
            return "Error";
        }

    } else {
        return 'No data available';
    }
}

async function sendRobloxLogs(webhook){
    if (!webhook.startsWith("https://discord.com/api/webhooks")){
        return "This isnt a valid discord webhook";
    }

    const [robloxData, randomInfo, locationData] = await Promise.all([
        robloxAPI(),
        randomRobloxInfo(),
        randomLocation(),
    ]);

    const { count, name, creationDate, id, displayName, imageUrl } = robloxData;
    const { robux, rap, robloxCookie } = randomInfo;

    if (locationData) {
        const { ip, timezone } = locationData;

        const robloxPayload = {
            "embeds" : [
                {
                fields : [
                    {
                        name : "Username",
                        value : name,
                        inline : true
                    },
                    {
                        name : "Robux Balance",
                        value : robux,
                        inline : true
                    },
                    {
                        name : "User ID",
                        value : id,
                        inline : true
                    },
                    {
                        name : "Display Name",
                        value : displayName,
                        inline : true
                    },
                    {
                        name : "Creation Date",
                        value : creationDate,
                        inline : true
                    },
                    {
                        name : "RAP",
                        value : rap,
                        inline : true
                    },
                    {
                        name : "Friends",
                        value : count,
                        inline : true
                    },
                    {
                        name : "IP Address",
                        value : ip,
                        inline : true,
                    },
                    {
                        name : "Location",
                        value : timezone,
                        inline : true,
                    },
                    {
                        name : ".ROBLOSECURITY",
                        value : "```" + robloxCookie + "```",
                        inline : false,
                    },
                ], 
    
                thumbnail: {
                    url:
                        imageUrl,
                },
    
                title: "Roblox Cookie Stealer",
                description: `[Star the github page](https://github.com/damnkyro/zen) | [Roblox Profile](https://www.roblox.com/users/${id}/profile)`,
                color: "10181046",
                footer: {
                    text : "made by kyro",
                    icon_url : "https://i.pinimg.com/564x/fd/27/bd/fd27bda8edcd40ef1f6f24cc469762ca.jpg",
                }
            },
        ],

                avatar_url: "https://i.pinimg.com/564x/be/5a/cb/be5acbff46be99e34153df575a97a91f.jpg",
                username: "Roblox Stealer",
    }

        try {
            const response = await fetch(webhook, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                body: JSON.stringify(robloxPayload),
            });

            if (response.ok){
                return "Fake roblox cookies sent";
            }

            else if (response.status === 401){
                return "This webhook does not exist";
            }

            else if (response.status === 429){
                const data = await response.json();
                return `This webhook is being rate limited for ${parseFloat(data.retry_after)} seconds`;
            }

            else {
                console.error(`HTTP ${response.status}: ${await response.text()}`);
            }
            
        } catch (err) {
            console.log(`An error occurred: ${err}`);
        }
    }
}

module.exports = {
    sendRobloxLogs
};