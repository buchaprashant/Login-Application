$(function () {
    $('#nextButton').on('click', clickNext);
    function clickNext() {
        $("#viewPort").load("/users/login?loadType=partial", function (response, status, xhr) {
            $('#currentStatus').text(xhr.getResponseHeader('loginStatus'));
            history.pushState('', 'Login', '/users/login');
        });
    }
});