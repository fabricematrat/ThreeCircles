package threecircles

class Checkin {
    String description
    Long when
    Place place
    User owner
    //-----------------------------------------------------------------------------
    //  TODO picture
    //-----------------------------------------------------------------------------
    byte[] photo

    static hasMany = [friends:User, comments:Comment]

    //-----------------------------------------------------------------------------
    //  TODO picture
    //-----------------------------------------------------------------------------
    static constraints = {
        photo maxSize: 20*1024*1024, nullable: true
    }
}
