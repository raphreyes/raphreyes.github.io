// setup variables for api and data
var mapParkList;
var map;
var infowindow;
var marker;
var markerList = [];
var filteredMarks = [];
var filterInput;
var bouncer;
var wikiAPI;
var ww = window.innerWidth;
var textUrl1 = '<div id ="infoContent" class="infocontent"><a href="http://en.wikipedia.org/wiki/',
    textUrl2 = '" target="_blank">',
    textUrl3 = '</a></div>';

// Define a park
var Park = function(data) {
    "use strict";
    this.name = ko.observable(data.name);
    this.location = ko.observable(data.location);
    this.geo = ko.observable(data.geo);
};

// api data routine
var apiControl = {
    data: function(tmp) {

        // set search url
        wikiAPI = 'https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=' + tmp + '&srlimit=1&format=json&callback=?';

        var wikiRequestTimeout = setTimeout(function(){
            infowindow.setContent('<div class="apierror"><p>Failed to get Wikipedia Resources</p></div>');
            }, 5000);

        $.ajax({
            url: wikiAPI,
            dataType: 'jsonp',
            jsonp: 'parks',
            success: function(data) {

                // format the data
                var apiTitle = data.query.search[0].title;
                var apiSnip = data.query.search[0].snippet;
                var infoA = textUrl1 + apiTitle + textUrl2 + apiTitle + textUrl3;
                var infoB = '<div>' + apiSnip + ' [...]</div>';

                // Display the infowindow
                infowindow.open(map);

                // Place data into the infoWindow
                infowindow.setContent(infoA + infoB);
                
                clearTimeout(wikiRequestTimeout);
            },
            error: function() {
                infowindow.setContent('<div class="apierror"><p>Could not fetch wikipedia content</p></div>');
            }
        });
    }
};

// setup park data and list/filter control
var operator = function() {
	"use strict";

    // define variables
    var self = this;
    self.filter = ko.observable('');
    self.parkList = ko.observableArray([]);
    self.filteredParks = ko.observableArray([]);
    mapParkList = self.parkList();
    initialParkData.forEach(function(parkItem) {
        self.parkList.push(new Park(parkItem));
        self.filteredParks.push(new Park(parkItem));
    });

    // This will set selected park when user clicks a park in the list
    self.changePark = function (park) {
        self.currentPark(park);
        // show the infowindow
        mapControl.menu();
        mapControl.infoWindow(park);
    };

    // Set the initial selected park to the first park
    self.currentPark = ko.observable(this.parkList()[0]);

    // Create filtered park list
    self.filteredParks = ko.computed(function(data) {
        var getList = ko.utils.arrayFilter(self.parkList(), function(input) {
            var searchName = (
                self.filter().length === 0 ||
                input.name().toLowerCase().indexOf(self.filter().toLowerCase()) > -1
            );
            var searchLoc = (
                self.filter().length === 0 ||
                input.location().toLowerCase().indexOf(self.filter().toLowerCase()) > -1
            );
            return searchName + searchLoc;
        });
        filterInput = self.filter().toLowerCase();
        return getList;
    });

};
ko.applyBindings(new operator());

