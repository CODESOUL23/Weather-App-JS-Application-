const userTab=document.querySelector("[data-userWeather]");
const searchTab=document.querySelector("[data-searchWeather]");

const userContainer=document.querySelector(".weather-container");
const grantAccessContainer=document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-searchForm]")
const loadingScreen=document.querySelector(".loading-container");
const userInfoContainer=document.querySelector(".user-info-container");

let currentTab=userTab;//By Default
let API_KEY="d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab");

getfromSessionStorage();

// Active class tab lagayi jaati hai jab hume kisi cheez ko visble ya invisible karna hota hai...


function switchTab(clickedTab) {
    if((clickedTab) != (currentTab))
    {
        console.log("In tab Changing");
        currentTab.classList.remove("current-tab");
        currentTab=clickedTab;
        currentTab.classList.add("current-tab");

        if(!(searchForm.classList.contains("active")))
        //Kya search tab is invisible?? Then make it visible
        {
            userInfoContainer.classList.remove("active");
            grantAccessContainer.classList.remove("active");
            searchForm.classList.add("active");
        }
        else{
            //Pehle mei search wale tab pr the ab mujhe your weather vala tab visible karna hai.
            searchForm.classList.remove("active");
            userInfoContainer.classList.remove("active");
            //ab main your weather tab me aagya hu, toh weather bhi display karna padega, so let's check local storage first
            //for coordinates, if we haved saved them there.
            getfromSessionStorage();
        }
    }

}

userTab.addEventListener('click' , ()=>{
    //Pass clicked tab as input parameter
    console.log("userTab clicked");
    switchTab(userTab);
})

searchTab.addEventListener('click' , ()=>{
    //Pass clicked tab as input parameter
    console.log("searchTab clicked");
    switchTab(searchTab);
})

function getfromSessionStorage(){
    // user coordinates naam se save agar kiya hoga storage mei toh access ho jayega.
    const localCoordinates = sessionStorage.getItem("user-coordinates");
    if(!localCoordinates) {
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates);
        // Converts string -> Object
        //JSON Format mei convert kar diya humne.
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates) {
    const {lat, lon} = coordinates;
    //make grant access container invisible
    grantAccessContainer.classList.remove("active");
    //Make Loader Visible
    loadingScreen.classList.add("active");

    //API CALL
    try{
        const res= await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`)
        const data=await res.json();
        // Coverts promise -> Object
        loadingScreen.classList.remove("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch (err){
        loadingScreen.classList.remove("active");
    }
}
function renderWeatherInfo(weatherInfo){
    //Firstly , We have to fetch the element
    const cityName=document.querySelector("[data-cityName]");
    const countryIcon=document.querySelector("[data-countryIcon]");
    const desc=document.querySelector("[data-weatherDesc]");
    const weatherIcon=document.querySelector("[data-weatherIcon]");
    const temp=document.querySelector("[data-temp]");
    const windspeed=document.querySelector("[data-windspeed]");
    const humidity=document.querySelector("[data-humidity]");
    const cloudiness=document.querySelector("[data-cloudiness]");

    //Fetch data from weatherInfo and display on UI
    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    desc.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temp.innerText = `${weatherInfo?.main?.temp} °C`;
    windspeed.innerText = `${weatherInfo?.wind?.speed}%`;
    humidity.innerText = `${weatherInfo?.main?.humidity}%`;
    cloudiness.innerText = `${weatherInfo?.clouds?.all}%`;
}
function getLocation(){
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    }
    else{
        //HW-show an alert for no support available
    }
}
function showPosition(position){

    const userCoordinates = {
        lat:position.coords.latitude,
        lon:position.coords.longitude
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}
const grantAccessButton= document.querySelector("[data-grantAccess]");
grantAccessButton.addEventListener("click" , getLocation);

const searchInput=document.querySelector("[data-searchInput]");
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName==="")
        return;
    else{
        fetchSearchWeatherInfo(cityName);
    }
})

async function fetchSearchWeatherInfo(city)
{
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");

    try{
        const response=
            await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
            const data = await response.json();
            loadingScreen.classList.remove("active");
            userInfoContainer.classList.add("active");
            renderWeatherInfo(data);
    }
    catch(err)
    {
        // loadingScreen.classList.remove("active");
        //HW
    }
}