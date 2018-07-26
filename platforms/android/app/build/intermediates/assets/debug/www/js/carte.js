document.addEventListener("deviceready", onDeviceReady, false);


function onDeviceReady() {
    initMap();


}


function initMap() {
    var lat = 6.4445214;
    var long = 2.3328888;

    var myLatlng = new google.maps.LatLng(lat, long);
    var mapOptions = {
        zoom: 12, center: myLatlng, styles:
            [
                {
                    "featureType": "administrative",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "landscape",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#ff0300"
                        },
                        {
                            "saturation": -100
                        },
                        {
                            "lightness": 129.33333333333334
                        },
                        {
                            "gamma": 1
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "poi",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#abff00"
                        },
                        {
                            "saturation": 61.80000000000001
                        },
                        {
                            "lightness": 13.800000000000011
                        },
                        {
                            "gamma": 1
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "on"
                        },
                        {
                            "color": "#1fa661"
                        },
                        {
                            "weight": "0.55"
                        }
                    ]
                },
                {
                    "featureType": "road.highway",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.highway.controlled_access",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road.highway.controlled_access",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road.arterial",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#00b7ff"
                        },
                        {
                            "saturation": -31.19999999999996
                        },
                        {
                            "lightness": 2.1803921568627374
                        },
                        {
                            "gamma": 1
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "road.local",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#00B5FF"
                        },
                        {
                            "saturation": -33.33333333333343
                        },
                        {
                            "lightness": 27.294117647058826
                        },
                        {
                            "gamma": 1
                        },
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "transit.line",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit.station.airport",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "on"
                        }
                    ]
                },
                {
                    "featureType": "transit.station.bus",
                    "elementType": "all",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "water",
                    "elementType": "all",
                    "stylers": [
                        {
                            "hue": "#00B7FF"
                        },
                        {
                            "saturation": 8.400000000000006
                        },
                        {
                            "lightness": 36.400000000000006
                        },
                        {
                            "gamma": 1
                        }
                    ]
                }
            ]
    }
    var map = new google.maps.Map(document.getElementById('map'), mapOptions);


    var myDB;
    if (navigator.userAgent.match(/(Android)/)) {

        myDB = window.sqlitePlugin.openDatabase({name: "snp.db", location: 'default'});
        //myDB = window.sqlitePlugin.openDatabase({name: 'mydb.db', location: 'default' }, function (db) {}, function (error) { console.log('Open database ERROR: ' + JSON.stringify(error)); });
        console.log('DB: SQLite');

    } else {

        myDB = window.openDatabase('mydb', "0.1", "mydb description", 200000);
        console.log('DB: WebSQL');
    }
    myDB.transaction(function (transaction) {
        var executeQuery = "SELECT * FROM photo";
        transaction.executeSql(executeQuery, []
            , function (tx, result) {


                if (result.rows.length > 0) {


                    for (var i = 0; i < result.rows.length; i++) {
                        var marker = new google.maps.Marker({
                            position: new google.maps.LatLng(result.rows.item(i).lat, result.rows.item(i).long),
                            map: map,
                            /* title: "Hello Cordova Google Maps for iOS and Android",
                             snippet: "This plugin is awesome!"*/
                        });


                        var infoWindow = new google.maps.InfoWindow;
                        var contentString = " <h3> " + result.rows.item(i).description + "</h3>";

                        if (result.rows.item(i).chemin_photo != "") {
                            contentString += "<img style='height: 50px; width: 50px' src='"+result.rows.item(i).chemin_photo+
                            "' />";
                        }


                        infoWindow.setPosition(marker.position);
                        infoWindow.setContent(contentString);
                        infoWindow.open(map);

                    }


                } else {
                    alert("Echec de reception des données");
                }

                // window.location.href="connexion.html";
            },
            function (error) {
                alert('Erreur SQL' + error);
            });
    });


    var marker = new google.maps.Marker({
        position: myLatlng,
        map: map,
        title: "Hello Cordova Google Maps for iOS and Android",
        snippet: "This plugin is awesome!"
    });


    var infoWindow = new google.maps.InfoWindow;

    infoWindow.setPosition(marker.position);
    infoWindow.setContent('Cotonou');
    infoWindow.open(map);

}

