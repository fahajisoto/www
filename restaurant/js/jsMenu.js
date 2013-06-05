var nbelt, i;
var html="";
var jsonResto;
var lat;
var lon;		
var mapOptions;
var directionDisplay;
var directionsService;
var requeteItineraire;
var directionDisplay;
var directionsService = new google.maps.DirectionsService();
var map;
var address ;
var end;
var counter=0;
function init_itineraire(lat,lan){
	end = new google.maps.LatLng(lat,lan);
	getLocation();

}

function getLocation() 
{
	//alert("Loading, please wait...");
	$("#mapholder").css({ opacity: 0, zoom: 0 });
	if (navigator.geolocation)
		{
			navigator.geolocation.getCurrentPosition(showPosition,showError);
		}
	else{x.innerHTML="Geolocation is not supported by this browser.";}

}

function showPosition(position)
{
	address = new google.maps.LatLng(position.coords.latitude,position.coords.longitude);		
	//alert("address="+address+",end="+end);
	initialize();
	$('#mapholder').show();
	$("#mapholder").css({ opacity: 1, zoom: 1 });
}

function showError(error)
{
	switch(error.code) 
	{
		case error.PERMISSION_DENIED:
		x.innerHTML="User denied the request for Geolocation."
		break;
		case error.POSITION_UNAVAILABLE:
		x.innerHTML="Location information is unavailable."
		break;
		case error.TIMEOUT:
		x.innerHTML="The request to get user location timed out."
		break;
		case error.UNKNOWN_ERROR:
		x.innerHTML="An unknown error occurred."
		break;
	}

}

function initialize() 
{
     directionsDisplay = new google.maps.DirectionsRenderer();

     var optionsCarte = {
          zoom: 7,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          center: address,
				mapTypeControlOptions: 
				{
				  style: google.maps.MapTypeControlStyle.DROPDOWN_MENU,
				  position: google.maps.ControlPosition.TOP_LEFT
				}
     }
     map = new google.maps.Map(document.getElementById("mapholder"), optionsCarte);
     directionsDisplay.setMap(map);
     directionsDisplay.setPanel(document.getElementById("EmplacementItineraireTexte"));
     var requeteItineraire = {
          origin: address,
          destination: end,
          region: "fr",
			travelMode: google.maps.DirectionsTravelMode.DRIVING
     };
     directionsService.route(requeteItineraire, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
               directionsDisplay.setDirections(response);
          }
     });
		$('#listeAlpha').hide();
		$("#listebeta").show();
		$("#btnBack").show();
	   
}
function calcRoute() {
		  var selectedMode = document.getElementById("mode").value;
		  var requeteItineraire = {
			  origin: address,
			  destination: end,
			  region: "fr",
			  travelMode: google.maps.TravelMode[selectedMode]
					};
			directionsService.route(requeteItineraire, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
               directionsDisplay.setDirections(response);
          }
			});
			
	}


function selectchoice() {
		  var affichageMode = document.getElementById("mode_affichage").value;
		 //alert(affichageMode);
		  switch(affichageMode){
			case 'tous':{
				$('#listeAlpha').hide();
				$('#listebeta').hide();
				$('#itineraire').hide();
				$('#crous').hide();
				$('#EmplacementItineraireTexte').hide();
				$("#btnBack").show();
				$('#mode_affichage').hide();
				break;
			}
			case 'un':{
				$('#listeAlpha').show();
				break;
			}
	  }
			
	}


function btnhide(){
	$("#btnBack").hide();
	$("#mode").hide();
	$("#Loading").hide();
}
//fonction qui met en place la liste des resto
function makeList(json) {
	html="";
	jsonResto = jQuery.isPlainObject(json) ? json: jQuery.parseJSON(json);
	if(jsonResto.code_retour == "ok") {
		nbelt=jsonResto.count;
		if( nbelt > 0 ) {		
			for(i=0; i<nbelt;i++){
				html +="<li class=\"ui-btn ui-btn-up-a ui-btn-icon-right ui-li-has-arrow ui-li ui-first-child\" data-corners=\"false\" data-shadow=\"false\" " +
						"data-iconshadow=\"true\" onclick=\"menu("+i+");init_itineraire("+jsonResto[i].latitude+","+jsonResto[i].longitude+")\" " +"data-wrapperels=\"div\" data-icon=\"arrow-r\" data-iconpos=\"right\">" +
						"<div class=\"ui-btn-inner ui-li\"><div class=\"ui-btn-text\"><a class=\"ui-link-inherit\" data-transition=\"slide\">"
						+ jsonResto[i].nom +","+jsonResto[i].latitude+","+jsonResto[i].longitude+"</a></div><span class=\"ui-icon ui-icon-arrow-r ui-icon-shadow\"> </span></div></li>";
			counter++;
			}
			
			$('#listeAlpha').html(html);
		}
		else {
			html+="<li><p>Pas de service</p></li>";
		}
	}
	else {
		html+="<li><p>Service temporairement indisponible</p></li>";
	}

}

// init la liste des resto par ordre alpha
function initMenuAlpha() {
	$('#itineraire').hide;
	$('#mapholder').hide;
	$('#EmplacementItineraireTexte').hide;
	//recuperation du tableau des resto
	$.ajax({
		url:"http://udamobile.u-clermont1.fr/v2/restaurant/",
		type: "GET",
		success: function(feedback) {
			//var jsonResto = $.parseJSON(feedback);
			makeList(feedback);
		},
	});
}

