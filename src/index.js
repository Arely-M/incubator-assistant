import app from "./app";
import "./database";

app.listen(app.get("port"), () => {
  console.log("Serve on http://localhost:" + app.get("port"));
});
