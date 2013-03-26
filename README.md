Step by step tutorial for [ConFESS](https://2013.con-fess.com/)
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
-	web-app/img/
-	web-app/index_mock.html
-	web-app/js/my.js

### Main page: timeline
- delete index.html
- rename checkin-index.html into index.html

### Transform your index.html with css
- add import css file (search for //TODO CSS)
- In section with id "section-list-checkin" add header as shown in index-mockup.html (search for //TODO timeline view)
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
### Add JS file timeline.js
- note 3muket33rs 
-  (search for //TODO )

### Get source code from repo
```java
git checkout step4_done
```


