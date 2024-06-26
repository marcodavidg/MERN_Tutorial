const fs = require("fs");
const path = require("path");

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const placesRoutes = require("./routes/places-routes");
const usersRoutes = require("./routes/users-routes");
const HttpError = require("./models/http-error");

const app = express();

const errorMiddleware = (err, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        });
    }
    // You can also handle the error here, for example:
    res.status(500).json({ message: "Something went wrong" });
    next(err);
};

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

    next();
});

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);

app.use((req, res, next) => {
    const error = new HttpError("Could not find this route.", 404);
    throw error;
});
app.use(errorMiddleware);

mongoose
    .connect(
        `mongodb+srv://...mongodb.net/MERN?retryWrites=true&w=majority&appName=Cluster0`
    )
    .then(() => {
        console.log("EXITO MONGO");
        app.listen(5000);
    })
    .catch((err) => {
        console.log("ERROR MONGO");
        console.log(err);
    });
