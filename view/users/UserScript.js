const URL = "http://localhost:3000/users"

$("#addButton").click(function (e) {
    e.preventDefault()
    createUser()
})
function createUser() {
    const username = $("#username").val()
    const email = $("#email").val()
    const password = $("#password").val()
    const data = {
        username,
        email,
        password
    }
    $.ajax({
        type: "POST",
        url: URL + '/',
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (res) {
            clearUserForm()
        },
        error: function (res) {
            alert(res.responseText)
        }
    });
}
function clearUserForm() {
    $("#username").val('')
    $("#email").val('')
    $("#password").val('')
}