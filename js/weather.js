var API_WORLDTIME_KEY = 'd6a4075ceb419113c64885d9086d5';
var API_WORLDTIME =	'http://api.worldweatheronline.com/free/v2/tz.ashx?format=json&key='+API_WORLDTIME_KEY + '&q=';
var API_WEATHER_ICON = 'http://openweathermap.org/img/w/';
var API_WEATHER_KEY = "b1e223d6c0066382a251261dafbf98e8";
var API_WEATHER_URL = "http://api.openweathermap.org/data/2.5/weather?APPID=" + API_WEATHER_KEY + "&";


var cityWeather = {};
cityWeather.zone;
cityWeather.icon;
cityWeather.temp;
cityWeather.c;
cityWeather.maxtemp;
cityWeather.mintemp;
cityWeather.main;
var newCity;
var timeHour;

//botones auxiliares
$('.reload').click(function(event) {
	event.preventDefault();
	location.reload();
});
$('.add__city').click(function(event) {
	event.preventDefault();
	$('.search_').val('');
	$('.search').slideDown(200);
	$('.ocultar').show();
	$('.card').css('-webkit-filter', 'blur(4px)');
	$('.card').css('-moz--filter', 'blur(4px)');
	$('.card').css('filter', 'blur(4px)');

});
$('.btn_close, .ocultar').click(function(event) {
	event.preventDefault();
	$('.search_').val('');
	$('.search').slideUp(200);
	$('.ocultar').hide();
	$('.card').css('-webkit-filter', '');
	$('.card').css('-moz--filter', '');
	$('.card').css('filter', '');

});

$('.btn_add').on('click', addNewCity);

//app inicio
$(document).on('ready', weather);

function weather()
{
	currentDate()

	var geo = navigator.geolocation;
	geo.getCurrentPosition(successLocation, errorLocation);
	
}

function errorLocation(err)
{
	alert('no es posible localizar: ' + err.code);
	$('.loader').hide();
}

function successLocation(position)
{
	var lat = position.coords.latitude;
	var lon = position.coords.longitude;
	$.getJSON(API_WEATHER_URL + 'lat=' + lat + '&lon=' + lon, getApiWeather) ;
}

function getApiWeather(data)
{
	cityWeather.zone = data.name +','+data.sys.country;
	cityWeather.icon = API_WEATHER_ICON + data.weather[0].icon + '.png';
	cityWeather.temp = (data.main.temp - 273.15).toFixed(0);
	cityWeather.maxtemp = (data.main.temp_max - 273.15 + 2).toFixed(0);
	cityWeather.mintemp = (data.main.temp_min - 273.15 - 2).toFixed(0);
	cityWeather.main  = data.main;
	
	renderTemplate();
}

function createTemplate(id)
{
  var t = document.querySelector(id);
  return document.importNode(t.content, true);
}

function renderTemplate(localtime, curretnPosition)
{
	var timeToShow;
	var geolocalizacion;
	//hora actual de localizacion
	if(localtime){timeToShow = localtime;}
	else{timeToShow = timeHour;}

	var clone = createTemplate('#template_city');
	//icono de geolocalizacion
	if(curretnPosition){}
	else{geolocalizacion = clone.querySelector('#geo');}

	clone.querySelector('[data-city]').innerHTML = cityWeather.zone;
	clone.querySelector('[data-icon]').src = cityWeather.icon;
	clone.querySelector('[data-temp="current"]').innerHTML = cityWeather.temp;
	clone.querySelector('[data-temp="max"]').innerHTML = 'Max Temp: ' + cityWeather.maxtemp + 'ºC';
	clone.querySelector('[data-temp="min"]').innerHTML = 'Min Temp: ' + cityWeather.mintemp + 'ºC';
	clone.querySelector('[data-time]').innerHTML = timeToShow;
	$(geolocalizacion).addClass('icon-location-pin');


	$('.loader').hide();
	$('body').append(clone);

}

function currentDate()
{
	var date = new Date();
	//hora
	var hour = date.toLocaleTimeString().split(' ')[0].split(':')[0];
	var minute = date.toLocaleTimeString().split(' ')[0].split(':')[1];
	var dayTime1 = date.toLocaleTimeString().split(' ')[1].split('.')[0];
	var dayTime2 = date.toLocaleTimeString().split(' ')[1].split('.')[1];
	var fullHour = hour+':'+minute+' '+dayTime1+dayTime2;
	//day
	var day = date.getDay()
	var today;
	var days = {};
	days.lun = 1;
	days.mar = 2;
	days.mie = 3;
	days.jue = 4;
	days.vie = 5;
	days.sab = 6;
	days.dom = 0;


	if(day === days.lun){
		today= 'Lun';
	}
	else if(day === days.mar){
		today= 'Mar';
	}
	else if(day === days.mie){
		today= 'Mie';
	}
	else if(day === days.jue){
		today= 'Jue';
	}
	else if(day === days.vie){
		today= 'Vie';
	}
	else if(day === days.sab){
		today= 'Sab';
	}
	else if(day === days.dom){
		today= 'Dom';
	}
	timeHour = today+ ' ' + fullHour;
}


function addNewCity(e)
{
	e.preventDefault();
	newCity = document.querySelector('.search_').value;
	$('.search_').val('');
	$('.search').slideUp(200);
	$('.ocultar').hide();
	$('.card').css('-webkit-filter', '');
	$('.card').css('-moz--filter', '');
	$('.card').css('filter', '');

	$.getJSON(API_WEATHER_URL + 'q=' + newCity, getApiNewCity);
}

function getApiNewCity(data)
{
	$.getJSON(API_WORLDTIME+newCity, function(res) {
			timeWorld = 'Hora: ' + res.data.time_zone[0].localtime.split(' ')[1];


	cityWeather.zone = data.name +','+data.sys.country;
	cityWeather.icon = API_WEATHER_ICON + data.weather[0].icon + '.png';
	cityWeather.temp = (data.main.temp - 273.15).toFixed(0);
	cityWeather.maxtemp = (data.main.temp_max - 273.15 + 2).toFixed(0);
	cityWeather.mintemp = (data.main.temp_min - 273.15 - 2).toFixed(0);
	cityWeather.main  = data.main;
	var curretnPosition = true;
	renderTemplate(timeWorld, curretnPosition);

	


	});
}



