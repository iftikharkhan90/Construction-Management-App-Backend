import { loginValidationSchema, signUpValidationSchema } from "./validateUser.js"


export const signUpValidationRequest = (req, res, next) => {
    const { error } = signUpValidationSchema.validate(req.body, { abortEarly: false });

    if (error) {
        return res.status(400).json({
            message: 'Validation error',
            errors: error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            })),
        });
    }

    next();
};

export const loginValidationRequest = (req,res,next) => {
    const {error} = loginValidationSchema.validate(req.body , {absortEarly:false})
    if(error){
        return res.status(400).json({
            message:"Validation error",
            errors: error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message
            })),        
        })
    }
    next();
}


export const auth = async (req, res, next) => {
    try {
        const token = req.headers['authorization'];
        // check token

        if (!token) {
            return res.status(401).json({
                message: 'You are not authorized to access this protected resource',
                statusCode: 401,
            });
        }

        const protectedToken = token.slice('Bearer '.length);
        const decoded = jwt.verify(protectedToken, config.jwt.secret);
        

        next();
    } catch (error) {
        console.log(error);
        res.status(400).json({
            message: 'Token Is Invalid!',
            statusCode: 400,
        });
    }
};