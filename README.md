ThreeCircles: step by step tutorial for [ConFESS](https://2013.con-fess.com/)
--------------------------
This github repository holds all the step by step tutoreial to build a clone of Fousquare in a few minutes. 
The application we're going to build will be name ThreeCircle ;-)

Speakers
- [Corinne Krych](http://corinnekrych.github.com/)
- [Fabrice Matrat](http://fabricematrat.github.com/)
 
We're presenting you the work done by [3musket33rs](http://3musket33rs.github.com/) team.

## Setup
### GitHub Repos
#### With Confess VM Environment
In the vm, given to you, you will find in ~/work a clone of this repository and 3musketeers plugins
Please update this version
```java
cd ~/work/html5-scaffolding-plugin
git pull
cd ~/work/ThreeCircles
git pull
```

#### Without
If you do not have the confess vm environment, fork or clone this repo but also the 3musket33rs plugins
```java
git clone https://github.com/3musket33rs/html5-mobile-scaffolding
git clone https://github.com/3musket33rs/phonegapbuild.git
git clone https://github.com/fabricematrat/ThreeCircles.git
```
You will need also grails 2.2.1, jdk1.7, a modern browser (no IE6!)

### Working with branches
The step by step tutorial works with git branches. For each step you will find a branch **stepXX_todo** and **stepXX_done**
Here will be the list of git commands you will need to know
```java
git checkout stepXX_todo // To enter in the stepXX_todo branch
git branch // to check in which branch you are
git status // to know which files you modified in the current branch
git add ... // to add files to be committed
git commit -m "Some usefull comments" //To commit locally your changes
git pull // to fetch the latest changes from the remote repo
git push // to send your committed changes to the remote repo
```

## Step1: Scaffolding

### Get source code from repo
```java
git checkout step1_todo
```
In this branch there is only one grails command that has been executed
```java
grails create-app ThreeCircles
```
Now let's start configuring, adding the required plugins.
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
in resolution change **legacyResolve**
```java
    grails.project.dependency.resolution = {    
    ....
        legacyResolve true
    ...
    }
```
in UrlMappings.groovy
remove
```java
    "/"(view:"/index")
```

### Create domain classes
Ready to do scaffold all the domain classes we need!
```java
grails create-domain-class User
grails create-domain-class Place
grails create-domain-class Comment
grails create-domain-class Checkin
```
Now, edit generated domain classes and add content according to class diagram
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
and search for TODO in grails-app/conf/Bootstrap.groovy

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
- Test the application
- Play with offline mode (in chrome switch off network, in Firefox File-> Work Offline)
- Add/Delete Users for example
- Get back online

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

Search for TODO in the project

### Main page: timeline
- delete index.html
- rename checkin-index.html into index.html

### Transform your index.html with css
- add import css file 
- in section with id "section-list-checkin" add header as shown in **index-mockup.html**
- in section with id "section-list-checkin" revisit footer as shown in **index-mockup.html**
- in section with id myContent, add canvas map (for later use step5)

### Display dynamic content
The js file **web-app/js/threecircles/checkin-view.js** contains the JavaScript assocated with your view. 
Let's make the content dynamic!
- Go to the callback associated to that.model.listedItems event:
Put a breakpoint in checkin-view.js to see the data structure returned by the server
- is it rendering as expected? hummm.... It would be easier with embedded relationship. 
In CheckinController.groovy add deep relationship resolution for **as JSON** (search for //TODO deep relation)
- working with **index-mockup.html**, loop for all checkins: display dynamic content for owner, 
where the checkin is, checkin description. Leave harcoded place holder for pictures.

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
Add a method which takes a Date as long and returns information like:
*just now* (when under 10mins), *11 min ago*, *2h23 min*, *2 days ago*, *3 months ago* and we don't care when it's over one year.
- go to checkin-view.js (search for //TODO) add call to newly created method to add time information.
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
- you will get a new file geolocation.js that you will complete.
- in index.html, google API  and geolocation.js has been included
- in index.html, section with id "section-show-checkin" has been refactored to apply CSS and match our use case. 
- in checkin-view.js, we initialized our maps with
```java
    $("#section-show-checkin").on( "pageshow", function (event) {
        geolocationSearch.showMapWithPlaces('map_canvas2', "list-place", storeLatLng);
    });
```
### In geolocation.js seach // TODO search places
In the method **showMapWithPlaces**

- a google map is created from canvas from canvas id

Using Google API: [google.maps.Map](https://developers.google.com/maps/documentation/javascript/reference#Map)

- once navigator got our current position with HTML5 **navigator.geolocation**, use google places API

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
- In checkin-view.js, *addAndSort* method added to render timeline with latest checkin first.
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

### CheckinController.groovy, 
- once a place is found with Google Places, save it to ThreeCircles database.
- look at **event** method that triggers the event push (we'll use event push next step on view)

### On created, in checkin-view.js, deal with event push

Event push (Grails plugin using Atmosphere framework) is doing broadcast to all browsers.  
3musketeers PushManager is dealing with excluding "myself". In order to know in your code if you're the one triggering 
created callback you can user the NOTIFIED tag. NOTIFIED boolean is set true when you are notidied of somebody else event.
In **that.model.createdItem** callback
- add **resetForm('form-update-checkin')** call to clear the form. 
- in **resetForm** method clear checkin bubble's text area.
- always in **that.model.createdItem** callback, add newly created value. Use **addAndSort** for the display.

```java
   if (!data.item.NOTIFIED) {
     // I'm being notified of a new checkin
   }  else {
     // I've just checked in successfully
   }
```
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
- By convention every attribute of type **byte[]** is considerered as a photo. 
No need to re-generate scaffolded view: be carefull not to loose all your work on checkin view!
- Photo should be optional. See how to add to define 
[constraints](http://grails.org/doc/latest/ref/Constraints/Usage.html) in Grails.
- Photo should have size of 20Mb

### in geolocation.js, 
- in the bubble window, add an input of type *file* with id *input-checkin-photo*

### in checkin-view.js,
- on *checkin-submit* click send picture within the form
- modify **createListItemCustom** to display picture if present

### Get source code from repo
```java
git checkout step7_done
```

## Step8: Put all together

### Get source code from repo
```java
git checkout step8_done
```
- in checkin-view.js, generated code has been cleaned to leave only what's needed
- place-index.html & place-view.js has been modified with CSS. 
- friend-index.html & friend-view.js has been modified with CSS. 

## Step9: Login

### Get source code from repo
```java
git checkout step9_todo
```

### Get source code from repo
```java
git checkout step9_done
```

## Step10: In the Cloud
### Get source code from repo
```java
git checkout step10_todo
```
### Create a cloud foundry account
Sign up at [www.cloudfoundry.com](http://www.cloudfoundry.com)

### Config
Install cloud foundry plugin
```java
grails install-plugin cloud-foundry
```
Configure your global setting
```java
cd ~/.grails
touch setting.groovy
```
in settings.grrovy add your cloud founcdry credentials
```
grails.plugin.cloudfoundry.username="..."
grails.plugin.cloudfoundry.password="..."
```
### Get source code from repo
```java
git checkout step10_done
```

## Step11: PhoneGap Build

### Get source code from repo
```java
git checkout step11_todo
```
### Configure your PhoneGap Build account
Sign up at [build.phonegap.com](http://build.phonegap.com)
### Config.groovy
```java
phonegapbuild.username="..."
phonegapbuild.password="..."
phonegapbuild.phonegapversion="2.3.0"
```

