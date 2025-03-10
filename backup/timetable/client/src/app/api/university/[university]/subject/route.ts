import { supabase } from '@/lib/dbConnect';
import { subjectSchema } from '@/lib/validations/subjectValidations';
import { validationMiddleware } from '@/middleware/validationsMiddleware';
import { NextResponse } from 'next/server';

export const POST = async(req:Request, res:Response)=>{

    const validate = await validationMiddleware(req, subjectSchema);
    if (validate.status == 400) return validate;

    const subject = await validate.json()
    const id = req.url!.split("university/")[1].split('/')[0]
    const { subject_name } = subject.body

    try {
        const { data, error } = await supabase
            .from('subject')
            .insert([{ subject_name, uni_id :parseInt(id)}])
            .select();
        if (error) {
            throw error;
        }
        return NextResponse.json({status:201, data: data, function_name: 'create_subject' });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status:500, error_message: error.message, function_name: 'create_subject' });
    }
}

export const GET = async(req:any, res:any)=>{
    const id = req.url!.split("university/")[1].split('/')[0]
    try {
        const { data, error } = await supabase
            .from('subject')
            .select()
            .eq('uni_id', id);
        if (error) {
            throw error;
        }
        return NextResponse.json({status:201, data: data, function_name: 'get_subject' });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status:500, error_message: error.message, function_name: 'get_subject' });
    }
}
