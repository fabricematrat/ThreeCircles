package threecircles

class Checkin {
    String description
    Long when
    Place place
    User owner
    //-----------------------------------------------------------------------------
    //  TODO picture
    //-----------------------------------------------------------------------------


    static hasMany = [friends:User, comments:Comment]

    //-----------------------------------------------------------------------------
    //  TODO picture
    //-----------------------------------------------------------------------------
    static constraints = {

    }
}
