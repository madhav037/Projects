import { supabase } from '@/lib/dbConnect';
import { subjectSchema } from '@/lib/validations/subjectValidations';
import { validationMiddleware } from '@/middleware/validationsMiddleware';
import { NextResponse } from 'next/server';

export const PUT = async(req:Request, res:Response)=>{
    
    const validate = await validationMiddleware(req, subjectSchema);
    if (validate.status == 400) return validate;

    const subject = await validate.json();
    const id = req.url!.split("subject/")[1]
    const { subject_name } = subject.body

    console.log(id);
    console.log(subject_name);
    
    try {
        const { data, error } = await supabase
            .from('subject')
            .update({ subject_name })
            .eq('id', id)
            .select();
        if (error) {
            throw error;
        }
        return NextResponse.json({status: 201 ,data: data, function_name: 'update_subject' });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status: 500, error_message: error.message, function_name: 'update_subject' });
    }
}

export const DELETE = async(req:Request, res:Response)=>{
    const id = req.url!.split("subject/")[1]

    try {
        const { data, error } = await supabase
            .from('subject')
            .delete()
            .eq('id', id);
        if (error) {
            throw error;
        }
        return NextResponse.json({status: 201 ,data: data, function_name: 'delete_subject' });
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status: 500, error_message: error.message, function_name: 'delete_subject' });
    }
}

export const GET = async(req:Request, res:Response)=>{
    const id = req.url!.split("subject/")[1]

    try {
        const { data, error } = await supabase
            .from('subject')
            .select()
            .eq('id', id)
        if (error) {
            throw error
        }
        return NextResponse.json({status: 201, data: data, function_name: 'get_subject'})
    } catch (error:any) {
        console.error(error)
        return NextResponse.json({status: 500, error_message: error.message, function_name: 'get_subject'})
    }
}