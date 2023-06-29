//

angular.module("UserManagement").service("CreateUsersGroupsService", ["$http", "appConfig", function($http, appConfig) {

    return {
        formLoad: function (moduleId) {

            if (moduleId=="" || moduleId==undefined) {
                moduleId = 0;
            }
            return $http.get(appConfig.API_URL + "PermissionGroups/FormLoad/" + moduleId);
        },
        //Save User
        /*create: function(credentials) {
            return $http(appConfig.API_URL + "PermissionGroups/", credentials);
        },*/
        //Get User
        /*read: function(credentials) {
            return $http(appConfig.API_URL + "PermissionGroups", { params: { userId: credentials.userId } });
        },*/
        //Update User
        update: function(credentials) {
            return $http.post(appConfig.API_URL + "PermissionGroups", credentials);
        },
        //Delete User
        remove: function(credentials) {
            return $http.delete(appConfig.API_URL + "PermissionGroups", { params: { userId: credentials.userId } });
        },

        loadGroupsByModuleId: function(credentials) {
            return $http.get(appConfig.API_URL + "PermissionGroups/LoadGroupsByModuleId/" + credentials);
        },

        loadGroupsByInterfaceId: function (interfaceCode,groupCode) {
            return $http.get(appConfig.API_URL + "PermissionGroups/LoadGroupsByInterfaceId/" + interfaceCode + "/" + groupCode);
        },

        GetUserGroups: function(interfaceCode) {
            return $http.get(appConfig.API_URL + "PermissionGroups/LoadGroupsByInterfaceId/" + interfaceCode);
        },

        PostUserGroupPermissions: function(credentials) {
            return $http.post(appConfig.API_URL + "Permissions/PostUserGroupPermission", credentials);
        },

        getPermissionGroupsByGroupCode: function (credentials) {
            return $http.get(appConfig.API_URL + "PermissionGroups/GetPermissionGroupsByGroupCode/"+ credentials);
        },

        getSystemModulesByUserGroupId: function (groupId) {
            return $http.get(appConfig.API_URL + "Permissions/GetSystemModulesByUserGroupId/" + groupId);
        },

        GetPermissionByUserGroupId: function (userGroupId) {

            if (userGroupId == "" || userGroupId == undefined) {
                userGroupId = 0;
            }
            return $http.get(appConfig.API_URL + "PermissionGroups/GetPermissionByUserGroupId/" + userGroupId);
        },

        GetSelectedPermissionsByUserGroupId: function (userGroupId, moduleId, interfaceId, permissionDescription) {

            if (userGroupId == "" || userGroupId == undefined) {
                userGroupId = 0;
            }
            return $http.get(appConfig.API_URL + "PermissionGroups/GetSelectedPermissionsByUserGroupId/" + userGroupId + "/" + moduleId + "/" + interfaceId + "/" + permissionDescription);
        },

        GetSystemInterfacesByUserId: function () {
            return $http.get(appConfig.API_URL + "PermissionGroups/GetSystemInterfacesByUserId");
        },
        
        Search: function (modeule, interfacecode, id) {
            return $http.get(appConfig.API_URL + "Permissions/FilterPermissionGrid/" + modeule + "/" + interfacecode + "/" + id);
        },
        
        SearchViaKeyWord: function (serchKey) {
            return $http.post(appConfig.API_URL + "Permissions/FilterPermissionByKeyWord", serchKey);
        },
       
        FilterIterfaceByModeule: function (modeule) {
            return $http.get(appConfig.API_URL + "Permissions/FilterInterface/" + modeule);
        },

       
    };
}]);