STREET ART FINDER

A collaborative project for  artists, photographers, influencers and bloggers in search of Instagrammable Art in the streets of LA.

What: A web-based site that allows its users to easily track the location of existing and relevant street art.
How: Using several different Flicker API calls to display top x amount of street art, access the geo-location of the picture, should it be available while finally displaying the data using Google Maps API call to render a personalized map, including zoomed out heat zones. 

Our site also relies on a User form to allow users to add comments such as: how accurate the map is, whether the art work still exists and whether it has been vandalised while rating the art itself.
Scope: use 3-5 known artist

There are also prototypes and test files of our use of Microsoft Vision API, a picture analyzer which we aim to use to make our Flickr results more accurate.

 
Technologies used:
HTML, CSS, Bootstrap - front end / UI
Javascript including JQuery
Firebase to store data
Github is our repo
 
Project Group Members:
Celso Oliveira – backend for Flicker API
Eric Liu – overall backend – Firebase and JQuery
Rafael Fraga – backend for Google Apis
Regina Lo - html
Handler:
Mila
 
Minimal Viable Product:
User front-end interface designed in HTML using CSS and Bootstrap which will allow the user to make searches via destination (zip code). 
The page will predominantly be a Google Maps interface with multiple small pins. Once pins are opened (modals), it will allow users to use a form to comment on things such as location accuracy, safety rating and comments. 

Firebase will be used to store the user input forms/ratings that will interact with the front-end elements.
Parameters will be pulled from Flicker API and tested in Google Cloud Vision API for relevancy. If relevant, it will be displayed on Google Maps as a pin or image (?).
 

