import { supabase } from '@/lib/dbConnect';
import { sessionSchema } from '@/lib/validations/sessionValidations';
import { validationMiddleware } from '@/middleware/validationsMiddleware';
import { NextResponse } from 'next/server';

export const POST = async (req: any, res: any) => {

    const validate = await validationMiddleware(req, sessionSchema)
    if (validate.status == 400) return validate

    const session = await validate.json()
    const id = req.url!.split("department/")[1].split("/")[0]
    const { session_sequence, do_nothing, duration } = session.body

    try {
        const { data, error } = await supabase
            .from('session')
            .insert([{ session_sequence, do_nothing, duration, dept_id: id }])
            .select();
        if (error) {
            throw error;
        }
        return NextResponse.json({ status: 201, data: data, function_name: 'create_session' });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ status: 500, error_message: error.message, function_name: 'create_session' });
    }
}

export const GET = async (req: any, res: any) => {
    const id = req.url!.split("department/")[1].split('/')[0];
    console.log(id);

    try {
        const { data, error } = await supabase
            .from('session')
            .select()
            .eq('dept_id', id);
        if (error) {
            throw error;
        }
        return NextResponse.json({ status: 200, data: data, function_name: 'get_sessions' });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ status: 500, error_message: error.message, function_name: 'get_sessions' });
    }
}