function menu(iter) {
	//recuperation du tableau des resto
	$.ajax({
		url:"http://udamobile.u-clermont1.fr/v2/restaurant/?menu="+iter,
		type: "GET",
		success: function(feedback) {
			makemenu(feedback);		
		},
	});
}

function makemenu(json){
	
	if(json!=""){
	html="";
	var jsonMenu = jQuery.isPlainObject(json) ? json: jQuery.parseJSON(json);
	var MenuResto = jQuery.isPlainObject(jsonMenu) ? json: jQuery.parseJSON(jsonMenu);
	var nomResto= jsonMenu.nom;
	lat= jsonMenu.latitude;
	//alert("jsonMenu.lat"+lat);
	lon= jsonMenu.longitude;
	var EntréesMidi= jsonMenu.menu.midi.Entrées;
	var PlatsMidi= jsonMenu.menu.midi.Plats;
	var LégumesMidi= jsonMenu.menu.midi.Légumes;
	var DessertsMidi= jsonMenu.menu.midi.Desserts;
	var EntréesSoir= jsonMenu.menu.soir.Entrées;
	var PlatsSoir= jsonMenu.menu.soir.Plats;
	var LégumesSoir= jsonMenu.menu.soir.Légumes;
	var DessertsSoir= jsonMenu.menu.soir.Desserts;
	var MidiSize = Object.keys(jsonMenu.menu.midi).length;
	var SoirSize = Object.keys(jsonMenu.menu.soir).length;
	var today = new Date(); 
	var serveur= new Date(jsonMenu.date);
	var day = today.getFullYear()+"-"+today.getUTCMonth()+"-"+today.getDate() ;
	//var day = today.getFullYear()+"-"+today.getUTCMonth()+"-22" ;
	var day2 = serveur.getFullYear()+"-"+serveur.getUTCMonth()+"-"+serveur.getDate();
	if(day == day2)
		{
		
		html = "<li><h3>"+nomResto+"</h3></li>";

		if(MidiSize>0)
			html += "<li id=\"EntréesM\" class=\"midi\"><p><h4>Entrées:</h4>"+EntréesMidi+"</p></li><li id=\"PlatsM\" class=\"midi\"><p><h4>Plats:</h4>"+PlatsMidi+
			"</p></li><li id=\"LégumesM\" class =\"midi\"data-theme=\"b\"><p><h4>Légumes:</h4>"+ LégumesMidi+
			"</p></li>	<li id=\"DessertsM\" class = \"midi\" data-theme=\"b\"><p><h4>Desserts:</h4>"+DessertsMidi+" </p></li>";
		else 
			html += "<li><p class=\"midi\"><span style='text-decoration:underline' >Midi</span> : Pas de service</p></li>";
		if(SoirSize>0)
			html +="<li  id=\"EntréesSoir\" class =\"soir\"><p><h4>Entrées:</h4>"+EntréesSoir+" </p></li><li id=\"Plats\" class =\"soir\"><p><h4>Plats:</h4>"+PlatsSoir+
			"</p></li><li id=\"Légumes\" class =\"soir\"><p><h4>Légumes:</h4>" +LégumesSoir+"</p></li><li id=\"Desserts\" class = \"soir\"><p><h4>Desserts:</h4>"+DessertsSoir+
			" </p></li>";
		else 
			html += "<li><p class=\"soir\"><span style='text-decoration:underline' ><h4>Soir</span> : Pas de service</h4></p></li>";
		$('#listebeta').html(html);	
		$('#listeAlpha').hide();
		$("#listebeta").show();
		$('#itineraire').show();
		$("#mode").show();
		$("#btnBack").show();
		
		}
		else {
			alert("le menu n'a pas été envoyer!!!");
			html = "<li><h3>"+nomResto+"</h3></li>";
			html+="<li><p>Pas de service</p></li>";	
			html +="<li>tel:</li>";
			html +="<li>address:</li>";
			$('#listeAlpha').hide();
			$("#listebeta").show();
			$('#itineraire').show();
			$("#mode").show();
			$("#btnBack").show();
			$('#listebeta').html(html);	
			
		}
	setEnd(lat,lon);
	
	}
	else {
		alert("closed");
	}
	
}

function setEnd(lat,lon){
	//alert("here in setEnd"+lat+"lon:"+lon);
	end = new google.maps.LatLng(lat,lon);
	//alert("end="+end);
	$('#end').attr('value', end);
}
//btn retour sur la liste des resto qd on est ds le menu
$(document).on('click','#btnBack', function(){ 
								initMenuAlpha();
								$("#btnBack").hide();					
								$("#itineraire").hide();	
								$("#mode").hide();
								$("#listeAlpha").show();
								$('#listebeta').hide();
							});
$(document).ready(function() {
	initMenuAlpha();
	today = new Date;
		jour = today.getDay();
		numero = today.getDate();
		if (numero<10)
			numero = "0"+numero;
		mois = today.getMonth();
		TabJour = new Array("Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi");
		TabMois = new Array("janvier","février","mars","avril","mai","juin","juillet","aout","septembre","octobre","novembre","décembre");
		messageDate = TabJour[jour] + " " + numero + " " + TabMois[mois];
		$("p.date").text(messageDate);
		
});