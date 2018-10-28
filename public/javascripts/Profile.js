$(function () {
    $('#logoutButton').on('click', clickLogout);
    $('.close').on('click', () => $('.alert').hide());

    function clickLogout() {
        $('.alert').hide();
        $('#currentStatus').text('Logging Out(Operation in progress)');
        unbindClickAndDisable();

        var xhr = new XMLHttpRequest();
        var url = "/users/logout";
        xhr.open("POST", url, true);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {                    
                    $("#viewPort").load("/?loadType=partial", function (response, status, xhr) {
                        $('#currentStatus').text(xhr.getResponseHeader('loginStatus'));
                        history.pushState('', 'Home', '/');
                    });
                }
                else {
                    showErrorAlert("Something went wrong. Please try again.");
                    bindClickAndEnable();
                }
            }
        };
        xhr.send(null);
    }

    function unbindClickAndDisable() {
        $('#logoutButton')
            .off('click')
            .prop('disabled', true)
            .css('cursor', 'not-allowed');
    }

    function bindClickAndEnable() {
        $('#logoutButton')
            .on('click', clickLogout)
            .prop('disabled', false)
            .css('cursor', 'pointer');
    }

    function showErrorAlert(errorMessage) {
        $('.errorMessage').text(errorMessage);
        $('.alert').show();
    }
});