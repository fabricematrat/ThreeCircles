package threecircles



import grails.converters.deep.JSON
import org.grails.datastore.mapping.validation.ValidationErrors
import org.springframework.dao.DataIntegrityViolationException
import org.codehaus.groovy.grails.commons.DefaultGrailsDomainClass

class UserController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index() {
        redirect(action: "list", params: params)
    }
	
    def list() {
       if (session["user"]) {
           def usernameFormSession = session["user"].username
           def me = User.findByUsername(usernameFormSession)
           render me.friends as JSON
       }  else {
           render User.list() as JSON
       }
     }

    def save() {
      def jsonObject = JSON.parse(params.user)
      
      def friends = []
      jsonObject.friends.each() {
         friends << User.get(it.id)
      }
      jsonObject.friends = null

      User userInstance = new User(jsonObject)
      
      userInstance.friends = friends

      if (!userInstance.save(flush: true)) {
        ValidationErrors validationErrors = userInstance.errors
        render validationErrors as JSON
        return
      }
      
      def asJson = userInstance as JSON
      event topic:"save-user", data: asJson.toString()
      render userInstance as JSON
    }
    
    def show() {
      def userInstance = User.get(params.id)
      if (!userInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), params.id])
        render flash as JSON
        return
      }
      
      render userInstance as JSON
    }

    def update() {
      def jsonObject = JSON.parse(params.user)

      def userInstance = User.get(jsonObject.id)

      if (!userInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), params.id])
        render flash as JSON
        return
      }

      if (jsonObject.version) {
        def version = jsonObject.version.toLong()
        if (userInstance.version > version) {
          userInstance.errors.rejectValue("version", "default.optimistic.locking.failure",
                                                           [message(code: 'user.label', default: 'User')] as Object[],
                                                           "Another user has updated this User while you were editing")
          ValidationErrors validationErrors = userInstance.errors
          render validationErrors as JSON
          return
        }
      }

      User userReceived = new User(jsonObject)

      new DefaultGrailsDomainClass(User.class).persistentProperties.each() {
          if (it.oneToOne || it.embedded) {
            userInstance[it.name] = it.type.get(jsonObject["${it.name}.id"])
          } else {
            userInstance[it.name] = userReceived[it.name]
          }
      }
      
      userInstance.friends = []
      jsonObject.friends.each() {
        userInstance.friends << User.get(it.id)
      }
      if (!userInstance.save(flush: true)) {
        ValidationErrors validationErrors = userInstance.errors
        render validationErrors as JSON
        return
      }
      
      def asJson = userInstance as JSON
      event topic:"update-user", data: asJson.toString()
      render userInstance as JSON
    }

    def delete() {
      def userInstance = User.get(params.id)
      
      userInstance.friends.each() {
        User.get(it.getId());
      }

      if (!userInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'user.label', default: 'User'), params.id])
        render flash as JSON
        return
      }
      try {
        userInstance.delete(flush: true)
      }
      catch (DataIntegrityViolationException e) {
        flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'user.label', default: 'User'), params.id])
        render flash as JSON
        return
      }
      
      event topic:"delete-user", data: userInstance
      render userInstance as JSON
    }
    
}
