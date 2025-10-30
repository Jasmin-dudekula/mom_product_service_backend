const App=require('./src/App');
const DBConnect=require('./src/utils/DBConnect')
require("dotenv").config()

DBConnect()
const app = new App()
app.listen(process.env.PORT||3001)