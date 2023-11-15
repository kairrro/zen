"use client"

import Profile from '@/app/profile';

export default async function Home() {
    return (
        <main>
            <div className="absolute h-screen w-screen opacity-50 relative bg-no-repeat bg-cover" style={{backgroundImage: 'url("background.jpg")'}}/>
            <div className="absolute inset-0 flex flex-col overflow-y-auto">
                <Profile />
            </div>
        </main>
    );
  }
