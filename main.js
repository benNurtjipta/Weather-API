const form = document.querySelector("form");
const weatherApiKey = "xxx"
const results = document.querySelector("#weatherResults");
const myLocBtn = document.querySelector("#location");

function getWindDirection(degrees) {
  if (degrees >= 337.5 || degrees < 22.5) {
    return "↑ N";
  } else if (degrees >= 22.5 && degrees < 67.5) {
    return "↗ NE";
  } else if (degrees >= 67.5 && degrees < 112.5) {
    return "→ E";
  } else if (degrees >= 112.5 && degrees < 157.5) {
    return "↘ SE";
  } else if (degrees >= 157.5 && degrees < 202.5) {
    return "↓ S";
  } else if (degrees >= 202.5 && degrees < 247.5) {
    return "↙ SW";
  } else if (degrees >= 247.5 && degrees < 292.5) {
    return "← W"; // West
  } else if (degrees >= 292.5 && degrees < 337.5) {
    return "↖ NW";
  }
}

function isItCloudy(cloudinessPercent) {
  if (cloudinessPercent >= 0 && cloudinessPercent <= 10) {
    return "Clear";
  } else if (cloudinessPercent > 10 && cloudinessPercent <= 25) {
    return "Mostly clear";
  } else if (cloudinessPercent > 25 && cloudinessPercent <= 50) {
    return "Partly cloudy";
  } else if (cloudinessPercent > 50 && cloudinessPercent <= 75) {
    return "Mostly cloudy";
  } else if (cloudinessPercent > 75 && cloudinessPercent <= 100) {
    return "Overcast";
  }
}

function setBackgroundImage(cloudinessPercent, weatherCard) {
  if (cloudinessPercent <= 10) {
    weatherCard.style.backgroundImage = "url('./images/clear-sky.jpg')";
  } else if (cloudinessPercent <= 50) {
    weatherCard.style.backgroundImage = "url('./images/partly-cloudy.jpg')";
  } else if (cloudinessPercent <= 75) {
    weatherCard.style.backgroundImage = "url('./images/mostly-cloudy.jpg')";
  } else {
    weatherCard.style.backgroundImage = "url('./images/overcast.jpg')";
  }
}

function createCard(data) {
  const weatherData = {
    location: data.name,
    currentTemp: Math.round(data.main.temp) + "°",
    windSpeed: Math.round(data.wind.speed) + " km/h",
    windDirection: getWindDirection(data.wind.deg),
    clouds: isItCloudy(data.clouds.all),
  };
  const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

  const weatherCard = document.createElement("div");
  weatherCard.classList.add(`${data.name}`);
  weatherCard.innerHTML = `
  <button class="close-btn" onclick="this.parentElement.remove()"><i class="fa-solid fa-trash fa-2xs"></i></button>
    <div class="icon">
      <img src="${icon}" alt="Weather Icon">
      <p><strong>${weatherData.location}</strong></p>
    </div>
    <div class="wData">
      <div><p>${weatherData.currentTemp}</p></div>
      <div><p>${weatherData.clouds}</p></div>
      <div><p>${weatherData.windSpeed}</p></div>
      <div><p>${weatherData.windDirection}</p></div>
    </div>
  `;
  weatherCard.classList.add("singeCard");
  setBackgroundImage(data.clouds.all, weatherCard);
  results.appendChild(weatherCard);
}

async function fetchData(e) {
  if (e.target.elements[`cityInput`].value === "") {
    return;
  }
  try {
    e.preventDefault();
    const location = e.target.elements[`cityInput`].value;
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${weatherApiKey}&units=metric`
    );
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const data = await response.json();
    createCard(data);
  } catch (error) {
    console.error(error);
  }
  form.reset();
}

form.addEventListener("submit", fetchData);

myLocBtn.addEventListener("click", async (e) => {
  let lat;
  let lon;
  try {
    const position = await new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });

    lat = position.coords.latitude;
    lon = position.coords.longitude;

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric`
    );
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
    const data = await response.json();
    createCard(data);
  } catch (error) {
    console.error(error);
  }
});
