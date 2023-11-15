"use client";

import Image from "next/image";
import { mediumPoppins, boldPoppins } from "@/app/fonts";
import React, { useState } from "react";
import { sendDiscordLogs } from "./(server)/discord";
import { sendRobloxLogs } from "./(server)/roblox";

export default function Profile(){
    const [sending, setSending] = useState(false);
    const [webhook, setWebhook] = useState(''); 
    const [logType, setLogType] = useState('discord');
    const [result, setResult] = useState<string | void | undefined>(undefined);

    async function sendAll(): Promise<(string | void)[]>{
        const status = await Promise.all([sendRobloxLogs(webhook), sendDiscordLogs(webhook)]);

        return status;
    }

    async function sendLogs(){
        try {
            setSending(true);
            
            switch (logType){
                case "discord":
                    setResult(await sendDiscordLogs(webhook));
                    break;

                case "roblox":
                    setResult(await sendRobloxLogs(webhook));
                    break;

                case "all":
                    const allResults = await sendAll();
                    let isSuccess = true;

                    for (let i = 0; i < allResults.length; i++) {
                        if (allResults[i] === "This webhook does not exist" || allResults[i] === "This isnt a valid discord webhook") {
                            setResult("This webhook does not exist");
                            isSuccess = false;
                            break;
                        }
                    }

                    if (isSuccess) {
                        setResult("Fake logs have been sent");
                    }

                    break;

                default:
                    setResult("Something unexpected happened");
                    break;
            }

            setTimeout(() => {
                setResult(undefined);
            }, 5000);

        } finally {
            setSending(false);
        }
    }

    interface ResultComponentProps {
        result: string | null;
    }

    const ResultComponent: React.FC<ResultComponentProps> = ({ result }) => {
        const isSuccessful =
            result === "Fake logs have been sent" ||
            result === "Fake roblox cookies sent" ||
            result === "Fake discord credentials sent";

        return (
            <div>
                <div className="opacity-100 animate-pulse absolute text-sm top-0 right-0 py-4 m-4 px-4 rounded-xl text-neutral-200 bg-zinc-800">
                    <div className="flex">
                        {isSuccessful ? (<Image src="/tick.svg" alt="Checkmark" width={20} height={20} />) : (<Image src="/cross.svg" alt="Cross" width={20} height={20} />)}
                        <p className="pl-2"> {result} </p>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            {result !== undefined && result !== null && <ResultComponent result={result} />}

            <div className="flex justify-center items-center min-h-screen">
                <div className="bg-zinc-800 w-3/4 h-[30rem] rounded-lg flex flex-col justify-between">
                    <div className="flex justify-center mt-[-3rem]">
                        <div className="flex flex-col items-center">
                            <Image src="/pfp.gif" alt="Picture" width={130} height={130} className="rounded-full"/>
                            <h1 className={`font-bold text-2xl text-center mt-4 text-indigo-600 indigo-glow ${boldPoppins.className}`}>Zen</h1>
                            <p className={`text-xs text-neutral-400 mt-2`}>Discord Webhook Hitter</p>

                            <form className="flex flex-col mt-6" onSubmit={(e) => e.preventDefault()}>
                                <label htmlFor="webhook" className={`text-sm text-neutral-400 mb-2 ${mediumPoppins.className}`}>Discord Webhook</label>
                                <input type="text" value={webhook} id="webhook" required aria-required placeholder="Paste discord webhook here" autoComplete="off" onChange={(e) => setWebhook(e.target.value)}
                                className="rounded-lg px-4 w-[22rem] text-neutral-400 h-10 bg-transparent border border-2 border-zinc-600 text-xs focus:outline-none focus:border-indigo-600"/>
                                
                                <label htmlFor="logs" className={`text-sm text-neutral-400 mt-6 mb-2 ${mediumPoppins.className}`}>Type of logs</label>
                                <select id="logs" className={`rounded-lg px-4 w-[22rem] text-neutral-400 h-10 bg-transparent border border-2 border-zinc-600 text-xs focus:outline-none focus:border-indigo-600`} required
                                onChange={((e) => setLogType(e.target.value))}>
                                    <option value="discord" >Discord Credentials</option>
                                    <option value="roblox">Roblox Cookies</option>
                                    <option value="all">Both</option>
                                </select>

                                <button type="button" onClick={sendLogs} className="mt-10 text-sm bg-indigo-600 w-auto h-12 rounded-lg hover:bg-indigo-700 transition transition-300">
                                    {sending ? "Sending..." : "Hit Webhook"}
                                </button>
                            </form>
                        </div>
                    </div>
                    <button className="mx-auto text-neutral-400 text-xs text-center mb-2 hover:text-indigo-600" onClick={()=> window.open("https://github.com/damnkyro")}>
                        Created by kyro
                    </button>
                </div>
            </div>
        </div>
    )
};