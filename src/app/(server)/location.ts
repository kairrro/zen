

function randomIP(): Promise<string> {
    return new Promise((resolve) => {
        const ip = [];

        for (let i = 0; i < 4; i++) {
            ip.push(Math.floor(Math.random() * 256));
        };

        resolve(ip.join("."));
    })
};

function randomTimezone(): string{
    const timezones: string[] = ['Europe/Lisbon', 'Indian/Comoro', 'Pacific/Kanton', 'America/Chicago'];
    const randomIndex: number = Math.floor(Math.random() * timezones.length);

    return timezones[randomIndex];
}

interface LocationData{
    timezone: string;
    ip: string;
    isp: string;
    country: string;
};

export async function randomLocation(): Promise<LocationData>{
    const localIP = await randomIP();
    const timezone = randomTimezone();

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