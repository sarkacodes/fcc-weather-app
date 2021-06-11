const contentEl = document.querySelector(".content");
const infoTemperatureEl = document.getElementById("info-temperature");
const btnEl = document.getElementById("btn");

document.addEventListener("DOMContentLoaded", function () {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            let lat = position.coords.latitude;
            let lon = position.coords.longitude;
            getInfo(lat, lon);
        });
    }

    /* To make repeated adding/removing class work, I used the void-offsetWidth "hack" solution from this article: https://css-tricks.com/restart-css-animation/. */
    btnEl.addEventListener("click", function () {
        infoTemperatureEl.classList.remove("fade-out", "fade-in");
        infoTemperatureEl.classList.toggle("fade-out");
        changeDegree();
        infoTemperatureEl.classList.toggle("fade-out");
        void infoTemperatureEl.offsetWidth;
        infoTemperatureEl.classList.toggle("fade-in");
    });
});

function getInfo(latitude, longitude) {
    fetch("https://fcc-weather-api.glitch.me/api/current?lat=" + latitude + "&lon=" + longitude)
        .then((response) => response.json())
        .then((data) => {
            document.getElementById("info-city").innerHTML = data.name + ", " + data.sys.country;
            document.getElementById("info-icon").innerHTML = "<img src='" + data.weather[0].icon + "'>";
            infoTemperatureEl.innerHTML = Math.round(data.main.temp) + "°C";
            document.getElementById("info-weather").innerHTML = data.weather[0].main;
            document.getElementById("info-weatherdetail").innerHTML = data.weather[0].description;
            document.getElementById("info-sunrise").innerHTML = convertTime(data.sys.sunrise);
            document.getElementById("info-sunset").innerHTML = convertTime(data.sys.sunset);
            document.getElementById("info-wind-speed").innerHTML = data.wind.speed + " m/s";
            document.getElementById("info-wind-dir").innerHTML = Math.round(data.wind.deg) + "°";
            document.getElementById("info-pressure").innerHTML = data.main.pressure;
            document.getElementById("info-humidity").innerHTML = data.main.humidity + "%";
            contentEl.classList.add("animation", "fade-in");
            contentEl.style.visibility = "visible";
        });
}

function convertTime(time) {
    let date = new Date(time * 1000);
    let hours = date.getHours();
    let minutes = "0" + date.getMinutes();
    return hours + ":" + minutes.substr(-2);
}

function changeDegree() {
    let temperature = infoTemperatureEl.innerHTML;
    if (temperature.slice(-1) === "C") {
        let number = Number(temperature.slice(0, -2));
        let fahrenheit = number * (9 / 5) + 32;
        infoTemperatureEl.innerHTML = Math.round(fahrenheit) + "°F";
        btnEl.innerHTML = "Switch to Celsius";
    } else {
        let number = Number(temperature.slice(0, -2));
        let celsius = (number - 32) * (5 / 9);
        infoTemperatureEl.innerHTML = Math.round(celsius) + "°C";
        btnEl.innerHTML = "Switch to Fahrenheit";
    }

}
