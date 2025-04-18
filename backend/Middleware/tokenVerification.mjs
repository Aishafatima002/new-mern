// import jwt from "jsonwebtoken";
// import "dotenv/config";

// const tokenVerification = (req, res, next) => {
//     try {

//         if (req.headers?.authorization) {
//             const token = req.headers.authorization.split(" ")[1];
//             const decoded = jwt.verify(token, process.env.JWT_SECRET);
//             if (decoded) {
//                 req.user = decoded; // Attach decoded user data (e.g., email) to the request object
//                 next();
//             } else {
//                 res.status(401).send({ status: 401, message: "Unauthorized Token" });
//             }
//         } else {
//             res.status(401).send({ status: 401, message: "Unauthorized Access" });
//         }
//     } catch (err) {
//         res.status(401).send({ err: err, status: 401, message: "Unauthorized Token" });
//     }
// };
// export default tokenVerification;

// // fetch("url",{
// //     headers:{
// //         "Authorization":"Barear token"
// //     }
// // })
import jwt from "jsonwebtoken";
import "dotenv/config";

const tokenVerification = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ status: 401, message: "Unauthorized Access: No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ status: 401, message: "Unauthorized Access: Invalid token format" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach decoded user data to the request object
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ status: 401, message: "Unauthorized Token: Invalid token" });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ status: 401, message: "Unauthorized Token: Token expired" });
    }
    return res.status(500).json({ status: 500, message: "Internal Server Error", error: err.message });
  }
};

export default tokenVerification;
