'use server';

import { revalidatePath } from 'next/cache';
import {redirect} from 'next/navigation';
import { db } from "@/db";
import { error } from 'console';
import { read } from 'fs';

export async function editSnippet(id:number,code:string){
    await db.snippet.update({
        where:{id},
        data:{code}
    });
    revalidatePath(`/snippets/${id}`);
    redirect(`/snippets/${id}`);
}
export async function deleteSnippet(id:number){
    await db.snippet.delete({
        where:{id}
    });
    revalidatePath('/');
    redirect('/');
}

// Updated createSnippet function
export async function createSnippet(state: { message: string }, payload: FormData) {
    try {
        const title = payload.get('title');
        const code = payload.get('code');
        
        if (typeof title !== 'string' || title.length < 3) {
            return { message: 'Title must be longer' };
        }
        
        if (typeof code !== 'string' || code.length < 10) {
            return { message: 'Code must be longer' };
        }

        await db.snippet.create({
            data: {
                title,
                code,
            },
        });

        return { message: 'Snippet created successfully' };
    } catch (err: unknown) {
        if (err instanceof Error) {
            return { message: err.message };
        } else {
            return { message: 'Something went wrong' };
        }
    } finally {
        revalidatePath('/');
        // Redirect the user back to the root route
        redirect('/');
    }
}

       
