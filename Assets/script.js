const cityEl = $('#cities');
const weatherEl = $('#weather');
const cityEntryEl = $('#cityBox');
const enterButton = document.querySelector('#enterButton');
const weatherListEl = $('#weatherList');


const myKey = 'df6aab2683a83bd5874180733d8604ed';

async function enterFunction(){
    const newCity = cityEntryEl.val(); //get the city from the entry box
    
    //local memory
    if (localStorage.getItem("cityList")){ //if the memory exists, add the entry to the list
        const cityList = JSON.parse(localStorage.getItem("cityList"));
        if(!cityList.includes(newCity)){ //check for a duplicate
            cityList.push(newCity);
            localStorage.setItem('cityList', JSON.stringify(cityList));
            //add the city immidietly to the html
            const cityCard = 
            `<div class="city">
                <h4>${newCity}</h4>
            </div>`
            cityEl.append(cityCard);
        }
    }
    else{
        localStorage.setItem('cityList', JSON.stringify([newCity])); //an array with 1 entry
    }



    //use the entry to fetch the lat and long
    const geoUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${newCity}&appid=${myKey}`;

    getWeather(geoUrl);
    
}

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

function getWeather(url){
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
            console.log([lat,lon]);
            fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myKey}`)
                .then(function(response){
                    return response.json();
                })
                .then(function (data){
                    console.log(data);
                    console.log(`API adress : https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${myKey}`)

                    //data.list is the next 40 weather forecasts every 3 hours
                    //i want noon each day
                    //i should be able to do this by averaging the sunrise / sunset times, and finding the closest entry
                        //I should be between 2 entries, midpoint (based on 1 check) is a close to 1, so round down
                    let average = data.city.sunrise;
                    average += data.city.sunset;
                    average = average/2;
                    average = Math.floor(average); //remove any decimals
                    //I need to turn today's miday into tomorrows
                    average += 86400;
                    console.log(average);
                    //run through until I find an entry with a larger timestamp, then take the 1 before it
                    let index;
                    for (i in data.list){
                        // console.log(data.list[i].dt);
                        if((average < data.list[i].dt)&&!index){
                            console.log(data.list[i].dt);
                            index = i-1; //1 before
                        }
                    }
                    console.log(index);
                    //I want to give current temp, and noon temp for the next 4 days
                    //I then need to grab every 8th entry (24hrs) after that
                    const returnIndex = [0, index, index+8, index+16, index+24, index+32]
                    const returnWeather = [];
                    for(value of returnIndex){
                        returnWeather.push(data.list[value]); //send back the whole weather
                    }
                    // return returnWeather;
                    console.log(returnWeather);
                    //I can't quite seem to get the data out of this function, so I guess I'll do stuff here
                    weatherListEl.empty(); //clear out old data
                    //go through each entry of returnWeather and append a child to weatherListEl with data
                    // const cityCard = 
                    // `<div class="city">
                    //     <h4>${newCity}</h4>
                    // </div>`
                    // cityEl.append(cityCard);
                    //the temp is given in kelvin
                    function tempConverter(kelvin) {
                        return Math.floor(((kelvin-273.15) * 1.8) + 32);
                    }
                    for (day of returnWeather){
                        const weatherCard = //I want remp_min temp_max temp from main, weather.description
                            `<div class weatherCard>
                                <h4> Temperature : ${tempConverter(day.main.temp)} </h4>
                                <h4> High : ${tempConverter(day.main.temp_max)} </h4>
                                <h4> Low : ${tempConverter(day.main.temp_min)} </h4>
                                <h4> Weather : ${day.weather.description} </h4>
                            </div>`
                        weatherListEl.append(weatherCard);
                    }
                    
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


enterButton.addEventListener('click', enterFunction)


init();