import { supabase } from "@/lib/dbConnect"
import { NextResponse } from "next/server"

export const GET = async (req:any, res:any) => {
    const id = req.url!.split("university/")[1].split('/')[0]

    try {
        const { data:department_data, error:department_error } = await supabase
            .from('department')
            .select()
            .eq('uni_id', id);

        if (department_error) {
            throw department_error;
        }

        const sessions: any = []

        for (const department of department_data) {
            const { data: session_data, error: session_error } = await supabase
                .from('session')
                .select()
                .eq('dept_id', department.id);
                
            if (session_error) {
                throw session_error;
            }
            

            session_data.map((session:any) => {
                session.dept_name = department.department_name
            })

            sessions.push({session_data})
        }

        const final_session : any = []

        sessions.map((session:any) => {
            session.session_data.map((ses:any) => {
                final_session.push(ses)
            } )
        })

        return NextResponse.json({ status: 201, data: final_session, function_name: 'get_session' });


    } catch (
        error: any
    ) {
        console.error(error)
        return NextResponse.json({status: 500, error_message: error.message, function_name: 'get_session'})
    }

}