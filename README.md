ThreeCircles: step by step tutorial for [ConFESS](https://2013.con-fess.com/)
--------------------------
This github repository holds all the step by step tutoreial to build a clone of Fousquare in a few minutes. 
The application we're going to build will be name ThreeCircle ;-)

Speakers
- [Corinne Krych](http://corinnekrych.github.com/)
- [Fabrice Matrat](http://fabricematrat.github.com/)
 
We're presenting you the work done by [3musket33rs](http://3musket33rs.github.com/) team.

## Step1: Scaffolding
### Setup
Fork this repo
### Get source code from repo
```java
git checkout step1_todo
```
In this branch there is only one grails command that has been executed
```java
grails create-app ThreeCircles
```
Now let's start configuring and scaffolding all the classes we need
### BuildConfig.groovy
add
```java
  grails.plugin.location."html5-mobile-scaffolding" = "../html5-mobile-scaffolding"
  grails.plugin.location."phonegapbuild" = "../phonegapbuild"
```
in plugins
```java
    plugins {
        runtime ":hibernate:$grailsVersion"
        runtime ":jquery:1.9.1"
        runtime ":resources:1.1.6"
        build ":tomcat:$grailsVersion"
        runtime ":database-migration:1.1"
        compile ':cache:1.0.0'
        compile ":webxml:1.4.1"
    }
```
in UrlMappings.groovy
remove
```java
    "/"(view:"/index")
```
### Create domain classes
```java
grails create-domain-class User
grails create-domain-class Place
grails create-domain-class Comment
grails create-domain-class Checkin
```
edit generated domain class and add content according to class diagram
![class diagram](https://github.com/fabricematrat/ThreeCircles/raw/master/imagesTutorial/classDiagram.png "class diagram")

### Generate HTML5 scaffolding for both controller and views
```java
grails html-generate-all User
grails html-generate-all Place
grails html-generate-all Comment
grails html-generate-all Checkin
```
### Run the app
```java
grails run-app
```

### Get source code from repo
Before you get the solution push your changes
```java
git add -a -m "your changes"
git push
```
and if you want to check the solution
```java
git checkout step1_done
```
## Step2: Boostrap
### Get source code from repo
```java
git checkout step2_todo
```
and search for TODO in files

### In BootStrap.groovy
- add several users
- add some places
```java
        Place wien = new Place(name: "Wein", 
                               latitude:48.217349004974416, 
                               longitude: 16.407538767645292, 
                               address:  "Messe Wien Exhibition & Congress " )
        wien.save()
```
- add a checkin at confess!

### Run the app
```java
grails run-app
```

### Get source code from repo
```java
git checkout step2_done
```
or see the solution
[Solution Step2](https://github.com/fabricematrat/solution_step2.md)

## Step3: Render timeline with mock picture

### Get source code from repo
```java
git checkout step3_todo
```
you will get new folders and files containing mock screen for timeline
- web-app/css/my.css
- web-app/img/
-	web-app/index_mock.html
-	web-app/js/my.js

### Main page: timeline
- delete index.html
- rename checkin-index.html into index.html

### Transform your index.html with css
- add import css file 
- In section with id "section-list-checkin" add header as shown in index-mockup.html
- revisit footer

### Display dynamic content
- write renderElementCutom (search for //TODO render timeline)
Put a breakpoint in checkin-view.js in callback attached to that.model.listedItems 
- Is it rendering as expected? 
- In Checkin.groovy add deep relation reolution for as JSON (search for //TODO deep relation)

### Get source code from repo
```java
git checkout step3_done
```

## Step4: Get timeline with time information

### Get source code from repo
```java
git checkout step4_todo
```
You will get a new file timeline.js that you will complete for the time information.
### Add JS file timeline.js
- go to timeline.js
Note 3muket33rs JS coding à la Crockford (function first!).
Add a method which take a Date as long and returned information like just now, 11 minutes ago, 2 days ago, 3 months ago
- go to checkin-view.js (search for //TODO add when information)
- go to index.html to include new js file

### Get source code from repo
```java
git checkout step4_done
```

## Step5: Google places

### Get source code from repo
```java
git checkout step5_todo
```
- You will get a new file geolocation.js that you will complete for the time information.
- In index.html, include google API, section with id "section-show-checkin" has been refactored to apply CSS and match our use case
- In checkin-view.js, we initialize our map with
```java
    $("#section-show-checkin").on( "pageshow", function (event) {
        geolocationSearch.showMapWithPlaces('map_canvas2', "list-place", storeLatLng);
    });
```
### In geolocation.js seach // TODO search places
In this method

- create map from canvas id

Use Google API: [google.maps.Map](https://developers.google.com/maps/documentation/javascript/reference#Map)

- once navigator got our current position, use google places API

HTML5 navigator.geolocation, to get current position

Use Google places API: [google.maps.places](https://developers.google.com/maps/documentation/javascript/reference#PlacesService)

Use Google geometry API: [google.maps.geometry.spherical](https://developers.google.com/maps/documentation/javascript/reference#spherical)

Use Google Marker API: [google.maps.Marker](https://developers.google.com/maps/documentation/javascript/reference#Marker)

Use Google position API: [google.maps.LatLng](https://developers.google.com/maps/documentation/javascript/reference#LatLng)

### Get source code from repo

```java
git checkout step5_done
```
## Step6: Checkin!

### Get source code from repo
```java
git checkout step6_todo
```
- In index.html, section with id "checkin" has been refactored to apply CSS and match our use case
- In checkin-view.js, we initialize our third map (canvas_map3) with
```java
    $("#checkin").on( "pageshow", function (event) {
        geolocationCheckin.showMap('map_canvas3', that.selectedPlace);
    });
```
- In geolocation.js, uses [google info window](https://developers.google.com/maps/documentation/javascript/reference#InfoWindow) to render bubble.

### Add behaviour on button id  "checkin-submit"
- search for // TODO on checkin submit
- format the object before sending
```java
            {
               checkin: "{
                  description: description,
                  'owner.id': "1",
                   place: placeObj,
                  when: new Date().getTime()
               }"
           }
```

### CheckinController.groovy, once a place is found with Google Places, save it to ThreeCircles database.

### On created, in checkin-view.js, deal with event push and displayed it only once
```java
   if (!data.item.NOTIFIED) {
     // I'm being notified of a new checkin
   }  else {
     // I've just checked in successfully
   }
```
### On created, add clear text area to resetForm method

### Get source code from repo
```java
git checkout step6_done
```
## Step7: Let's take a picture

### Get source code from repo
```java
git checkout step7_todo
```
### Add a new attribute in Checkin.groovy search for // TODO picture
- By convention every attribute of type "byte[]" is considerer as a photo, html5-mobile-scaffolding will scaffold all needed for deling with photo
- Photo is optional and are big. See add to define [constraints](http://grails.org/doc/latest/ref/Constraints/Usage.html) in Grails.
- No need to re-generate scaffolded view: be carefull not to loose all your work on checkin view!

### in geolocation.js, 
- add in the bubble window, take a pciture button

### in checkin-view.js,
- on checkin-submit click send picture within the form
- modify createListItemCustom to dispplay picture if present
- On created, add clear file input to resetForm method

### Get source code from repo
```java
git checkout step7_done
```
