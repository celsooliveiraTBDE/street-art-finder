// Initialize Firebase

var mapStyle = [
  {
    "featureType": "all",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "weight": "2.00"
      }
    ]
  },
  {
    "featureType": "all",
    "elementType": "geometry.stroke",
    "stylers": [
      {
        "color": "#9c9c9c"
      }
    ]
  },
  {
    "featureType": "all",
    "elementType": "labels.text",
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
        "color": "#f2f2f2"
      }
    ]
  },
  {
    "featureType": "landscape",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "landscape.man_made",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "all",
    "stylers": [
      {
        "saturation": -100
      },
      {
        "lightness": 45
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#eeeeee"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#7b7b7b"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "simplified"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
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
        "color": "#46bcec"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry.fill",
    "stylers": [
      {
        "color": "#c8d7d4"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#070707"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "labels.text.stroke",
    "stylers": [
      {
        "color": "#ffffff"
      }
    ]
  }
]
var config = {
  apiKey: "AIzaSyA3AZ7qHSzHU0at4cDM2BmxnFozscFwQ1s",
  authDomain: "streetartfinder-d85b6.firebaseapp.com",
  databaseURL: "https://streetartfinder-d85b6.firebaseio.com",
  projectId: "streetartfinder-d85b6",
  storageBucket: "streetartfinder-d85b6.appspot.com",
  messagingSenderId: "961947549075"
};


firebase.initializeApp(config);

var markers = [];

var database = firebase.database(), snapshotGlobal, apiKey = '36d4ae46e9058c9af0dbf8f99ab21862', per_page = "100", mapLatLng, map, markerArray = [], starRating;
//default map coordinates
var lat = "34.04117", lon = "-118.23298", radius = "20";

function filterFirebase() {
  //console.log(snapshotGlobal);
  for (const key in snapshotGlobal) {
    //console.log(snapshotGlobal[key]);
    if (!snapshotGlobal[key].hasOwnProperty("comments")) {
      database.ref(key).remove();
    }
  }
}

//stores firebase locally when firebase is changed to simplify data manipulation
database.ref().on("value", function (snapshot) {
  snapshotGlobal = snapshot.val();
  //console.log("firebase updated");
});

$(".start-btn").on("click", function () {
  //initializes map
  $.getScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyCIBnMitsKmINmFl7FNOyFFI0nCh4cLNq0", () => {

    mapLatLng = {
      lat: parseFloat(lat),
      lng: parseFloat(lon)
    };

    map = new google.maps.Map(document.getElementById('map'), {
      zoom: 11,
      center: mapLatLng,
      styles: mapStyle
    });
  });
});

//generates a google maps marker and infowindow on the map with relevant information
function generatePin(id, latitude, longitude, title, rating, url) {
  //console.log("generating...",id,latitude,longitude,title,rating,url);
  var myLatLng = {
    lat: parseFloat(latitude),
    lng: parseFloat(longitude)
  };
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: map,
    title: title,
    id: id
  })
  markerArray.push(marker);
  var infowindow = new google.maps.InfoWindow({

    content: "<div style='width:150px; text-align: left;'>" + "<p class='info-box-text'>Title: <span id='title" + id + "'>" + title +
      "</span></p><p class='info-box-text'>Rating: <span id='rating" + id + "'>" + rating +
      "</span></p><center><img class='clickable-image' id=picture" + id + " data-id=" + id + " data-image=" + url +
      " data-lat=" + latitude + " data-lon=" + longitude + " data-rating=" + rating +
      " data-toggle='modal' data-target='#info-modal' src='" + url +
      "' alt='" + title + "' height='100' width='100'></center>" + "</div>"

  });

  marker.addListener('click', function () {
    infowindow.open(map, marker);
  });

  map.addListener("click", function () {
    infowindow.close();
  });

  markers.push(marker);

  var markerCluster = new MarkerClusterer(map, markers, {
    maxZoom: 15,
    zoomOnClick: true,
  });

}

// Sets the map on all markers in the array.
function setMapOnAll(map) {
  for (var i = 0; i < markerArray.length; i++) {
    markerArray[i].setMap(map);
  }
}