// map setup - control
var mapControl = {
    init: function() {

        // define some initial variables and layouts
        var bounds = new google.maps.LatLngBounds();
        var position, geoloc; // remove vars from loops
        var mapDiv = document.getElementById('map');
        var infoString = '<div id="infobubble" class="infobubble"><p>Welcome to the 20 Best Entertainment Parks of North America</p><p>Click on a marker or list item</p></div>';
        var center = {
            lat: 36.797,
            lng: -98.684
        }; // Kansas

        // set dimensions
        ww = window.innerWidth;
        var mapWidth = mapControl.mapWidth(ww);
        var mapHeight = window.innerHeight - $('#title').innerHeight();
        var listHeight = mapHeight - $('#form').innerHeight();
        $('#map').attr('height', mapHeight);
        $('#map').attr('width', mapWidth);
        $('#control').attr('height', mapHeight);
        $('#list').attr('height', listHeight);

        // display the map. Our prefered zoom level is 4.
        map = new google.maps.Map(mapDiv, {
            center: center,
            zoom: 4,
            disableDefaultUI: true
        });

        // Define an infowindow
        infowindow = new google.maps.InfoWindow({
            content: infoString,
            maxWidth: 300,
            pixelOffset: new google.maps.Size(0, -24),
            position: center
        });

        // show welcome message
        infowindow.open(map);

        // loop - set the markers
        $.each(mapParkList, function(geo) {
            geoloc = mapParkList[geo].geo();
            position = new google.maps.LatLng(geoloc);
            bounds.extend(position);
            marker = new google.maps.Marker({
                position: position,
                map: map,
                title: mapParkList[geo].name() + ', ' + mapParkList[geo].location()
            });

            // add the marker to markerList array
            markerList.push(marker);

            // show info window when a marker is clicked
            marker.addListener('click', function() {
                var geoCheck = this.getPosition();
                mapControl.getPark(geoCheck.lat());
            });
        });

        // setup event listener to close info windows
        // when any click occurs in map div outside of infowindow
        map.addListener('click', function() {
            infowindow.close(map);
        });

        // Frame all the markers visibly
        map.fitBounds(bounds);
    },
    infoWindow: function(park) {
        // define variables
        var infoString = '<div id="infoBubble" class="infobubble">Loading...</div>';
        infowindow.setContent(infoString);
        var position = park.geo();
        var parkName = park.name();
        $('#apierror').html('');

        // fetch data from wikipedia api
        apiControl.data(parkName);

        // identify the marker
        $.each(markerList, function(mark) {
            if (markerList[mark].position.lat() == position.lat) {
                bouncer = markerList[mark];
            }
        });

        // Position infowindow and content, show marker.
        infowindow.setPosition(position);
        map.panTo(position);

        // bounce the marker 3 sec., then set all markers animation null.
        mapControl.bounce(bouncer);
    },
    mapWidth: function(w) {
        // if browser screen is less than 640
        if (w <= 640) {
            return w;
        } else {
            return Math.round(0.66 * w);
        }
    },
    getPark: function(coord) {
        // Get the park data and show infowindow
        $.each(mapParkList, function(park) {
            if (mapParkList[park].geo().lat == coord) {
                // pass this park to the infowindow and display
                mapControl.infoWindow(mapParkList[park]);
            }
        });
    },
    bounce: function(m) {
        // First, stop all marker animation else we'll have previous markers bouncing
        // if click on next marker happens before bouncing first marker ends.
        $.each(markerList, function(mark) {
            markerList[mark].setAnimation(google.maps.Animation.NULL);
        });

        // Bounce the correct marker
        m.setAnimation(google.maps.Animation.BOUNCE);

        // Stop it after 3 seconds
        setTimeout(function() {
            m.setAnimation(google.maps.Animation.NULL);
        }, 2100);
    },
    filter: function() {
        setTimeout(function(){
            // close InfoWindow when we process markers
            infowindow.close(map);

            // get filter input value
            var resultHide = [];

            // filter for result of markers
            var resultShow = $.grep(markerList, function(park) {
                return park.title.toLowerCase().indexOf(filterInput) > -1;
            });
            resultHide = $.grep(markerList, function(park) {
                return park.title.toLowerCase().indexOf(filterInput) > -1;
            }, true);

            // do hide show markers
            mapControl.show(resultShow);
            mapControl.hide(resultHide);

            // Frame locations
            filteredMarks = resultShow;
            mapControl.frameAll();
        }, 10);
    },
    show: function(mrk) {
        // show marker mrk
        $.each(mrk, function(marker) {
            mrk[marker].setVisible(true);
        });
    },
    hide: function(mrk) {
        // hide marker mrk
        $.each(mrk, function(marker) {
            mrk[marker].setVisible(false);
        });
    },
    frameAll: function() {
        var bounds = new google.maps.LatLngBounds();
        var geoloc = {
            lat: '',
            lng: ''
        };
        if (filteredMarks.length === 0) {
            return;
        }
        $.each(filteredMarks, function(geo) {
            geoloc.lat = filteredMarks[geo].position.lat();
            geoloc.lng = filteredMarks[geo].position.lng();
            var position = new google.maps.LatLng(geoloc);
            bounds.extend(position);
        });
        map.fitBounds(bounds);
    },
    menu: function() {
        var contr = $('#control').innerWidth() - 40;
        var check = ($('#control').attr('style'));
        var menuExist = $('#menubutton').css('display');
        
        if (menuExist === 'none') {
        	$('#control').attr('style', 'transform: translateX(0px)');
        	return;
        }

        // Hide or show list-filter 
        if (typeof check == 'undefined' || check == 'transform: translateX(0px)') {
            $('#control').attr('style', 'transform: translateX(-' + contr + 'px)');
        } else {
            $('#control').attr('style', 'transform: translateX(0px)');
        }
    },
    resize: function() {
        // make sure park list is visible when window is resized.
        $('#control').attr('style', 'transform: translateX(0px)');
    },
    noLoad: function(data) {
        var mapError = '<div>Could not load Google Maps</div>';
        $('#apierror').html('<div class="apierror">' + mapError + '</div>');
    }
};