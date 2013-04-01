import threecircles.User
import threecircles.Place
import threecircles.Comment
import threecircles.Checkin

class BootStrap {

    def init = { servletContext ->

        //-----------------------------------------------------------------------------
        // TODO create several users
        // To create a user, used named parameter
        // and saved it as below:
        // def myUser = new User(firstname: "Corinne", lastname: "Krych", username: 'me', enabled: true, password: 'password')
        // myUser.save()
        //
        // TODO the same for Place, Comment, Checkin
        // For Wein latitude:48.217349004974416, longitude: 16.407538767645292
        //
        // Do not forget to add a checkin for confess
        //-----------------------------------------------------------------------------
    }
    def destroy = {
    }
}