//initiates search and populates the current map area with pins
$("#search-btn").on("click", function (event) {
  event.preventDefault();
  filterFirebase();

  // Removes the markers from the map, and deletes them from the array.
  setMapOnAll(null);
  markerArray.length = 0;


  var currentPosition = map.getBounds();
  console.log(currentPosition)
  lat = (currentPosition.ma.j + currentPosition.ma.l) / 2;
  lon = (currentPosition.fa.j + currentPosition.fa.l) / 2;
  
  radius = (currentPosition.ma.l - currentPosition.ma.j) * 111;
  //  radius = 20; 
  console.log(lat, lon, radius);
  if (radius > 20) {
    radius = 20;
  }

  var photoURL = "", photoID = "", originalTitle, tags = $("#search-bar").val().trim();
  var jsonRequest = 'https://api.flickr.com/services/rest/?&method=flickr.photos.search&api_key=' + apiKey + '&format=json&jsoncallback=?&sort=relevance&lat=' + lat + '&lon=' + lon + '&radius=' + radius + '&per_page=' + per_page + '&tags=mural,grafitti&text=';


  if (tags !== "") {
    jsonRequest += "'streetart " + tags + "'";
  } else {
    jsonRequest += "streetart";
  }
  console.log(jsonRequest);
  // This is a shorthanded AJAX function --> Our initial JSON request to Flickr
  $.getJSON(jsonRequest, function (data) {
    console.log("first flickr api call:", data);
    // Loop through the results with the following function
    $.each(data.photos.photo, function (i, item) {
      originalTitle = item.title;
      // Build + store in var the url of the photo in order to link to it
      photoURL = 'https://farm' + item.farm + '.static.flickr.com/' + item.server + '/' + item.id + '_' + item.secret + '_m.jpg'
      // console.log(photoURL);
      photoID = item.id;
      //console.log(item.id);
      // Create the imgContainer with string variable which will hold all the link location,
      // title, author link, and author name into a text string. 
      geotagging(photoID, photoURL, originalTitle);
    });
  });
});
function getAuthor(picID) {
  var jsonRequest = 'https://api.flickr.com/services/rest/?&method=flickr.photos.getInfo&api_key=' + apiKey + '&format=json&jsoncallback=?&photo_id=' + picID;
  var author = "";
  // This is a shorthanded AJAX function --> Our initial JSON request to Flickr
  $.getJSON(jsonRequest, function (data) {
    // console.log (data); 
    // console.log (data.photo.dates); 
    // console.log (data.photo.owner.realname); 
    // console.log (data.photo.owner.username); 
    // console.log (data.photo.owner.location);
    if (data.photo.owner.realname !== "") {
      author = "<h6> Author: " + data.photo.owner.realname + "</h6>";
    }
    $("#author-info").html(author);
    // Loop through the results with the following function
  });
}
//displays the corresponding image and assigns all relevant data attributes to image
$("#map").on("click", ".clickable-image", function () {
  starRating = null;
  $(".stars").html('<form action="">\
  <input data-rating="5" class="star star-5" id="star-5" type="radio" name="star" />\
  <label data-rating="5" class="star star-5" for="star-5"></label>\
  <input data-rating="4" class="star star-4" id="star-4" type="radio" name="star" />\
  <label data-rating="4" class="star star-4" for="star-4"></label>\
  <input data-rating="3" class="star star-3" id="star-3" type="radio" name="star" />\
  <label data-rating="3" class="star star-3" for="star-3"></label>\
  <input data-rating="2" class="star star-2" id="star-2" type="radio" name="star" />\
  <label data-rating="2" class="star star-2" for="star-2"></label>\
  <input data-rating="1" class="star star-1" id="star-1" type="radio" name="star" />\
  <label data-rating="1" class="star star-1" for="star-1"></label></form>');

  var url = $(this).attr("data-image"), id = $(this).attr("data-id"), title = $("#title" + id).text()
  //console.log("this is title"+title); 
  //console.log("this is id"+id); 
  getAuthor(id);
  //console.log("this is author"+test); 
  $("#input-name").val("");
  $("#input-comments").val("");
  $("#rating-header").text($(this).attr("data-rating"));
  $("#title-header").text(title.toUpperCase());
  $("#author-info").text()
  $("#input-title").val("");
  $("#flickr-image").attr("src", url).attr("data-id", id).attr("data-lon", $(this).attr("data-lon"))
    .attr("data-lat", $(this).attr("data-lat")).attr("data-url", $(this).attr("data-image"))
    .attr("alt", $(this).attr("alt")).attr("data-rating", $(this).attr("data-rating"));
  $("#stored-comments").empty();
  for (const key in snapshotGlobal) {
    if (snapshotGlobal[key].id == id) {
      const comments = snapshotGlobal[key].comments;
      for (const key in comments) {
        const newComment = "<div class='card-body'><p class='stored-name'>Name: " + comments[key].name + "</p><p>Comment: " + comments[key].comment + "</p></div>";
        $("#stored-comments").append(newComment);
      }

    };


  }
});

