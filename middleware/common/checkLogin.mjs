import jwt from "jsonwebtoken";
const checkLogin = (req, res, next) => {
  let cookies =
    Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;

  if (cookies) {
    try {
      const token = cookies[process.env.COOKIE_NAME];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
      next();
    }catch (err) {
      console.log(err.name);
      let msg;
      if(err.name === 'TokenExpiredError' ) msg = "Session Expired! Login again."
      else  msg = "Authentication Failure!";
      res.status(500).json({
        error: msg
      });
    }
  } else {
      res.status(401).json({
        error: "You must login first."
      });
    
  }
};

export {checkLogin};``