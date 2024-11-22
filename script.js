const wrapper = document.querySelector(".wrapper"),
  inputPart = document.querySelector(".input-part"),
  infoTxt = inputPart.querySelector(".info-txt"),
  inputField = inputPart.querySelector(".searchbox"),
  fetchCityBtn = inputPart.querySelector(".fetch-city-btn"),
  locationTrackBtn = inputPart.querySelector(".location-btn"),
  weatherPart = wrapper.querySelector(".weather-part"),
  wIcon = weatherPart.querySelector("img"),
  arrowBack = wrapper.querySelector("header i");

let api;

// Function to request weather data by city name
function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=63c40b45733a085b9176491807ac9e0e`;
  fetchData();
}

// Function to fetch weather details using the current location
function onSuccess(position) {
  const { latitude, longitude } = position.coords;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=63c40b45733a085b9176491807ac9e0e`;
  fetchData();
}

// Function to handle errors during geolocation
function onError(error) {
  infoTxt.innerText = error.message;
  infoTxt.classList.add("error");
}

// Fetch data from the API
function fetchData() {
  infoTxt.innerText = "Getting weather details..";
  infoTxt.classList.add("pending");
  fetch(api)
    .then((res) => res.json())
    .then((result) => weatherDetails(result))
    .catch(() => {
      infoTxt.innerText = "Something went wrong";
      infoTxt.classList.replace("pending", "error");
    });
}

// Display weather details
function weatherDetails(info) {
  if (info.cod === "404") {
    infoTxt.classList.replace("pending", "error");
    infoTxt.innerText = `${inputField.value} isn't a valid city name`;
  } else {
    const city = info.name;
    const country = info.sys.country;
    const { description, id } = info.weather[0];
    const { temp, feels_like, humidity } = info.main;

    // Update the weather icon based on the weather condition
    if (id === 800) {
      wIcon.src = "icons/clear.svg";
    } else if (id >= 200 && id <= 232) {
      wIcon.src = "icons/storm.svg";
    } else if (id >= 600 && id <= 622) {
      wIcon.src = "icons/snow.svg";
    } else if (id >= 701 && id <= 781) {
      wIcon.src = "icons/haze.svg";
    } else if (id >= 801 && id <= 804) {
      wIcon.src = "icons/cloud.svg";
    } else if ((id >= 500 && id <= 531) || (id >= 300 && id <= 321)) {
      wIcon.src = "icons/rain.svg";
    }

    // Update weather information
    weatherPart.querySelector(".temp .numb").innerText = Math.floor(temp);
    weatherPart.querySelector(".weather").innerText = description;
    weatherPart.querySelector(".location span").innerText = `${city}, ${country}`;
    weatherPart.querySelector(".temp .numb-2").innerText = Math.floor(feels_like);
    weatherPart.querySelector(".humidity span").innerText = `${humidity}%`;

    // Reset input and update UI
    infoTxt.classList.remove("pending", "error");
    infoTxt.innerText = "";
    inputField.value = "";
    wrapper.classList.add("active");
  }
}

// Event Listeners
fetchCityBtn.addEventListener("click", () => {
  if (inputField.value !== "") {
    requestApi(inputField.value);
  } else {
    alert("Please enter a city name!");
  }
});

locationTrackBtn.addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onSuccess, onError);
  } else {
    alert("Your browser doesn't support the geolocation API");
  }
});

arrowBack.addEventListener("click", () => {
  wrapper.classList.remove("active");
});
