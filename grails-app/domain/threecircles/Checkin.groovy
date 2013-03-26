package threecircles

class Checkin {
    String description
    Long when
    Place place
    User owner

    static hasMany = [friends:User, comments:Comment]

    static constraints = {
    }
}
