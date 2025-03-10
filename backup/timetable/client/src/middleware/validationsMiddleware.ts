
import { NextRequest, NextResponse } from "next/server";

export const validationMiddleware = async (req : any, schema: any) => {
  try {
    // Parse and validate the incoming request body
    const body = await req.json();
    console.log(body);
    await schema.validate(body, { abortEarly: false });

    // Attach the validated data to the request for downstream use
    req.validatedBody = body;
    
    // If validation passes, allow the request to proceed
    return NextResponse.json({
      status: 200,
      body: req.validatedBody,
      message: "Validation successful",
      function_name: "middleware-validation",
    }); // Return null to indicate no error
  } catch (err:any) {

    // Return a JSON response with the validation errors
    return NextResponse.json(
      {
        status: 400,
        message: err.errors || err.message,
        function_name: "middleware-validation",
      },
      { status: 400 } // Set HTTP status code to 400 for Bad Request
    );
  }
};
