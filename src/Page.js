import React, { useState } from 'react';
import Form from "./Forms";

const initialState = { city: "", date: "", time: "", forecast: [], error: false }

const Page = () => {
    const [serverData, setServerData] = useState(initialState);
    const [latitude, setLatitude] = useState("");
    const [longitude, setLongitude] = useState("");
    const [validate, setValidate] = useState({});

    //Validating form through a validator method
    const validateForm = () => {
        let isValid = true;
  
        let validator = Form.validator({
            latitude: {
                value: latitude,
                isRequired: true,
            },
            longitude: {
                value: longitude,
                isRequired: true,
            }
        });

        if (validator !== null) {
            setValidate({
            validate: validator.errors,
            });
  
            isValid = false;
        }
        return isValid;
    };

    // Call the api method and get the results
    async function getServerData() {
        const api = "https://api.weather.gov/points/"

        try {
            const response = await fetch(
                `${api}${latitude},${longitude}`
            ).then((res) => res.json());
    
            const forecast = await fetch(response.properties.forecast).then((res) =>
                res.json()
            );
        
            setServerData({...serverData,city: response.properties.relativeLocation.properties.city,
                date:new Date(forecast.properties.updated).toLocaleDateString(),
                time: new Date(forecast.properties.updated).toLocaleTimeString(),
                forecast: forecast.properties.periods})

            return {
                status: 200
            };
        } catch (error) {
            setServerData({city: "", date: "", time: "", forecast: [], error: true})
            return {
                status: error.status
            };
        }
    }

  // submit the form with right validation and api call
    const formSubmit = (e) => {
        e.preventDefault();

        const validate = validateForm();

        if (validate) {
            getServerData();
            setValidate({});
            setLatitude("");
            setLongitude("");
        }
    };

    return (
        <main className="container mx-auto max-w-5xl grid gap-16 p-8">
          <div className="grid gap-6 px-5">
            <h3 className="mt-3 text-lg">
                Please enter Latitude / Longitude to display the weather data at the input location
            </h3>
            <div className="col-12">
                <form>
                    <div className="w-full mb-3">
                        <label
                            className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                            htmlFor="grid-Longitude"
                        >
                            Latitude
                        </label>
                        <input
                        type="latitude"
                        className={`col-6 form-control border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${
                            validate.validate && validate.validate.latitude
                            ? "is-invalid "
                            : ""
                        }`}
                        id="latitude"
                        name="latitude"
                        value={latitude}
                        placeholder="Latitude"
                        onChange={(e) =>setLatitude(e.target.value)}
                        />
                        <div
                        className={`invalid-feedback text-start ${
                            validate.validate && validate.validate.latitude
                            ? "d-block"
                            : "d-none"
                        }`}
                        >
                        {validate.validate && validate.validate.latitude
                            ? validate.validate.latitude[0]
                            : ""}
                        </div>
                    </div>

                    <div className="relative  mb-3">
                        <label
                        className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                        htmlFor="grid-Longitude"
                        >
                        Longitude
                        </label>
                        <div>
                        <input
                        type="latitude"
                        className={`col-6 form-control border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150 ${
                            validate.validate && validate.validate.longitude
                            ? "is-invalid "
                            : ""
                        }`}
                        id="latitude"
                        name="latitude"
                        value={longitude}
                        placeholder="Longitude"
                        onChange={(e) =>setLongitude(e.target.value)}
                        />

                            <div
                                className={`invalid-feedback text-start ${
                                validate.validate && validate.validate.longitude
                                    ? "d-block"
                                    : "d-none"
                                }`}
                            >
                                {validate.validate && validate.validate.longitude
                                ? validate.validate.longitude[0]
                                : ""}
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-6">
                        <button
                        className="bg-success text-white active:bg-blueGray-600 text-md font-bold uppercase px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 col-6 ease-linear transition-all duration-150"
                        type="button"
                        onClick={formSubmit}
                        >
                        Search
                        </button>
                    </div>
                </form>
            </div>
            <h1 className="text-5xl font-black grid gap-1 text-center mt-2">
              <span className="text-danger">{serverData.city} </span>
              <span className="text-brand-primary">Weather Forecast</span>
            </h1>
            {serverData.city? 
            <div>
            <h2 className="text-lg">
              Last updated by the{' '}
              <a
                className="text-brand-default"
                href="https://www.weather.gov/documentation/services-web-api"
                rel="nopener"
                target="_blank"
                rel="noreferrer"
              >
                National Weather Service{' '}
              </a>
            </h2>
            <span className="font-black">{`on ${serverData.date} @${serverData.time}`}</span>
          </div>: serverData.error? <div className="alert alert-danger text-center">Not valid Latitude / Longitude</div>:""}
          </div>
          <div>
          <ul className="grid gap-8 md:grid-cols-2 mt-4" style={{listStyle:"none"}}>
            {serverData.forecast.slice(0, 2).map((item, index) => {
              const {
                name,
                isDaytime,
                startTime,
                shortForecast,
                temperature,
                temperatureUnit,
                windSpeed,
                windDirection
              } = item;
              return (
                <li
                  key={index}
                  className="flex flex-col p-6 bg-gray-50 text-lg shadow rounded-md"
                >
                  <div className="grid grid-cols-auto-1fr gap-2 mb-4 text-center">
                    <div className="text-5xl">
                      {isDaytime ? (
                        <span role="img" aria-label="Full Moon Face">
                          🌝
                        </span>
                      ) : (
                        <span role="img" aria-label="New Moon Face">
                          🌚
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-lg font-bold">{name}</div>
                      <div className="grid grid-cols-auto-1fr gap-1 text-sm text-gray-500">
                        <span role="img" aria-label="Spiral Calendar">
                          🗓️
                        </span>
                        {new Date(startTime).toDateString()}
                      </div>
                    </div>
                  </div>

                  <p className="text-2xl font-black flex-grow mb-4 text-center">
                    {shortForecast}
                  </p>
                  <div className="text-md text-gray-500 text-center">
                    <div>{`Temperature: ${temperature} ${temperatureUnit}`}</div>
                    <div>{`Wind: ${windSpeed} ${windDirection}`}</div>
                  </div>
                </li>
              );
            })}
          </ul>
          </div>
    </main>
  );
};

export default Page;

