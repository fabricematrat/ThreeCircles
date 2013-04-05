ThreeCircles: step by step tutorial for [ConFESS](https://2013.con-fess.com/)
--------------------------
This github repository holds all the step by step tutorial to build a clone of Foursquare in a few minutes. 
The application we're going to build will be named ThreeCircles ;-)

You will find associated presentation at [http://corinnekrych.github.com/confess/](http://corinnekrych.github.com/confess/)

Speakers
- [Corinne Krych](http://corinnekrych.github.com/)
- [Fabrice Matrat](http://fabricematrat.github.com/)
 
We're presenting you the work done by [3musket33rs](http://3musket33rs.github.com/) team. 

Special thanks to [Mathieu Bruyen](https://github.com/mathbruyen) for his cool proposal on CSS and his [ongoing work on file upload](http://blog.mais-h.eu/blog/2013/03/16/caching-images-in-a-grails-plus-mongodb-plus-angularjs-application/)

## Setup
### GitHub Repos
#### With Confess VM Environment
In the vm, given to you, you will find in ~/work a clone of this repository and 3musket33rs plugins
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
git branch               // to check in which branch you are
git status               // to know which files you modified in the current branch
git add -A               // to add files to be committed
git commit -m "Some usefull comments" //To commit locally your changes
git pull                 // to fetch the latest changes from the remote repo
git push                 // to send your committed changes to the remote repo if you did a fork
```

## Step1: Scaffolding

### Get source code from repo
```java
git checkout step1_todo
```
In this branch there is only one Grails command that has been executed
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

### Go to URL
```java
http://localhost:8080/ThreeCircles/index.html?_debugResources=y
```
Note: adding _debugResources=y to reload JavaScript/CSS/HTML updates for resources plugins

### Get source code from repo
Before you get the solution push your changes
```java
git status                   // to check the list of files changed or added
git add -A                   // to accept all changes
git commit -m "your changes" // to commit to local repo
git push                     // to push to remote repo if you did fork
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
- in section with id **section-list-checkin** add header as shown in **index-mockup.html**
- in section with id **section-list-checkin** revisit footer as shown in **index-mockup.html**
- in section with id **myContent**, add canvas map (for later use step5)

### Display dynamic content
The js file **web-app/js/threecircles/checkin-view.js** contains the JavaScript associated with your view. 
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
Note 3musket33rs JS coding à la Crockford (function first!).
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
- In index.html, section with id **checkin** has been refactored to apply CSS and match our use case
- In checkin-view.js, we initialize our third map **canvas_map3** with

```java
    $("#checkin").on( "pageshow", function (event) {
        geolocationCheckin.showMap('map_canvas3', that.selectedPlace);
    });
```
- In checkin-view.js, **addAndSort** method added to render timeline with latest checkin first.
- In geolocation.js, use [google info window](https://developers.google.com/maps/documentation/javascript/reference#InfoWindow) to render bubble.

### Add behaviour on button id **checkin-submit**
- search for // TODO 
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
3musket33rs PushManager is dealing with excluding "myself". In order to know in your code if you're the one triggering 
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
- in the bubble window, add an input of type **file** with id **input-checkin-photo**

### in checkin-view.js,
- on **checkin-submit** click send picture within the form
- modify **createListItemCustom** to display picture if present

### Get source code from repo
```java
git checkout step7_done
```

## Step8: Put all together
This step ** does not ** have a TO DO section.

You can rest a bit ;-)

### Get source code from repo
```java
git checkout step8_done
```
Here is what was done for you:

- in checkin-view.js, generated code has been cleaned to leave only what's needed
- place-index.html & user-index.html has been merge in a single page index.html
- place-view.js & user-view.js has been cleaned. 

## Step9: Login

### Get source code from repo
```java
git checkout step9_todo
```
You will get:
- in **index.html** a new section with id **login-page** has been added for the login form.
- checkin-model.js and checkin-controller.js new files

### MVC
3musket33rs includes a very easy custom MCV in JavaScript. As we've seen ealier this MCV catters for the default CRUD operations.
For exemple see the update flow explained below:


![3musket33rs MVC](https://github.com/fabricematrat/ThreeCircles/raw/master/imagesTutorial/mvc.png "3musket33rs MVC")

Most of the time those CRUD operations could be enough for your need. for now we have only extended the view 
in **checkin-view.js** file.

Now that we want to add a new operation to login. We need to extend Controller to do our cutom ajax call. 
In the case of login we are not interested in offline mode so we won't implement our feed method. 
Extending Controller is enough.
If we want to add data to the model (like let's say the firstname of the user logged)
we need to extend Model. 

![3musket33rs MVC](https://github.com/fabricematrat/ThreeCircles/raw/master/imagesTutorial/custom.png "3musket33rs MVC")

### CheckinController server side
In CheckinController.groovy:
- in login method: get user from params 
- if user not found or wrong password send error message
- if user found and password ok retrun all my checkins plus the one from my friends

### Custom view
In **index.html**:

- add a new anchar with id **logged-username**. This anchor will be used to display the firstname of the logged user.
- on button with id **submit-login** clicked submit login
- on callback, render the list as previously (**addAnsSort** method), refresh **logged-username** with firstname
 
### Custom Controller
In **checkin-controller.js**:

- add attached behaviour for **loginButtonClicked** event: this is the place where you actually do the ajax call.

### Custom Model
In **checkin-model.js**:

- register **logged** event
- in **login** method store firstname and list of checkins in the model

### Boostrap revisited
In Boostrap.groovy, register yourself with you name and password and add your friends too.

### Get source code from repo
```java
git checkout step9_done
```

## Step10: Display my friends

### Get source code from repo
```java
git checkout step10_todo
```

### Add sesssion
- in **CheckinController.groovy**, once logged store user insession
- in **UserController.groovy**, retrieve user and display only his friend to friend view.

### Get source code from repo
```java
git checkout step10_done
```

## Step11: In the Cloud
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
in settings.grrovy add your cloud foundry credentials
```
grails.plugin.cloudfoundry.username="..."
grails.plugin.cloudfoundry.password="..."
```
### Change your URL
in **configuration-bootstrap.js**, comment localhost URL, uncomment your cloud foundry one

Be creative and choose your own doamin name (we have already taken threecircles.cloudfoundry.com so do not try this one)
Change it here with fiverectangles.cloudfoundry.com or twobubbles.cloudfoundry.com, sixtriangles.cloudfoundry.com

```
threecircles.loadConfiguration = (function () {
    threecircles.configuration = {
        //baseURL: "http://localhost:8080/ThreeCircles/",
        //Uncomment before pushing to cloudfoundry
        baseURL: "http://ThreeCircles.cloudfoundry.com/",
        namespace: "threecircles",
        domain:[]
    };
})();
```
### Push to cloud foundry
Simply run the command
```
grails prod cf-push
```
When prompted for a domain name on cloudfoundry, use the one you choose just below.

## Step12: PhoneGap Build

### Configure your PhoneGap Build account
Sign up at [build.phonegap.com](http://build.phonegap.com)
### Config.groovy
```java
phonegapbuild.username="..."
phonegapbuild.password="..."
phonegapbuild.phonegapversion="2.3.0"
```

### Package you HTML and JS
Using [3musket33rs](http://3musket33rs.github.com/) PhoneGap Build plugin, simply go to
```java
http://localhost:8080/ThreeCircles/app/initBuild
```
Use the Push button and refresh from time to time. Once ready, use QRcode to download your app onto your phone on [PhoneGap build](http://build.phonegap.com)

## Step: Now Have FUN !!

![3musket33rs MVC](https://github.com/fabricematrat/ThreeCircles/raw/master/imagesTutorial/final_app.png "3musket33rs MVC")
