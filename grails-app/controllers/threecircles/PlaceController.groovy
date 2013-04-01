package threecircles



import grails.converters.JSON
import org.grails.datastore.mapping.validation.ValidationErrors
import org.springframework.dao.DataIntegrityViolationException
import org.codehaus.groovy.grails.commons.DefaultGrailsDomainClass

class PlaceController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index() {
        redirect(action: "list", params: params)
    }

    def list() {
      params.max = Math.min(params.max ? params.int('max') : 10, 100)
      render Place.list(params) as JSON
    }

    def save() {
      def jsonObject = JSON.parse(params.place)

      Place placeInstance = new Place(jsonObject)
      if (jsonObject.latitude && jsonObject.longitude) {
        placeInstance.longitude = Double.parseDouble(jsonObject.longitude)
        placeInstance.latitude = Double.parseDouble(jsonObject.latitude)
      } else {
        placeInstance.errors.reject( 'default.null.message', ['longitude,latitude', 'class Place'] as Object[], 'Property [{0}] of class [{1}] cannot be null')
        placeInstance.errors.rejectValue('longitude,latitude', 'default.null.message')
      }

      if (!placeInstance.save(flush: true)) {
        ValidationErrors validationErrors = placeInstance.errors
        render validationErrors as JSON
        return
      }

      def asJson = placeInstance as JSON
      event topic:"save-place", data: asJson.toString()
      render placeInstance as JSON
    }

    def show() {
      def placeInstance = Place.get(params.id)
      if (!placeInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'place.label', default: 'Place'), params.id])
        render flash as JSON
        return
      }

      render placeInstance as JSON
    }

    def update() {
      def jsonObject = JSON.parse(params.place)

      def placeInstance = Place.get(jsonObject.id)

      if (!placeInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'place.label', default: 'Place'), params.id])
        render flash as JSON
        return
      }

      if (jsonObject.version) {
        def version = jsonObject.version.toLong()
        if (placeInstance.version > version) {
          placeInstance.errors.rejectValue("version", "default.optimistic.locking.failure",
                                                           [message(code: 'place.label', default: 'Place')] as Object[],
                                                           "Another user has updated this Place while you were editing")
          ValidationErrors validationErrors = placeInstance.errors
          render validationErrors as JSON
          return
        }
      }

      Place placeReceived = new Place(jsonObject)

      new DefaultGrailsDomainClass(Place.class).persistentProperties.each() {
          if (it.oneToOne || it.embedded) {
            placeInstance[it.name] = it.type.get(jsonObject["${it.name}.id"])
          } else {
            placeInstance[it.name] = placeReceived[it.name]
          }
      }

      if (!placeInstance.save(flush: true)) {
        ValidationErrors validationErrors = placeInstance.errors
        render validationErrors as JSON
        return
      }

      def asJson = placeInstance as JSON
      event topic:"update-place", data: asJson.toString()
      render placeInstance as JSON
    }

    def delete() {
      def placeInstance = Place.get(params.id)

      if (!placeInstance) {
        flash.message = message(code: 'default.not.found.message', args: [message(code: 'place.label', default: 'Place'), params.id])
        render flash as JSON
        return
      }
      try {
        placeInstance.delete(flush: true)
      }
      catch (DataIntegrityViolationException e) {
        flash.message = message(code: 'default.not.deleted.message', args: [message(code: 'place.label', default: 'Place'), params.id])
        render flash as JSON
        return
      }

      event topic:"delete-place", data: placeInstance
      render placeInstance as JSON
    }

}
