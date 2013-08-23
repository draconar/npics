//setting up Here.com
nokia.Settings.set("appId", "KZwV57zz8hw6gp6H2tl1"); 
nokia.Settings.set("authenticationToken", "f0S_Nn42f7orgOrghHrbkA");
var lat_lon = {lat: -23.550, lon: -46.6333};


// Get the DOM node to which we will append the map
var mapContainer = document.getElementById("mapContainer");
// Create a map inside the map container DOM node
var map = new nokia.maps.map.Display(mapContainer, {
    // initial center and zoom level of the map
    components: [new nokia.maps.map.component.Behavior()],
	//if location cannot be determined, it will be located above Sao Paulo, Brazil
    center: [-23.54, -46.64],
    zoomLevel: 7
});

//we will try to get the user's position and draw a blue marker on her location
if (nokia.maps.positioning.Manager) {
    var positioning = new nokia.maps.positioning.Manager();

    // Get the current position. If available, the first callback is run, 
    // otherwise the second.
    positioning.getCurrentPosition(
        function (position) {
		var coords = position.coords;
		lat_lon.lat = coords.lat;
		lat_lon.lon = coords.lon;

            var marker = 
                new nokia.maps.map.StandardMarker(coords);
            var accuracyCircle = 
                new nokia.maps.map.Circle(coords, coords.accuracy);
            map.objects.addAll([accuracyCircle, marker]);
            //map.zoomTo(accuracyCircle.getBoundingBox(), false, "default");
			
        },
        // Handle errors (display message):
        function (error) {
            var errorMsg = "Location could not be determined: ";

            // Determine what caused the error and show error message:
            if (error.code == 1) 
                errorMsg += "PERMISSION_DENIED";
            else if (error.code == 2) 
                errorMsg += "POSITION_UNAVAILABLE";
            else if (error.code == 3) 
                errorMsg += "TIMEOUT";
            else errorMsg += "UNKNOWN_ERROR";

            alert(errorMsg);
        }
    )
}

/** after initial setting up, here is code that should run after the
document.ready event is triggered **/

$(document).ready(function() {
	var $container = $('ul.tweets'),
	socket = io.connect(window.location.hostname);
	
	socket.on('connect', function () {		
		console.log('location sent ' + lat_lon.lat + ' ' + lat_lon.lon);
				//Default is Sao Paulo, Brazil
				/** @to.do: calculate the bounding box based on the user's location */
				socket.send('-53.525391,-25.762886,-43.472900,-20.363126');
			});
	
		//the code bellow runs on every new data received, it listens to the node's registered
		//twitter event
		socket.on('twitter', function(data) {
	    	//console.debug(data);
	    	if(data.geo) {
	    		$('.tweets').prepend('<li><img src="'+data.user.profile_image_url+'">'+data.text+'</li>');
	    		
	    		
			//get profile pic from twitter, transform it in a Nokia Map bitmap
			//cf. http://developer.nokia.com/Community/Wiki/HERE_Maps_API_-_How_to_use_sprite_images_as_map_marker_icons
			var imgDuck  = new nokia.maps.gfx.BitmapImage(data.user.profile_image_url, null, 30, 30)

			//create a new custom Nokia Map marker
			var marker = new nokia.maps.map.Marker(
				//coordinates I got from twitter
				new nokia.maps.geo.Coordinate(data.geo.coordinates[0], data.geo.coordinates[1]),{
					title: "marker",
					visibility: true,
					icon: imgDuck,
				// Offset the top left icon corner so that it's
				// Centered above the coordinate
				anchor: new nokia.maps.util.Point(32, 32),
				width: 30,
				height: 30
			});
			
			//enable drag, so I can play with the pictures
			marker.enableDrag();
			
			//last lines will add my custom marker to the map
			var container = new nokia.maps.map.Container();
			container.objects.add(marker);
			map.objects.add(container);			

		}

	});
});

