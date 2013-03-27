package threecircles

class Checkin {
    String description
    Long when
    Place place
    User owner
    byte[] photo

    static hasMany = [friends:User, comments:Comment]

    static constraints = {
        photo maxSize: 20*1024*1024, nullable: true
    }
}
