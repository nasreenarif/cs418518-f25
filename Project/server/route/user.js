import { Router } from "express";
import { connection } from "../database/connection.js";
// Import password hashing function
import { hashPassword } from "../utils/helper.js";
// Import compare password function
import { comparePassword } from "../utils/helper.js";
// Import send email function
import "dotenv/config";
import { sendEmail } from "../utils/sendmail.js";

const user = Router();

user.get("/", (req, res) => {
  ////write logic
  console.log(process.env.DB_HOST);
  connection.execute("select * from user_info", function (err, result) {
    if (err) {
      return res.json({ message: err.message });
    }
    // response json
    res.json({
      status: 200,
      message: "Response from get api",
      result: result,
    });
  });
});

user.get("/:id", (req, res) => {
  ////write logic
  // response json
  res.json({
    status: 200,
    message: "Response from get api",
    id: req.params.id,
  });
});

//API with multiple parameters
user.get("/:user/:postId", (req, res) => {
  res.json({
    status: 200,
    message: "Response from GET API",
    userId: req.params.user,
    postId: req.params.postId,
  });
});

// Post API
// -- add body-parser package include as a middleware
// app.use(bodyParser.json());
// user.post("/", (req, res) => {
//   connection.execute(
//     "insert into user_info (u_first_name,u_last_name,u_email,u_password,is_verified,is_admin) values (?,?,?,?,?,?)",
//     [
//       req.body.u_first_name,
//       req.body.u_last_name,
//       req.body.u_email,
//       req.body.u_password,
//       req.body.is_verified,
//       req.body.is_admin,
//     ],
//     function (error, result) {
//       if (error) {
//         res.json({ message: error.message });
//       }
//       res.json({
//         status: "200",
//         message: "Response of post api",
//         result: result,
//       });
//     }
//   );
// });

// Post API with hashed Password
// -- add body-parser package include as a middleware
// app.use(bodyParser.json());
user.post("/", (req, res) => {
  try {
    const hashedPassword = hashPassword(req.body.u_password);

    connection.execute(
      "insert into user_info (u_first_name,u_last_name,u_email,u_password,is_verified,is_admin) values (?,?,?,?,?,?)",
      [
        req.body.u_first_name,
        req.body.u_last_name,
        req.body.u_email,
        hashedPassword,
        req.body.is_verified,
        req.body.is_admin,
      ],
      function (error, result) {
        if (error) {
          res.json({ message: error.message });
        }
        res.json({
          status: "200",
          message: "Response of post api",
          result: result,
        });
      },
    );
  } catch (err) {
    res.status(500).json({
      message: "Internal server error",
      error: err.message,
    });
  }
});

//PUT API
user.put("/:id", (req, res) => {
  connection.execute(
    "update user_info set u_first_name=?, u_last_name=? where u_id=?",
    [req.body.u_first_name, req.body.u_last_name, req.params.id],
    function (error, result) {
      if (error) {
        res.json({ message: error.message });
      }
      res.json({
        status: "200",
        message: "Response of put api",
        result: result,
      });
    },
  );
});

//Delete API
user.delete("/:id", (req, res) => {
  connection.execute(
    "delete from user_info where u_id=?",
    [req.params.id],
    function (error, result) {
      if (error) {
        res.json({ message: error.message });
      }
      res.json({
        status: "200",
        message: "Response of put api",
        result: result,
      });
    },
  );
});

// Login API
// user.post("/login", (req, res) => {
//   connection.execute(
//     "select * from user_info where u_email=? and u_password=?",
//     [req.body.Email, req.body.Password],
//     function (error, result) {
//       if (error) {
//         res.json({ message: error.message });
//       }
//       // if (result.length > 0) {
//         res.json({
//           status: "200",
//           message: "Response of post api",
//           result: result,
//         });
//       // }
//     }
//   );
// });

//Login API Compare raw password with hashed password
user.post("/login", (req, res) => {
  connection.execute(
    "select * from user_info where u_email=? ",
    [req.body.Email],
    function (error, result) {
      if (error) {
        return res.status(500).json({ message: error.message });
      }

      if (result.length === 0) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      const user = result[0];

      // Use your comparePassword helper
      const isMatch = comparePassword(req.body.Password, user.u_password);

      if (isMatch) {
        // Send login email
        const subject = "Login Notification";
        const htmlBody = `
          <p>Hi ${user.u_first_name},</p>
          <p>You have successfully logged in to your account.</p>
          <p>If this wasn't you, please reset your password immediately.</p>
          <br/>
          <p>Regards,<br/>Your Advisor</p>
        `;

        sendEmail(user.u_email, subject, htmlBody);
        // Save username in session
        req.session.user = { email: user.u_email };

        res.status(200).json({
          status: "200",
          message: "Login successful",
          result: user,
          // email:req.session.user
        });
      } else {
        res.status(401).json({ message: "Invalid email or password" });
      }
    },
  );
});

user.post("/verify-recaptcha", async (req, res) => {
  const token = req.body.token;
  if (!token) {
    return res
      .status(400)
      .json({ success: false, message: "No token provided" });
  }
  console.log("Token:", token);
  const secret = process.env.RECAPTCHA_SECRET;
  const verifyURL = "https://www.google.com/recaptcha/api/siteverify";
  const params = new URLSearchParams({ secret, response: token });

  try {
    const googleRes = await fetch(verifyURL, { method: "POST", body: params });
    const data = await googleRes.json();

    console.log("Google status:", googleRes.status);
    console.log("Google response:", data);
    res.json(data);
  } catch (err) {
    console.error("Error verifying reCAPTCHA:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

export default user;
