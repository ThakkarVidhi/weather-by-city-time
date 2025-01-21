const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;
require("dotenv").config();

// Middlewares
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Routes
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
});

app.post("/weather", async (req, res) => {
    const cityName = req.body.cityName;

    if (!cityName) {
        return res.status(400).json({ 
            success: false, 
            error: "City name is required" 
        });
    }

    try {
        const apiKey = process.env.OPENWEATHER_API_KEY.trim();
        const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;
        const response = await axios.get(apiUrl);
        console.log(response.data)
        console.log(response.status)

        // Return success response
        res.status(200).json({
            success: true,
            data: response.data,
        });
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        
        if (error.response && error.response.status === 404) {
            // Handle city not found error
            return res.status(404).json({
                success: false,
                error: "City not found. Please check the city name and try again.",
            });
        }

        if (error.response && error.response.status === 401) {
            // Handle invalid API key
            return res.status(401).json({
                success: false,
                error: "Invalid API key. Please check your API configuration.",
            });
        }

        // Handle other unexpected errors
        res.status(500).json({
            success: false,
            error: "An unexpected error occurred. Please try again later.",
        });
    }
});

app.listen(port, () => {
    console.log(`Weather app is running on http://localhost:${port}`);
});
