const express = require('express');
const app = express();

const port = process.env.PORT || 4000;
app.use(express.static("public"))

app.listen(port,()=>{
    console.log("it's running");
    console.log(port);
});