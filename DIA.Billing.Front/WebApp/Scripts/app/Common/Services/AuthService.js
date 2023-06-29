//

angular.module("DialogBilling").service('AuthService', ['$cookies', '$location', 'LoginService', function ($cookieStore, $location, LoginService) {

    var _profile = "profile",
        _token = "token",
        _perm_block1 = "_perm_block1",
        _perm_block2 = "_perm_block2";

    var block1 = [];
    var block2 = [];
    var isLoading = false;


    var userIsAuthenticated = (localStorage.getItem('_profile') && $cookieStore.get(_token)) ? true : false;

    //set authentication [true/false]
    this.setAuthentication = function (value) {

        if (value === true) {
            userIsAuthenticated = true;
        } else {

            if (isLoading) {
                return;
            }

            if (!$cookieStore.get(_token)) {
                return;
            }

            localStorage.removeItem(_profile);
            $cookieStore.remove(_token, { domain: '.dialog.lk' });

            LoginService.logOutUser($cookieStore.get(_token)).then(function (response) {


            }, function () {

            });



            userIsAuthenticated = false;

            //userIsAuthenticated;

        }

        $location.path('/');

    };

    //check authentication
    this.isAuthenticated = function () {
        // return true;
        var _return = (($cookieStore.get(_token)) ? true : false);
        var pof = JSON.parse(localStorage.getItem(_profile));
        var tok = $cookieStore.get(_token);


        if (pof == null && tok) {

            if (isLoading) {
                return true;
            }
            console.log('try to profile');

            this.getPermissionByCode(tok);

        }
        else if (pof.token != tok) {
            this.getPermissionByCode(tok);
        }



        //if (!_return) { window.location = "index.html"; }
        if (!_return) { window.location = "http://dev01.dialog.lk:48460/app.html#/dashboard"; }//window.location = "index.html";
        return _return;
    };


    //get user profile
    this.getProfile = function () {
        return JSON.parse(localStorage.getItem(_profile));
    };


    //get tocken
    this.getTocken = function () {
        return $cookieStore.get(_token);
    };


    //set user profile & token
    this.setProfile = function (profile, token) {

        /*if($cookieStore.get(_profile)){
            $cookieStore.remove(_profile);
            $cookieStore.remove(_token);
        }*/
        // $cookieStore.put(_profile, profile);
        //  $cookieStore.put(_token, token);





        $cookieStore.put(_token, token, { domain: '.dialog.lk' });
        localStorage.setItem(_profile, JSON.stringify(profile));
        // $cookieStore.put(_token, token, {'expires': expireDate});

        // console.log('profile', profile, JSON.parse(localStorage.getItem(_profile)));

        //console.log(profile.permission, 'permission')

        //for (var i = 0; i < profile.permission.length; i++) {

        //    if (i < 250) {
        //        block1.push(profile.permission[i]);
        //    }
        //    else if (i < 500) {
        //        block2.push(profile.permission[i]);
        //    }

        //}
        //console.log(block1, block2, profile.permission.length, profile.permission);
        //$cookieStore.put(_perm_block1, block1);
        //$cookieStore.put(_perm_block2, block2);


        this.setAuthentication(true);

        setTimeout(function () {
            if (profile.redirectTo) {
                window.location = "app.html" + profile.redirectTo;
            } else {
                window.location = "app.html#/dashboard";
            }
        }, 500);

    };




    //set user permissions
    this.getPermissionByCode = function (token) {

        if (isLoading) {
            return;
        }
        isLoading = true;
        console.log('set to invoke');

        LoginService.whoImI(token).then(function (response) {


            $cookieStore.put(_token, response.data.Result.profile.token, { domain: '.dialog.lk' });
            localStorage.setItem(_profile, JSON.stringify(response.data.Result.profile));
            //  window.location = "http://www.gossiplankanews.com/";
            window.location = "http://dev01.dialog.lk:48460/app.html#/dashboard";
            location.reload();
            // this.setProfile(response.data.Result.profile, response.data.Result.profile.token);
            isLoading = false;

        }, function (response) {

        });

    };


    return this;

}]);