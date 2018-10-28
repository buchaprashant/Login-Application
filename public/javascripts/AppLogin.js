$(function () {
    $('#loginButton').on('click', clickLogin);
    $('#cancelButton').on('click', clickCancel);
    $('.close').on('click', () => $('.alert').hide());

    function clickLogin() {
        unbindClickAndDisable();
        $('.alert').hide();
        var username = $('#username').val();
        var password = $('#password').val();
        if (username == "" || password == "") {
            showErrorAlert('Username/Password cannot contain be blank');
            bindClickAndEnable();
            return false;
        }
        var regex = /[\\/,.^]/g;
        if (username.match(regex) || password.match(regex)) {
            showErrorAlert('Username/Password cannot contain / \\ , . ^');
            bindClickAndEnable();
            return false;
        }

        $('#currentStatus').text('Logging In(Operation in Progress)');


        var xhr = new XMLHttpRequest();
        var url = "/users/login";
        xhr.open("POST", url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    $("#viewPort").load("profile?loadType=partial", function (response, status, xhr) {
                        $('#currentStatus').text(xhr.getResponseHeader('loginStatus'));
                        history.pushState('', 'Profile', '/users/profile');
                    });
                }
                else if (xhr.status === 401) {
                    showErrorAlert(JSON.parse(this.responseText).message);
                    bindClickAndEnable();
                    $('#currentStatus').text('Not Logged In');
                }
            }
        };
        var data = JSON.stringify({ username, password });
        xhr.send(data);
    }

    function clickCancel() {
        unbindClickAndDisable();
        $("#viewPort").load("/?loadType=partial", function (response, status, xhr) {
            $('#currentStatus').text(xhr.getResponseHeader('loginStatus'));
            history.pushState('', 'Home', '/');
        });
    }

    function unbindClickAndDisable() {
        $('#loginButton')
            .off('click')
            .prop('disabled', true)
            .css('cursor', 'not-allowed');
        $('#cancelButton')
            .off('click')
            .css('cursor', 'not-allowed')
            .addClass('disabled');

    }

    function bindClickAndEnable() {
        $('#loginButton')
            .on('click', clickLogin)
            .prop('disabled', false)
            .css('cursor', 'pointer');
        $('#cancelButton')
            .on('click', clickCancel)
            .css('cursor', 'pointer')
            .removeClass('disabled');
    }

    function showErrorAlert(errorMessage) {
        $('.errorMessage').text(errorMessage);
        $('.alert').show();
    }
});