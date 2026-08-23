const express = require("express");
const fs = require("fs");

const app = express();

/**
 * Parse incoming form data.
 *
 * The HTML form uses the application/x-www-form-urlencoded format.
 * This middleware parses the request body and makes the form fields
 * available through req.body.
 *
 * Example:
 * Form input:
 *   <input name="msg" value="Hello" />
 *
 * req.body:
 *   { msg: "Hello" }
 */
app.use(express.urlencoded({ extended: true }));

/**
 * Handle GET requests to the home page.
 *
 * Displays a simple HTML form where the user
 * can enter a message.
 */
app.get("/", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Message Form</title>
      </head>

      <body>
        <h1>Enter your message:</h1>

        <form action="/message" method="POST">
          <input type="text" name="msg" />
          <button type="submit">Submit</button>
        </form>
      </body>
    </html>
  `);
});

/**
 * Handle POST requests to /message.
 *
 * The form sends the user's message to this route.
 * express.urlencoded() has already parsed the request body,
 * so the message can be accessed through req.body.msg.
 */
app.post("/message", (req, res) => {
  // Extract the "msg" field from the parsed request body.
  const { msg } = req.body;

  // Save the message to message.txt.
  fs.writeFileSync("message.txt", msg);

  // Redirect the user back to the home page.
  res.redirect("/");
});

/**
 * Handle all requests that didn't match any route above.
 *
 * This middleware is reached only when Express
 * couldn't find a matching route.
 */
app.use((req, res) => {
  res.status(404).send("Page not found");
});

/**
 * Start the Express server on port 3000.
 *
 * The application can then be accessed at:
 * http://localhost:3000
 */
app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
