const URL = "http://localhost:3000/users";
$(document).ready(function () {
    const socket = io("http://localhost:3000");
    socket.on("new-user", (res) => {
        appendToUsersTable(res.user)
    })
    socket.on("deleted-user", (res) => {
        console.log("should be deleted");
        $(`#user-${res.user._id}`).remove();
    })
    socket.on("updated-user", (res) => {
        $(`#user-${res.user._id}`).remove();
        appendToUsersTable(res.user)
    });
    read_all()
})

$("#addButton").click(function (e) {
    e.preventDefault()
    createUser()
})
$("#clearButton").click(function (e) {
    e.preventDefault()
    clearTable();
})
$("#showButton").click(function (e) {
    e.preventDefault()
    clearTable();
    read_all();
})
$("#findButton").click(function (e) {
    e.preventDefault()
    findUsers();
})
function clearForm() {
    $("#username").val('')
    $("#email").val('')
    $("#password").val('')
    $("#isAdmin").prop('checked', false)
    $("#usernameCB").prop('checked', false)
    $("#emailCB").prop('checked', false)
    $("#passwordCB").prop('checked', false)
    $("#isAdminCB").prop('checked', false)
}

function read_all() {
    $.ajax({
        type: "GET",
        url: URL,
        success: function (res) {
            res.users.map(appendToUsersTable)
        },
        error: function (res) {
            alert(res.responseText)
        }
    });
}

function deleteUser(userId) {
    $.ajax({
        type: "DELETE",
        url: URL + '/' + userId,
        success: function () {
            $(`#user-${userId}`).remove()
        },
        error: function (res) {
            alert(res.responseText)
        }
    });
}

function createUser() {
    var username = $("#username").val()
    var email = $("#email").val()
    var password = $("#password").val()
    var isAdmin = $("#isAdmin").is(":checked")
    const data = {
        username,
        email,
        password,
        isAdmin,
    }
    $.ajax({
        type: "POST",
        url: URL + '/',
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (res) {
            //appendToUsersTable(res.newUser)
            clearForm()
        },
        error: function (res) {
            alert(res.responseText)
        }
    });
}

function updateUser(userId) {
    const username = $(`#user-${userId} #newUserName #newUserNameInput`).val()
    const email = $(`#user-${userId} #newEmail #newEmailInput`).val()
    const password = $(`#user-${userId} #newPassword #newPasswordInput`).val()
    const isAdmin = $(`#user-${userId} #newIsAdmin #newIsAdminInput`).prop('checked')
    const data = {
        username,
        email,
        password,
        isAdmin,
    }
    console.log(data)
    $.ajax({
        type: "PUT",
        url: URL + '/' + userId,
        contentType: "application/json",
        data: JSON.stringify(data),
        error: function (res) {
            alert(res.responseText)
        }
    });
}
function findUsers()
{
    var url2 = URL + "/";

    var username = undefined;
    var email = undefined;
    var isAdmin = undefined;

    const Isusername = $("#usernameCB").is(":checked");
    if(Isusername == true){
        username = $("#username").val();
        url2 += "username/"+username+"/"
    }else{
        url2 += "username/"
    }

    const Isemail = $("#emailCB").is(":checked");
    if(Isemail == true){
        email = $("#email").val();
        url2 += "email/"+email+"/"
    }else{
        url2 += "email/"
    }
    const IsisAdmin = $("#isAdminCB").is(":checked");
    if(IsisAdmin == true){
        isAdmin = $("#isAdmin").is(":checked");
        url2 += "isAdmin/"+isAdmin+"/"
    }else{
        url2 += "isAdmin/"
    }
    console.log("url: " + url2);
    console.log("username: "+username+"   email: "+email+"    isAdmin: "+isAdmin);

    $.ajax({
        type: "GET",
        url: url2,
        dataType: "json",
        success: function (res) {
            console.log("in the script")
            clearTable()
            console.dir(res)
            if(res != undefined){
                res.users.forEach(appendToUsersTable)   
            }       
        },
        error: function (res) {
            alert(res.responseText)
        }
    });
}
async function clearTable()
{
    var table = document.getElementById("usersTable");
    var rowCount = table.rows.length;

    for (var i = rowCount - 1; i >= 1; i--) {
      table.deleteRow(i);
}
}
function appendToUsersTable(user) {
    const passwordValue = parseInt(user.password)
    const usernameValue = user.username
    const emailValue = user.email
    const isAdminValue = user.isAdmin ? 'checked' : ''
    const userId = String(user._id)
    $("#usersTable > tbody:last-child").append(`
        <tr id="user-${user._id}">
        <td id="newUserName">
        <input type="string" id="newUserNameInput" value="${usernameValue}">
        </td>
        <td id="newEmail">
        <input type="string" id="newEmailInput" value="${emailValue}">
        </td>
        <td id="newPassword">
        <input type="string" id="newPasswordInput" value="${passwordValue}" min="0" max="5"/>
        </td>
        <td id="newIsAdmin">
        <input type="checkbox" id="newIsAdminInput" ${isAdminValue}>
        </td>
        <td>
            <button id="updateButton" class="btn btn-update" onclick="updateUser('${userId}')">UPDATE</button>
        </td>
        <td>
            <button id="deleteButton" class="btn btn-delete" onclick="deleteUser('${userId}')">DELETE</button>
        </td>
        </tr>
    `);
    
}

