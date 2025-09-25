require('dotenv').config()
const express = require('express')
const bodyParser = require("body-parser");
const fileUpload = require('express-fileupload');
var cors = require('cors')

const db = require("./models/");

const app = express()
const port = 3000

//Para habilitar las carpetas públicas
app.use(express.static('public'));

app.use(cors({
    // eslint-disable-next-line no-undef
    origin: [process.env.FRONTEND_BASE_URL],
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Configuración de carga de archivos
app.use(fileUpload({
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
}));
// Para habilitar la BD
db.sequelize.sync({
    // force: true // drop tables and recreate
}).then(() => {
    console.log("db resync");
});

require("./routes")(app);


app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})
