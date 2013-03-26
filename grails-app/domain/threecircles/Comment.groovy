package threecircles

class Comment {
    String text
    User user
    static constraints = {
        text type: 'text', maxSize: 15000
    }
}
