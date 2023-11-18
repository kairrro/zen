async function randomIP(){
    const ip = [];

    for (let i = 0; i < 4; i++) {
        ip.push(Math.floor(Math.random() * 256));
    };

    return ip.join(".");
};

async function randomTimezone(){
    const timezones = ['Europe/Lisbon', 'Indian/Comoro', 'Pacific/Kanton', 'America/Chicago'];
    const randomIndex = Math.floor(Math.random() * timezones.length);

    return timezones[randomIndex];
}

async function randomLocation(){
    const localIP = await randomIP();
    const timezone = await randomTimezone();

    try {
        const response = await fetch(`http://ip-api.com/json/${localIP}`, { method: 'GET' });

        if (response.ok){
            const jsonn = await response.json();

            const { timezone, query: ip, isp, country } = jsonn;

            if (timezone) {
                return { timezone, ip, isp, country }
            }
        }

    } catch (error){
        console.error(`An error occurred: ${error}`);
    } 

    return { timezone: timezone, ip: localIP, isp: "Unknown", country: "United Kingdom"};
}

module.exports = {
    randomLocation
}