//updates firebase, infowindow, and module with relevant information
function pushtoFirebase() {
  var existsAlready = false, comment = $("#input-comments").val().trim(), name = "anonymous", title = $("#title-header").text(), ratingDisplay, existingRating = 0, ratingCount = 0;
  //console.log(snapshotGlobal);
  //console.log(title);
  console.log(comment, name, title);
  if ($("#input-name").val() !== "") {
    name = $("#input-name").val().trim();
  }
  if ($("#input-title").val() !== "") {
    title = $("#input-title").val().trim();
  }
  for (const key in snapshotGlobal) {
    if (snapshotGlobal[key].id == $("#flickr-image").attr("data-id")) {
      if (comment != "") {
        database.ref(key + "/comments").push({
          name: name,
          comment: comment
        });
      }
      database.ref(key).update({
        title: title
      });
      $("#title" + $("#flickr-image").attr("data-id")).text(title);
      $("#title-header").text(title);
      $("#picture" + $("#flickr-image").attr("data-id")).attr("alt", title);
      if (starRating != null) {
        database.ref(key + "/rating").push(starRating, function () {
          for (const key in snapshotGlobal) {
            if (snapshotGlobal[key].id == $("#flickr-image").attr("data-id")) {
              for (const ratingKey in snapshotGlobal[key].rating) {
                existingRating += parseFloat(snapshotGlobal[key].rating[ratingKey]);
                ratingCount++;
              }
              existingRating /= ratingCount;
              ratingDisplay = existingRating.toFixed(2);
            }
          }
          $("#rating" + $("#flickr-image").attr("data-id")).text(ratingDisplay);
          $("#rating-header").text(ratingDisplay);
          $("#picture" + $("#flickr-image").attr("data-id")).attr("data-rating", ratingDisplay);
        });
      }
      existsAlready = true;
      console.log("it exists in firebase");
    }
  }
  if (!existsAlready) {
    console.log("pushing to firebase");
    database.ref().push({
      id: $("#flickr-image").attr("data-id"),
      url: $("#flickr-image").attr("data-url"),
      latitude: $("#flickr-image").attr("data-lat"),
      longitude: $("#flickr-image").attr("data-lon"),
      title: title,
      rating: $("#flickr-image").attr("data-rating")
    }, function () {
      $("#title" + $("#flickr-image").attr("data-id")).text(title);
      $("#title-header").text(title);
      $("#picture" + $("#flickr-image").attr("data-id")).attr("alt", title);
      for (const key in snapshotGlobal) {
        if (snapshotGlobal[key].id == $("#flickr-image").attr("data-id")) {
          if (comment != "") {
            database.ref(key + "/comments").push({
              comment: comment,
              name: name
            });
          }
          if (starRating != null) {
            database.ref(key + "/rating").push(starRating, function () {
              for (const key in snapshotGlobal) {
                if (snapshotGlobal[key].id == $("#flickr-image").attr("data-id")) {
                  for (const ratingKey in snapshotGlobal[key].rating) {
                    existingRating += parseFloat(snapshotGlobal[key].rating[ratingKey]);
                    ratingCount++;
                  }
                  existingRating /= ratingCount;
                  ratingDisplay = existingRating.toFixed(2);
                }
              }
              $("#rating" + $("#flickr-image").attr("data-id")).text(ratingDisplay);
              $("#rating-header").text(ratingDisplay);
              $("#picture" + $("#flickr-image").attr("data-id")).attr("data-rating", ratingDisplay);
            });
          }
        }
      }
    });
  }
  if (comment != "") {
    const newComment = "<div class='card-body'><p class='stored-name'>Name: " + name + "</p><p>Comment: " + comment + "</p></div>";
    $("#stored-comments").append(newComment);
    $("#input-comments").val("");
    $("input-name").val("");
  }
}

//event listener for rating input
$(".stars").on("click", ".star", function () {
  starRating = $(this).attr("data-rating");
  console.log("current rating: ", starRating);
})

//submits comments to firebase
$("#submit-btn").on("click", function () {
  pushtoFirebase();
});

