import { Webhook } from "svix";
import connectDB from "@/config/db";
import User from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import { headers } from 'next/headers';

export async function POST(req){
    const wh = new Webhook(process.env.SIGNING_SECRET);
    const headersList = headers();
    const svixHeaders = {
        "svix-id": headersList.get("svix-id"),
        "svix-timestamp": headersList.get("svix-timestamp"),
        
        "svix-signature": headersList.get("svix-signature"),
    };
    // Get the payload and verify it 

    const payload = await req.json();
    const body = JSON.stringify(payload);
    const {data, type} = wh.verify(body, svixHeaders)


    //Prepare the user data to be saved in the database
    const userData = {
        _id: data.id,
        email: data.email_addresses[0].email_address,
        name: `${data.first_name} ${data.last_name}`,
        image: data.image_url,

    };
    await connectDB();
    switch (type) {
        case 'user.created':
            await User.create(userData)
            
            break;
        case 'user.updated':
            await User.findByIdAndUpdate(data.id, userData)
            break;

            case 'user.deleted':
            await User.findByIdAndDelete(data.id)
            break;
        default:
            break;
    }
    return NextResponse.json({message: "Event received"});
}