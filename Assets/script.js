const cityEl = $('#cities');
const weatherEl = $('#weather');
const cityEntryEl = $('#cityBox');
const enterButton = document.querySelector('#enterButton');

const myKey = 'df6aab2683a83bd5874180733d8604ed';

enterButton.addEventListener('click', function(){
    const newCity = cityEntryEl.val(); //get the city from the entry box
    
    //local memory
    if (localStorage.getItem("cityList")){ //if the memory exists, add the entry to the list
        const cityList = JSON.parse(localStorage.getItem("cityList"));
        if(!cityList.includes(newCity)){ //check for a duplicate
            cityList.push(newCity);
            localStorage.setItem('cityList', JSON.stringify(cityList));
        }
    }
    else{
        localStorage.setItem('cityList', JSON.stringify([newCity])); //an array with 1 entry
    }

    //add the city immidietly to the html
    const cityCard = 
    `<div class="city">
        <h4>${newCity}</h4>
    </div>`
    cityEl.append(cityCard);

    //use the entry to fetch the lat and long
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${newCity}&appid=${myKey}`;
    // fetch(geoUrl)
    //     .then(function (response){
    //         // console.log(response);
    //         // const cityInfo = response.json();
    //         // console.log(cityInfo);
    //         // console.log(cityInfo.lat);
    //         return response.json();
    //     })
    //     .then(function (data) {
    //         //data is being returned in an array of 1
    //         const lat = data[0].lat;
    //         const lon = data[0].lon;
    //         //use lat and lon to query the weather api
    //         weatherUrl = `api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myKey}`;
    //         const weather = getWeather(weatherUrl);
    //         console.log(weather);
    //     })
    // Promise.all([pos = getLatLon(geoUrl)]).then(console.log(pos))
    // .then();
    
    // const weatherUrl = `api.openweathermap.org/data/2.5/forecast?lat=${pos[0]}&lon=${pos[1]}&appid=${myKey}`;
    const pos = getLatLon(geoUrl);
    
    // const weather = getWeather(`https://api.openweathermap.org/data/2.5/forecast?lat=39.7392364&lon=-104.984862&appid=df6aab2683a83bd5874180733d8604ed`);
    // console.log(weather);
    // console.log(weather);

    

})

async function getWeather(term){ //funciton to turn a lat lon url into weather
    let url = await term;
    fetch(url)
        .then(function (response){
            return response.json();
        })
        .then(function (data){
            console.log(data);
        })
}

function getLatLon(url){
    fetch(url)
        .then(function (response){
            // console.log(response);
            // const cityInfo = response.json();
            // console.log(cityInfo);
            // console.log(cityInfo.lat);
            return response.json();
        })
        .then(function (data) {
            //data is being returned in an array of 1
            const lat = data[0].lat;
            const lon = data[0].lon;
            // const weather = getWeather(`api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myKey}`);
            // console.log(weather);
            console.log([lat,lon]);
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myKey}`)
                .then(function(response){
                    return response.json();
                })
                .then(function (data){
                    console.log(data);
                    return data;
        })
            // return `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myKey}`;
})
}









function init(){ //the set up function
    if (localStorage.getItem("cityList")){ //if there are entries to load
        const cityList = JSON.parse(localStorage.getItem("cityList"));
        for (city of cityList){ //this adds the old cities to the html
            const cityCard = `<div class="city">
                <h4>${city}</h4>
            </div>`
            cityEl.append(cityCard);
        }
    }
}

init();