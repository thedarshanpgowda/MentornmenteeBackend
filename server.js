require("dotenv").config();

const app = require("./mentoringPortal");
const port = process.env.PORT || 3000;
const mongoose = require("mongoose");

// Connect to database
try {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log(`Success: Connected to MongoDB Database`);
    })
    .catch((err) => {
      console.log(
        `Error in server.js\n Unable to connect to database\n ${err}`
      );
    });
} catch (err) {
  console.log(`Error in server.js\n Unable to connect to database\n ${err}`);
}

// Start the server
app.listen(port, () => {
  console.log(`Success: NodeJs server started on PORT:${port}`);
});

// Terminate the server during uncaught exception
app.use((req, res, next) => {
  var domain = require("domain").create();

  domain.on("error", (err) => {
    console.log(`Error in server.js \n Domain error caught \n ${err.stack}`);

    try {
      setTimeout(() => {
        console.error("Failsafe shutdown");
        process.exit(1);
      }, 5000);

      var worker = require("cluster").worker;

      if (worker) {
        worker.disconnect();
      }

      server.close();

      try {
        next(err);
      } catch (err) {
        console.error("Express error mechanism failed \n", err.stack);
        res
          .status(500)
          .setHeader("content-type", "text/plain")
          .end("Server error");
      }
    } catch (err) {
      console.error("Unable to send 500 response.\n", err.stack);
    }
  });

  domain.add(req);
  domain.add(res);
  domain.run(next);
});
