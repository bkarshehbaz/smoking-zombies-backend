## How to install

1. clone the repo
2. run `npm install`
3. replace `.env.example` file with `.env`
4. run `npm run start `

### for docker

1. run `docker build --tag nodename/weather-service`
2. run `docker run -p 3001:3000 -d nodename/weather-service`
3. After the container is up, to check the weather API you need to first register as a user. http POST`http:// www.localhost.3001/api/auth/signup` with body e.g. 
{
    "username": "tom",
    "email": "test@email.com",
    "first_name": "jon",
    "last_name": "doe",
    "password": "123123" 
}
4. When signup is success, login with http POST`http://www.localhost.3001/api/auth/login` and capture the response access token with the body of:
{
    "email": "test@email.com",
    "password": "123123"
}

5. To get weather data, go to http GET`http://www.localhost.3001/api/weather/getAllWeatherData` with bearer token from login response

