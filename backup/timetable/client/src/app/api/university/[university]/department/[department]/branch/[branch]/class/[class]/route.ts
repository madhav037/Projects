import { supabase } from '@/lib/dbConnect';
import { classSchema_2 } from '@/lib/validations/classValidations';
import { validationMiddleware } from '@/middleware/validationsMiddleware';
import { NextResponse } from 'next/server';

export const PUT = async(req:any, res:any) => {

    const validate = await validationMiddleware(req, classSchema_2)
    if (validate.status == 400) return validate;

    const Class = await validate.json()
    const  id  = req.url.split('class/')[1]
    const { class_no, total_batches, students_per_batch, branch_id } = Class.body

    try {
        const { data, error } = await supabase
            .from('class')
            .update({ class_no, total_batches, students_per_batch, branch_id })
            .eq('id', id)
            .select()
            
        if (error) {
            throw error
        }
        
        return NextResponse.json({status: 201, data: data, function_name: 'update_class'})
        
    } catch (error:any) {
        console.error(error)
        return NextResponse.json({ status : 500, error_message: error.message, function_name: 'update_class' })
    }
}

export const DELETE = async(req:any, res:any) => {
    const id = req.url.split('class/')[1]
    try {
        const { data : sem_data, error: sem_error } = await supabase
            .from('semester')
            .delete()
            .eq('class_id', id)

        if (sem_error) {
            throw sem_error
        }

        const { data, error } = await supabase
            .from('class')
            .delete()
            .eq('id', id)
            
        if (error) {
            throw error
        }
        
        return NextResponse.json({status: 201, data: data, function_name: 'delete_class'})
        
    } catch (error:any) {
        console.error(error)
        return NextResponse.json({ status : 500, error_message: error.message, function_name: 'delete_class' })
    }
}

export const GET = async(req:any, res:any) => {
    const id = req.url!.split("class/")[1]

    try {
        const { data, error } = await supabase
            .from('class')
            .select()
            .eq('id', id)
            
        if (error) {
            throw error
        }
        
        return NextResponse.json({status: 201, data: data, function_name: 'get_class'})
        
    } catch (error:any) {
        console.error(error)
        return NextResponse.json({ status : 500, error_message: error.message, function_name: 'get_class' })
    }
}