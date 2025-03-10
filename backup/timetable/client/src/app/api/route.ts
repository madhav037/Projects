import { supabase } from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

export async function POST(req:any, res:any){
    const university = await req.json();
    const { university_name } = university
    
    try {
        const { data, error } = await supabase
            .from('university')
            .insert([{
                university_name,
            }])

        if (error) {
            throw error
        }

        return NextResponse.json({ status:201, data: data ,function_name: 'create_university' })
    } catch (error:any) {
        return NextResponse.json({status:500, error_message: error.message, function_name: 'create_university' })
    }
}