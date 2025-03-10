import { supabase } from '@/lib/dbConnect';
import { resourceSchema } from '@/lib/validations/resourceValidations';
import { validationMiddleware } from '@/middleware/validationsMiddleware';
import { NextResponse } from 'next/server';

export const POST = async(req:any, res:any) => {

    const validate = await validationMiddleware(req, resourceSchema);
    if (validate.status == 400) return validate;

    const resource = await validate.json();
    const { resource_name, resource_type, capacity, duration } = resource.body
    const id = req.url!.split("university/")[1].split('/')[0]
    console.log(resource);
    console.log(id);
    
    try {
        const { data, error } = await supabase
            .from('resource')
            .insert({ resource_name:resource_name, resource_type:resource_type, capacity:capacity, duration:duration, uni_id:id });
        
        console.log(data);
        
            if (error) {
                throw error
            }
            
        return NextResponse.json({status:201, data: data , function_name: 'create_resource' });
        
    } catch (error:any) {
        console.error(error);
        return NextResponse.json({status:500, error_message: error.message , function_name: 'create_resource' });
    }
}

export const GET = async (req:any, res: any) => {
    const id = req.url!.split("university/")[1].split('/')[0]
    
    try {
        const { data, error } = await supabase
           .from('resource')
           .select('*')
           .eq('uni_id', id);
            if (error) {
                throw error
            }
            
        return NextResponse.json({status:201, data: data, function_name: 'get_resource_by_id' });
        
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({status:500, error_message: error.message, function_name: 'get_resource_by_id' });
    }
}





