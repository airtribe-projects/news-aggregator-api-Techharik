import app from "./app.js";
import connectDB from "./db/dbconfig.js";

const port = process.env.PORT || 3000;

//after connecting the Db the port starts;
// connectDB().then(() => {
app.listen(port, (err) => {
    if (err) {
        return console.log('Something bad happened', err);
    }
    console.log(`Server is listening on ${port}`);
});
// })