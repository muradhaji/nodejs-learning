const http = require("http");
const fs = require("fs");

/**
 * Create an HTTP server.
 *
 * The callback receives:
 * - req: information about the incoming request
 * - res: used to send a response back to the client
 */
const server = http.createServer((req, res) => {
  /**
   * Handle GET requests to the home page.
   *
   * Displays a simple HTML form where the user
   * can enter a message.
   */
  if (req.url === "/" && req.method === "GET") {
    // Tell the browser that the response contains HTML
    res.setHeader("Content-Type", "text/html");

    // Send the HTML response
    res.end(`
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

    // Stop executing the rest of the request handler
    return;
  }

  /**
   * Handle POST requests to /message.
   *
   * The form sends the user's message here.
   */
  if (req.url === "/message" && req.method === "POST") {
    // Request data can arrive in multiple chunks,
    // so we collect all chunks in an array.
    const body = [];

    /**
     * The "data" event is triggered whenever a new
     * chunk of request data is received.
     */
    req.on("data", (chunk) => {
      body.push(chunk);
    });

    /**
     * The "end" event is triggered when all request
     * data has been received.
     */
    req.on("end", () => {
      // Combine all chunks into one Buffer
      // and convert it to a string.
      const parsedBody = Buffer.concat(body).toString();

      // Extract the message from the form data.
      // Example:
      // "msg=Hello" -> "Hello"
      const message = parsedBody.split("=")[1];

      // Save the message to message.txt
      fs.writeFileSync("message.txt", message);
    });

    /**
     * Redirect the user back to the home page
     * after submitting the form.
     *
     * 302 = temporary redirect
     */
    res.statusCode = 302;
    res.setHeader("Location", "/");

    res.end();

    return;
  }

  /**
   * If none of the routes above match,
   * return a 404 Not Found response.
   */
  res.statusCode = 404;
  res.end("Page not found");
});

/**
 * Start the server on port 3000.
 *
 * The application can then be accessed at:
 * http://localhost:3000
 */
server.listen(3000);
