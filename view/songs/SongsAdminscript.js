const URL = "http://localhost:3000/songs";
$(document).ready(function () {
    const socket = io("http://localhost:3000");
    socket.on("new-song", (res) => {
        appendToSongsTable(res.song)
    })
    socket.on("deleted-song", (res) => {
        console.log("should be deleted");
        $(`#song-${res.song._id}`).remove();
    })
    socket.on("updated-song", (res) => {
        $(`#song-${res.song._id}`).remove();
        appendToSongsTable(res.song)
    });
    read_all()
})

$("#addButton").click(function (e) {
    e.preventDefault()
    createSong()
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
    findSongs();
})
function clearForm() {
    $("#name").val('')
    $("#author").val('')
    $("#rating").val('')
    $("#haveVideo").prop('checked', false)
    $("#link").prop('checked', false)
    $("#nameCB").prop('checked', false)
    $("#authorCB").prop('checked', false)
    $("#ratingCB").prop('checked', false)
    $("#haveVideoCB").prop('checked', false)
    $("#linkCB").prop('checked', false)
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
    var name = $("#name").val()
    var author = $("#author").val()
    var rating = $("#rating").val()
    var haveVideo = $("#haveVideo").is(":checked")
    var link = $("#link").val();
    if(link=="")
        link="null";
    const data = {
        name,
        author,
        rating,
        haveVideo,
        link
    }
    $.ajax({
        type: "POST",
        url: URL + '/',
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
function findSongs()
{
    var url2 = URL + "/";

    var name = undefined;
    var author = undefined;
    var haveVideo = undefined;

    const Isname = $("#nameCB").is(":checked");
    if(Isname == true){
        name = $("#name").val();
        url2 += "name/"+name+"/"
    }else{
        url2 += "name/"
    }

    const Isauthor = $("#authorCB").is(":checked");
    if(Isauthor == true){
        author = $("#author").val();
        url2 += "author/"+author+"/"
    }else{
        url2 += "author/"
    }
    const IshaveVideo = $("#haveVideoCB").is(":checked");
    if(IshaveVideo == true){
        haveVideo = $("#haveVideo").is(":checked");
        url2 += "haveVideo/"+haveVideo+"/"
    }else{
        url2 += "haveVideo/"
    }
    console.log("url: " + url2);
    console.log("name: "+name+"   author: "+author+"    haveVideo: "+haveVideo);

    $.ajax({
        type: "GET",
        url: url2,
        dataType: "json",
        success: function (res) {
            console.log("in the script")
            clearTable()
            console.dir(res)
            if(res != undefined){
                res.songs.forEach(appendToSongsTable)   
            }       
        },
        error: function (res) {
            alert(res.responseText)
        }
    });
}
function clearTable()
{
    $.ajax({
        type: "GET",
        url: URL,
        success: function (res) {
            res.songs.map(song => $(`#song-${song._id}`).remove());
        },
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
        <input type="string" id="newNameInput" value="${nameValue}">
        </td>
        <td id="newAuthor">
        <input type="string" id="newAuthorInput" value="${authorValue}">
        </td>
        <td id="newRating">
        <input type="number" id="newRatingInput" value="${ratingValue}" min="0" max="5"/>
        </td>
        <td id="newHaveVideo">
        <input type="checkbox" id="newHaveVideoInput" ${haveVideoValue}>
        </td>
        <td id="newLink">
        <input type="string" id="newLinkInput" value="${linkValue}" >
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
function createTrTag(song) {
    var tr = document.createElement("tr");

    tr.id = `song-${song._id}`;
    tr.appendChild(document.createElement("td").append(createInputTag(song.name)));
    tr.appendChild(createInputTag(song.author));
    tr.appendChild(createInputNumberTag(song.rating));
    tr.appendChild(createInputTextBoxTag(song.haveVideo));
    tr.appendChild(createInputTag(song.link));
    tr.appendChild(createInputTag(song.published));
    tr.appendChild(createButton("updateButton",song));
    tr.appendChild(createButton("deleteButton",song));
    return tr;
    
}
function createInputTag(param) {
    var InputTag = document.createElement("input");
    InputTag.value = param;
    return InputTag;
  }
function createInputNumberTag(param) {
    var InputTag = document.createElement("input");
    InputTag.type = "number";
    InputTag.value = param;
    return InputTag;
  }
function createInputTextBoxTag(param) {
    var InputTag = document.createElement("input");
    InputTag.type = "checkbox";
    InputTag.checked = param;
    return InputTag;
  }
  function createTD(param) {
    var td = document.createElement("td");
    td.name = "published";
    td.value = param;
    return td;
  }
function createButton(id,song)
{
    var button = document.createElement("td");
    button.id = id;
    button.class = "btn btn-update";
    if(id=="updateButton")
    {
        button.onclick = updateSong('${songId}');
        button.value = "UPDATE";
    }
    else if(id=="deleteButton")
    {
        button.onclick = deleteSong('${songId}');
        button.value = "DELETE";
    }
    return button;
}

