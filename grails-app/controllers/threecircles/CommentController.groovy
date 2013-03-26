package threecircles



import grails.converters.JSON
import org.grails.datastore.mapping.validation.ValidationErrors
import org.springframework.dao.DataIntegrityViolationException
import org.codehaus.groovy.grails.commons.DefaultGrailsDomainClass

class CommentController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index() {
        redirect(action: "list", params: params)
    }
	
    def list() {
      params.max = Math.min(params.max ? params.int('max') : 10, 100)
      render Comment.list(params) as JSON
    }

    def save() {
      def jsonObject = JSON.parse(params.comment)
      
      Comment commentInstance = new Comment(jsonObject)
      
      if (!commentInstance.save(flush: true)) {
        ValidationErrors validationErrors = commentInstance.errors
        render validationErrors as JSON
        return
      }
      
      event topic:"save-comment", data: commentInstance
      render commentInstance as JSON
    }
    
    def show() {
      def commentInstance = Comment.get(params.id)
      if (!commentInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'comment.label', default: 'Comment'), params.id])
        render flash as JSON
        return
      }
      
      render commentInstance as JSON
    }

    def update() {
      def jsonObject = JSON.parse(params.comment)

      def commentInstance = Comment.get(jsonObject.id)

      if (!commentInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'comment.label', default: 'Comment'), params.id])
        render flash as JSON
        return
      }

      if (jsonObject.version) {
        def version = jsonObject.version.toLong()
        if (commentInstance.version > version) {
          commentInstance.errors.rejectValue("version", "default.optimistic.locking.failure",
                                                           [message(code: 'comment.label', default: 'Comment')] as Object[],
                                                           "Another user has updated this Comment while you were editing")
          ValidationErrors validationErrors = commentInstance.errors
          render validationErrors as JSON
          return
        }
      }

      Comment commentReceived = new Comment(jsonObject)

      new DefaultGrailsDomainClass(Comment.class).persistentProperties.each() {
          if (it.oneToOne || it.embedded) {
            commentInstance[it.name] = it.type.get(jsonObject["${it.name}.id"])
          } else {
            commentInstance[it.name] = commentReceived[it.name]
          }
      }
      
      if (!commentInstance.save(flush: true)) {
        ValidationErrors validationErrors = commentInstance.errors
        render validationErrors as JSON
        return
      }
      
      event topic:"update-comment", data: commentInstance
      render commentInstance as JSON
    }

    def delete() {
      def commentInstance = Comment.get(params.id)
      
      if (!commentInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'comment.label', default: 'Comment'), params.id])
        render flash as JSON
        return
      }
      try {
        commentInstance.delete(flush: true)
      }
      catch (DataIntegrityViolationException e) {
        flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'comment.label', default: 'Comment'), params.id])
        render flash as JSON
        return
      }
      
      event topic:"delete-comment", data: commentInstance
      render commentInstance as JSON
    }
    
}
