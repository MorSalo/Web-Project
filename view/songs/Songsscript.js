const URL = "http://localhost:3000/songs";
const socket = io("http://localhost:3000");
socket.on("new-song", (res) => {
    appendToSongsTable(res.song)
});
socket.on("deleted-song", (res) => {
    console.log("should be deleted");
    $(`#song-${res.song._id}`).remove();
});
$(document).ready(function () {
    read_all()
})

$("#addButton").click(function (e) {
    e.preventDefault()
    createSong()
})

function clearForm() {
    $("#name").val('')
    $("#author").val('')
    $("#rating").val('')
    $("#haveVideo").prop('checked', false)
    $("#link").val('')
}

function read_all() {
    $.ajax({
        type: "GET",
        url: URL,
        success: function (res) {
            res.songs.map(appendToSongsTable)
        },
        error: function (res) {
            alert(res.responseText)
        }
    });
}

function deleteSong(songId) {
    $.ajax({
        type: "DELETE",
        url: URL + '/' + songId,
        success: function () {
            $(`#song-${songId}`).remove()
        },
        error: function (res) {
            alert(res.responseText)
        }
    });
}

function createSong() {
    const name = $("#name").val()
    const author = $("#author").val()
    const rating = $("#rating").val()
    const haveVideo = $("#haveVideo").is(":checked")
    const link = $("#link").val();

    const data = {
        name,
        author,
        rating,
        haveVideo,
        link
    }
    $.ajax({
        type: "POST",
        url: URL,
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (res) {
            //appendToSongsTable(res.newSong)
            clearForm()
        },
        error: function (res) {
            alert(res.responseText)
        }
    });
}

function updateSong(songId) {
    const name = $(`#song-${songId} #newName #newNameInput`).val()
    const author = $(`#song-${songId} #newAuthor #newAuthorInput`).val()
    const rating = $(`#song-${songId} #newRating #newRatingInput`).val()
    const haveVideo = $(`#song-${songId} #newHaveVideo #newHaveVideoInput`).prop('checked')
    const link = $(`#song-${songId} #newLink #newLinkInput`).val()
    const data = {
        name,
        author,
        rating,
        haveVideo,
        link
    }
    console.log(data)
    $.ajax({
        type: "PUT",
        url: URL + '/' + songId,
        contentType: "application/json",
        data: JSON.stringify(data),
        error: function (res) {
            alert(res.responseText)
        }
    });
}

function appendToSongsTable(song) {
    const ratingValue = parseInt(song.rating)
    const nameValue = song.name
    const authorValue = song.author
    const haveVideoValue = song.haveVideo ? 'checked' : ''
    const linkValue = song.link
    const songId = String(song._id)
    $("#songsTable > tbody:last-child").append(`
        <tr id="song-${song._id}">
        <td id="newName">
        <input type="string" id="newNameInput" value=${nameValue}>
        </td>
        <td id="newAuthor">
        <input type="string" id="newAuthorInput" value=${authorValue}>
        </td>
        <td id="newRating">
        <input type="number" id="newRatingInput" value=${ratingValue} min="0"/>
        </td>
        <td id="newHaveVideo">
        <input type="checkbox" id="newHaveVideoInput" ${haveVideoValue}>
        </td>
        <td id="newLink">
        <input type="string" id="newLinkInput" value=${linkValue}>
        </td>
        <td name="published">${song.published}</td>
        <td>
            <button id="updateButton" class="btn btn-update" onclick="updateSong('${songId}')">UPDATE</button>
        </td>
        <td>
            <button id="deleteButton" class="btn btn-delete" onclick="deleteSong('${songId}')">DELETE</button>
        </td>
        </tr>
    `);
}

