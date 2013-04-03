package threecircles

import grails.converters.deep.JSON
import org.grails.datastore.mapping.validation.ValidationErrors
import org.springframework.dao.DataIntegrityViolationException
import org.codehaus.groovy.grails.commons.DefaultGrailsDomainClass

class CheckinController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index() {
        redirect(action: "list", params: params)
    }

    def login() {
        def receivedUsername = params.j_username
        def receivedPassword = params.j_password

        def me = User.findByUsername(receivedUsername)
        if (me && receivedPassword == me.password) {
        //-----------------------------------------------------------------------------
        // TODO add user to session
        //-----------------------------------------------------------------------------
        session["user"] = me
        //-----------------------------------------------------------------------------
        // end of TODO add user to session
        //-----------------------------------------------------------------------------
        def listOfCheckins = Checkin.findAllByOwner(me)
        me.friends.each {
            def result = Checkin.findAllByOwner(it)
            if (result.size() > 0) {
                result.each { itt ->
                    listOfCheckins << itt
                }
            }
        }
        def builder = new groovy.json.JsonBuilder()
        def checkinsJSON = listOfCheckins as JSON
        def checkinString = checkinsJSON.toString()
        def info = builder {
            firstname me.firstname
            checkins checkinString
        }
        String builderString = builder.toString();
        render builderString
        } else {
           render "Error wrong username or password"
        }
    }

    def list() {
      params.max = Math.min(params.max ? params.int('max') : 10, 100)
      render Checkin.list(params) as JSON
    }

    def save() {
      def jsonObject = JSON.parse(params.checkin)

      // If place is not know by ThreeCircles, store it
      if (!jsonObject["place.id"]) {
          def placeJsonObject = jsonObject["place"]

          Place placeInstance = new Place(placeJsonObject)

          if (!placeInstance.save(flush: true)) {
              ValidationErrors validationErrors = placeInstance.errors
              render validationErrors as JSON
              return
          }
          jsonObject["place.id"] = placeInstance.id

      }


      def comments = []
      jsonObject.comments.each() {
         comments << Comment.get(it.id)
      }
      jsonObject.comments = null
      
      def friends = []
      jsonObject.friends.each() {
         friends << User.get(it.id)
      }
      jsonObject.friends = null
      
      Checkin checkinInstance = new Checkin(jsonObject)
      
      checkinInstance.comments = comments
      
      checkinInstance.friends = friends
      
      if (!checkinInstance.save(flush: true)) {
        ValidationErrors validationErrors = checkinInstance.errors
        render validationErrors as JSON
        return
      }

        def asJson = checkinInstance as JSON
        event topic:"save-checkin", data: asJson.toString()
        render checkinInstance as JSON
    }
    
    def show() {
      def checkinInstance = Checkin.get(params.id)
      if (!checkinInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'checkin.label', default: 'Checkin'), params.id])
        render flash as JSON
        return
      }
      
      render checkinInstance as JSON
    }

    def update() {
      def jsonObject = JSON.parse(params.checkin)

      def checkinInstance = Checkin.get(jsonObject.id)

      if (!checkinInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'checkin.label', default: 'Checkin'), params.id])
        render flash as JSON
        return
      }

      if (jsonObject.version) {
        def version = jsonObject.version.toLong()
        if (checkinInstance.version > version) {
          checkinInstance.errors.rejectValue("version", "default.optimistic.locking.failure",
                                                           [message(code: 'checkin.label', default: 'Checkin')] as Object[],
                                                           "Another user has updated this Checkin while you were editing")
          ValidationErrors validationErrors = checkinInstance.errors
          render validationErrors as JSON
          return
        }
      }

      Checkin checkinReceived = new Checkin(jsonObject)

      new DefaultGrailsDomainClass(Checkin.class).persistentProperties.each() {
          if (it.oneToOne || it.embedded) {
            checkinInstance[it.name] = it.type.get(jsonObject["${it.name}.id"])
          } else {
            checkinInstance[it.name] = checkinReceived[it.name]
          }
      }
      
      checkinInstance.comments = []
      jsonObject.comments.each() {
        checkinInstance.comments << Comment.get(it.id)
      }
      checkinInstance.friends = []
      jsonObject.friends.each() {
        checkinInstance.friends << User.get(it.id)
      }
      if (!checkinInstance.save(flush: true)) {
        ValidationErrors validationErrors = checkinInstance.errors
        render validationErrors as JSON
        return
      }
      
      def asJson = checkinInstance as JSON
      event topic:"update-checkin", data: asJson.toString()
      render checkinInstance as JSON
    }

    def delete() {
      def checkinInstance = Checkin.get(params.id)
      
      checkinInstance.comments.each() {
        Comment.get(it.getId());
      }
      
      checkinInstance.friends.each() {
        User.get(it.getId());
      }
      
      if (!checkinInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'checkin.label', default: 'Checkin'), params.id])
        render flash as JSON
        return
      }
      try {
        checkinInstance.delete(flush: true)
      }
      catch (DataIntegrityViolationException e) {
        flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'checkin.label', default: 'Checkin'), params.id])
        render flash as JSON
        return
      }
      
      event topic:"delete-checkin", data: checkinInstance
      render checkinInstance as JSON
    }
    
}