// GEO TAGGING AJAX CALLS
function geotagging(inputID, inputURL, originalTitle) {
  var newRequest = 'https://api.flickr.com/services/rest/?&method=flickr.photos.geo.getLocation&api_key=' + apiKey + '&format=json&jsoncallback=?&photo_id=' + inputID, existsAlready = false, existingKey, lat, lon, existingRating = 0, ratingCount = 0, ratingDisplay = "none";
  //console.log(newRequest);
  // Another AJAX call using the shortcut --> 

  for (const key in snapshotGlobal) {
    if (snapshotGlobal[key].id == inputID) {
      existsAlready = true;
      existingKey = key;
    }
  };

  $.getJSON(newRequest, function (data) {
    // console.log(data); // snapshot of the object
    //console.log(data.photo.location.latitude)
    //console.log(data.photo.location.longitude)
    if (!existsAlready) {
      generatePin(inputID, data.photo.location.latitude, data.photo.location.longitude, originalTitle, "none", inputURL)
    } else {
      if (snapshotGlobal[existingKey].rating != "none") {
        for (const key in snapshotGlobal[existingKey].rating) {
          existingRating += parseFloat(snapshotGlobal[existingKey].rating[key]);
          ratingCount++;
        }
        existingRating /= ratingCount;
        ratingDisplay = existingRating.toFixed(2);
      }
      generatePin(snapshotGlobal[existingKey].id, snapshotGlobal[existingKey].latitude, snapshotGlobal[existingKey].longitude, snapshotGlobal[existingKey].title, ratingDisplay, snapshotGlobal[existingKey].url);
    }
  });
};

/*
function processImage(url) {
  // **********************************************
  // *** Update or verify the following values. ***
  // **********************************************
  // Replace the subscriptionKey string value with your valid subscription key.
  var subscriptionKey = "cea593821c6740b3bc736c1011fda5d7";
  // Replace or verify the region.
  //
  // You must use the same region in your REST API call as you used to obtain your subscription keys.
  // For example, if you obtained your subscription keys from the westus region, replace
  // "westcentralus" in the URI below with "westus".
  //
  // NOTE: Free trial subscription keys are generated in the westcentralus region, so if you are using
  // a free trial subscription key, you should not need to change this region.
  var uriBase = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/analyze?visualFeatures=tags&language=en";
  var uriBase2 = "https://westcentralus.api.cognitive.microsoft.com/vision/v1.0/describe?maxCandidates=3";
  // Request parameters.
  var params = {
    "visualFeatures": "Categories,Description,Color",
    "details": "",
    "language": "en",
  };;
  // Display the image.
  var sourceImageUrl = url; // gets value from input user
  // document.querySelector("#sourceImage").src = sourceImageUrl; // sets the image on the screen to display
  // Perform the REST API call.
  $.ajax({
    url: uriBase,
    // + "?" + $.param(params),
    // Request headers.
    beforeSend: function (xhrObj) {
      xhrObj.setRequestHeader("Content-Type", "application/json");
      xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
    },
    type: "POST",
    // Request body.
    data: '{"url": ' + '"' + sourceImageUrl + '"}',
  })
    .done(function (data) {

      for (let i = 0; i < data.tags.length; i++) {
        console.log(data.tags[i].name);
        console.log(data.tags[i].confidence);
        var update = $('<input type="button" id="update" value="update" style="width:80px" class="btn btn-primary" />');
        var remove = $('<input type="button" id="remove" value="remove" style="width:80px" class="btn btn-danger" />');
        var td = $("<td></td>");
        var td2 = $("<td></td>");
        var row = $("<tr>");

        row.append("<td>" + data.tags[i].name + "</td>")
          .append("<td>" + data.tags[i].confidence + "</td>")
        $("tbody").append(row);

      }


      //capturing tags as an object;
      console.log(data.tags);
      var tags = data.tags;
      console.log(tags);
      return tags;

      // Show formatted JSON on webpage.
      $("#responseTextArea").val(JSON.stringify(data, null, 2));
    })
    .fail(function (jqXHR, textStatus, errorThrown) {
      // Display error message.
      var errorString = (errorThrown === "") ? "Error. " : errorThrown + " (" + jqXHR.status + "): ";
      errorString += (jqXHR.responseText === "") ? "" : jQuery.parseJSON(jqXHR.responseText).message;
      alert(errorString);
    });
};
*/
