const URL = "http://localhost:3000/users"

$("#logIn").click(function (e) {
    e.preventDefault()
    logIn()
})
function logIn()
{
    const email = $("#email").val()
    const password = $("#password").val()
    const data = {
        email,
        password
    }
    $.ajax({
        type: "POST",
        url: URL + '/auth',
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (res) {
            const {user} = res
            localStorage.setItem('token', res.token);
            console.log('innnnn')
            window.location.href = 'HomePage.html';
        },
        error: function (res) {
            alert(res.responseText)
        }
    });
}