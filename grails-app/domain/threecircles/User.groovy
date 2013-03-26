package threecircles

class User {
    String firstname
    String lastname
    String username
    String password

    static hasMany = [friends:User]

    static constraints = {
    }
}
