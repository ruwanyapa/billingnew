//

angular.module("UserManagement").service("CreateUsersService", ["$http", "appConfig", function ($http, appConfig)
{

    return {

        //Save User
        Create: function (credentials)
        {
            return $http.post(appConfig.API_URL + "Users/PostUser", credentials);
        },
        //Update User
        Update: function (credentials)
        {
            return $http.post(appConfig.API_URL + "Users/PostUpdateUser", credentials);
        },
        //Delete User
        Remove: function (credentials)
        {
            return $http.delete(appConfig.API_URL + "Users/CreateUsers", { params: { userId: credentials.userId } });
        },
        //Get User
        getUser: function (userId, AccountType)
        {
            return $http.get(appConfig.API_URL + "Users/GetUser/" + userId + "/" + AccountType); 
        },
        

        //Get Validate Massage ... Chech Valid User and Password
        Create1: function (UserPassword, UserID)
        {
            return $http.get(appConfig.API_URL + "Users/ValidUsedIdAndPassword/" + UserPassword + "/" + UserID);
        },

        getDomainUser: function (userId) {
            return $http.get(appConfig.API_URL + "Users/GetDomainUser/" + userId);
            
         }

   
    };

}]);