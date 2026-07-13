import jwt, { JwtPayload } from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

interface AuthRequest extends Request {
  user?:  jwt.JwtPayload & {id : string};
}
export const verifyToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: "JWT_SECRET is missing" });
      return;
    }

    let token = req.header("Authorization");
    if (!token) {
      res.status(403).json({ message: "Access denied" });
      return;
    }

    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length).trim();
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload & {id : string};
    req.user = verified;
    next();
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Invalid token";
    res.status(401).json({ message });
  }
};


// import jwt, { JwtPayload } from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";

// interface AuthRequest extends Request {
//   user?: jwt.JwtPayload & { id: string };
// }

// export const verifyToken = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   try {
//     // Log all headers for debugging
//     console.log('📋 All Headers:', req.headers);
    
//     // JWT_SECRET
//     if (!process.env.JWT_SECRET) {
//       console.error(' JWT_SECRET is missing');
//       res.status(500).json({ message: "JWT_SECRET is missing" });
//       return;
//     }

//     // Authorization header 
//     const authHeader = req.header("Authorization");
//     console.log(' Authorization header:', authHeader);
    
//     if (!authHeader) {
//       console.log(' No Authorization header');
//       res.status(401).json({ message: "Access denied. No token provided." });
//       return;
//     }

//     // Bearer prefix 
//     if (!authHeader.startsWith("Bearer ")) {
//       console.log(' Invalid token format');
//       res.status(401).json({ message: "Invalid token format. Must start with 'Bearer '" });
//       return;
//     }

//     const token = authHeader.slice(7, authHeader.length).trim();
//     console.log(' Token extracted:', token.substring(0, 20) + '...');

    
//     try {
//       const verified = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload & { id: string };
//       console.log(' Token verified. User ID:', verified.id);
//       req.user = verified;
//       next();
//     } catch (jwtError) {
//       console.error(' JWT Verification failed:', jwtError);
//       res.status(403).json({ message: "Invalid or expired token." });
//       return;
//     }
//   } catch (err: unknown) {
//     console.error(' Unexpected error:', err);
//     const message = err instanceof Error ? err.message : "Invalid token";
//     res.status(401).json({ message });
//   }
// };

// import jwt, { JwtPayload } from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";

// interface AuthRequest extends Request {
//   user?: jwt.JwtPayload & { id: string };
// }

// export const verifyToken = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction,
// ): Promise<void> => {
//   try {
   
//     if (!process.env.JWT_SECRET) {
//       console.error(' JWT_SECRET is missing');
//       res.status(500).json({ message: "JWT_SECRET is missing" });
//       return;
//     }

    
//     const authHeader = req.header("Authorization");
//     console.log('🔑 Authorization header:', authHeader);
    
//     if (!authHeader) {
//       console.log(' No Authorization header');
//       res.status(401).json({ message: "Access denied. No token provided." });
//       return;
//     }

    
//   if (!authHeader.startsWith("Bearer ")) {
//       console.log('Invalid token format');
//       res.status(401).json({ message: "Invalid token format. Must start with 'Bearer '" });
//       return;
//     }

//     const token = authHeader.slice(7, authHeader.length).trim();
//     console.log(' Token extracted:', token.substring(0, 20) + '...');

//     try {
//       const verified = jwt.verify(token, process.env.JWT_SECRET) as JwtPayload & { id: string };
//       console.log(' Token verified. User ID:', verified.id);
//       req.user = verified;
//       next();
//     } catch (jwtError: any) {
//       console.error(' JWT Verification failed:', jwtError.message);
      
     
//       if (jwtError.name === 'JsonWebTokenError') {
//         res.status(403).json({ message: "Invalid token format. Please login again." });
//       } else if (jwtError.name === 'TokenExpiredError') {
//         res.status(403).json({ message: "Token expired. Please login again." });
//       } else {
//         res.status(403).json({ message: "Invalid or expired token." });
//       }
//       return;
//     }
//   } catch (err: unknown) {
//     console.error(' Unexpected error:', err);
//     const message = err instanceof Error ? err.message : "Invalid token";
//     res.status(401).json({ message });
//   }
// };