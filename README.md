Step by step tutorial for [ConFESS](https://2013.con-fess.com/)
--------------------------
This github repository holds all the step by step tutoreial to build a clone of Fousquare in a few minutes. 
The application we're going to build will be name ThreeCircle ;-)

Speakers
- [Corinne Krych](http://corinnekrych.github.com/)
- [Fabrice Matrat](http://fabricematrat.github.com/)
 
We're presenting you the work done by [3musket33rs](http://3musket33rs.github.com/) team.

## Step1: Scaffolding
### create-app
grails create-app ThreeCircles
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
        // http://support.cloudfoundry.com/entries/21014643-Grails-Spring-Security-deployment-problem
        // to fix cf/springsecurity issue
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

### Generate HRML5 scaffolding for both controller and views
```java
grails html-generate-all User
grails html-generate-all Place
grails html-generate-all Comment
grails html-generate-all Checkin
```
## Step2: Boostrap

In BootStrap.groovy
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

[Solution Step2](https://github.com/fabricematrat/solution_step2.md)

## Step3: Render timeline with mock picture

### 
```java

```
