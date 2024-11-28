import https from 'https';

const appId = process.env.APP_ID;
export const handler = async (event) => {
    // Get 'location' from query parameters
    const location = event.queryStringParameters?.location; 

    if (!location) {
        return {
            statusCode: 400,
            body: JSON.stringify({ message: "Location query parameter is required" }),
        };
    }

    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${appId}`;

    return new Promise((resolve) => {
        https.get(weatherApiUrl, (response) => {
            let data = '';

            response.on('data', (chunk) => {
                data += chunk;
            });

            response.on('end', () => {
                const weatherData = JSON.parse(data);

                resolve({
                    statusCode: 200,
                    body: JSON.stringify({
                        location: weatherData.name,
                        temperature: (weatherData.main.temp - 273.15).toFixed(2), // Kelvin to Celsius
                        weather: weatherData.weather[0].description,
                    }),
                });
            });
        });
    });
};
