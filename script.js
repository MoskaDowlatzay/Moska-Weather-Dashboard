$('#search-button').on('click', function (e) {
    e.preventDefault()
const searchInput = $('#search-input').val().trim();
//This is my API key
const APIKey = 'a934527504a2622fcdf737712d565356';
const queryURL = `http://api.openweathermap.org/geo/1.0/direct?q=${searchInput}&appid=${APIKey}`;

//Fetch call
  fetch(queryURL)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
  
      const newQueryUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${data[0].lat}&lon=${data[0].lon}&units=metric&appid=${APIKey}`

      fetch(newQueryUrl)
      .then(function (response) {
        return response.json()
      })
      .then(function (data) {
        console.log(data)
      })
    });
});