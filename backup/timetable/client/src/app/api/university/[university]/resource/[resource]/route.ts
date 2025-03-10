import { supabase } from '@/lib/dbConnect';
import { resourceSchema } from '@/lib/validations/resourceValidations';
import { validationMiddleware } from '@/middleware/validationsMiddleware';
import { NextResponse } from 'next/server';

export const PUT = async (req:any, res: any) => {

    const validate = await validationMiddleware(req, resourceSchema);
    if (validate.status == 400) return validate;

    const resource = await validate.json();
    const { resource_name, resource_type, capacity, duration } = resource.body
    const id = req.url!.split("resource/")[1]
    
    try {
        const { data, error } = await supabase
           .from('resource')
           .update({ resource_name, resource_type, capacity, duration })
           .eq('id', id);
            
        if (error) {
            throw error
        }
            
        return NextResponse.json({status:201, data: data, function_name: 'update_resource' });
        
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({status:500, error_message: error.message, function_name: 'update_resource' });
    }
}

export const DELETE = async (req:any, res: any) => {
    const id = req.url!.split("resource/")[1]
    
    try {
        const { data, error } = await supabase
           .from('resource')
           .delete()
           .eq('id', id);
            
        if (error) {
            throw error
        }
            
        return NextResponse.json({status:201, data: data, function_name: 'delete_resource' });
        
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({status:500, error_message: error.message, function_name: 'delete_resource' });
    }
}

export const GET = async (req:any, res: any) => {
    const id = req.url!.split("resource/")[1]
    
    try {
        const { data, error } = await supabase
           .from('resource')
           .select()
           .eq('id', id)
            
        if (error) {
            throw error
        }
            
        return NextResponse.json({status:201, data: data, function_name: 'get_resource' });
        
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({status:500, error_message: error.message, function_name: 'get_resource' });
    }
}