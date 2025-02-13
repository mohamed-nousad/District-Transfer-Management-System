const app = require("./app");

const PORT = process.env.PORT;
const NODE_ENV = process.env.NODE_ENV;

app.listen(PORT, () => {
  console.log(`🚀 Server running at https://localhost:${PORT} in ${NODE_ENV}`);
});
