var threecircles = threecircles || {};

threecircles.loadConfiguration = (function () {
    threecircles.configuration = {
        baseURL: "http://localhost:8080/ThreeCircles/",
        //Uncomment before pushing to cloudfoundry
        //baseURL: "http://ThreeCircles.cloudfoundry.com/",
        namespace: "threecircles",
        domain:[]
        ,
        on401: function() {
            $.mobile.changePage($('#login-page'));
        }
    };
})();

