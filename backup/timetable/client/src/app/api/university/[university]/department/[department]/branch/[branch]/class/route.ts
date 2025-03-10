import { supabase } from '@/lib/dbConnect';
import { classSchema } from '@/lib/validations/classValidations';
import { validationMiddleware } from '@/middleware/validationsMiddleware';
import { NextResponse } from 'next/server';

export const POST = async (req: any, res: any) => {

    const validate = await validationMiddleware(req, classSchema)
    if (validate.status == 400) return validate

    const class_data = await validate.json()
    const id = req.url!.split("branch/")[1].split("/")[0]
    const { class_no, total_batches, students_per_batch } = class_data.body
    try {
        const { data, error } = await supabase
            .from('class')
            .insert([{ class_no, total_batches, students_per_batch, branch_id: id }])
            .select();

        if (error) {
            throw error
        }

        return NextResponse.json({ status: 201, data: data, function_name: 'create_class' })
    }
    catch (error: any) {
        console.error(error);
        return NextResponse.json({ status: 500, error_message: error.message, function_name: 'create_class' });
    }
}

export const GET = async (req: any, res: any) => {
    const id = req.url!.split("branch/")[1].split("/")[0]
    console.log(id)

    try {
        const { data, error } = await supabase
            .from('class')
            .select()
            .eq('branch_id', id)

        if (error) {
            throw error
        }

        return NextResponse.json({ status: 201, data: data, function_name: 'get_classes' })

    } catch (error: any) {
        console.error(error)
        return NextResponse.json({ status: 500, error_message: error.message, function_name: 'get_classes' })
    }
}