'use client';

import { useSession, signOut } from "next-auth/react";


export const Navbar = () => {
    const {data:session} =  useSession();
    if(session) 
        {return <div className="button">
            <button onClick={() => signOut({ callbackUrl: '/' })}>Log Ud</button>
            </div>} 
}