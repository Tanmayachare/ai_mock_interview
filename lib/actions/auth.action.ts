'use server';

import {auth, db} from "@/firebase/admin";
import {cookies} from "next/headers";

const ONW_WEEK=60*60*24*7;

export async function signUp(params:SignUpParams) {
    const {uid, name, email} = params;

    try {
        const userReacord= await db.collection('users').doc(uid).get();

        if (userReacord.exists){
            return{
                success: false,
                message: 'This User is already exists.Please Sign-in'
            }
        }

        await db.collection('users').doc(uid).set({
            name,
            email,
        })

        return{
            success: true,
            message: 'Account created successfully. Please Sign-in'
        }

    }catch (error:any) {
        console.error('Error creating a user',error);

        if(error.code === 'auth/email-already-in-use'){
            return{
                success: false,
                message: 'this email is already in use'
            }
        }

        return{
            success: false,
            message: 'This email is already used.'
        }
    }
}

export async function signIn(params:SignInParams) {
    const {email, idToken} = params;
    try {
        const userRecord = await auth.getUserByEmail(email);

        if (!userRecord){
            return{
                success: false,
                message: 'User not found. Please Sign-up'
            }
        }
        await setSessionCookie(idToken);
    }catch (error:any) {
        console.log(error);
        return{
            success: false,
            message: 'Fail to log into an account.'
        }
    }
}

export async function setSessionCookie(idToken : string) {
    const cookieStore = await cookies();

    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONW_WEEK * 1000,
    })

    cookieStore.set('session', sessionCookie, {
        maxAge: ONW_WEEK,
        httpOnly: true,
        secure: process.env.NODE_ENV ==='production',
        path: '/',
        sameSite: 'lax'
    })
}

export async function getCurrentUser(): Promise<User | null> {
    const cookieStore = await cookies();

    const sessionCookie = cookieStore.get('session')?.value;

    if (!sessionCookie){
        return null;
    }

    try{
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.
            collection('users')
            .doc(decodedClaims.uid)
            .get();

        if(!userRecord.exists) return null;

        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;
    }catch (error:any) {
        console.log(error);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}