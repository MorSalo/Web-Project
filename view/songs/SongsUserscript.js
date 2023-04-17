const URL = "http://localhost:3000/songs";
$(document).ready(function () {
    const socket = io("http://localhost:3000");
    socket.on("new-song", (res) => {
        appendToSongsTable(res.song)
    })
    socket.on("deleted-song", (res) => {
        console.log("should be deleted");
        $(`#song-${res.song._id}`).remove();
    });
    read_all()
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
    findSongs();
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

function appendToSongsTable(song) {
    const songData = document.getElementById("song-data");

    const row = document.createElement("tr");

    row.setAttribute("id",`song-${song._id}`)
    
    const nameCell = document.createElement("td");
    nameCell.textContent = song.name;
    row.appendChild(nameCell);

    const authorCell = document.createElement("td");
    authorCell.textContent = song.author;
    row.appendChild(authorCell);

    const ratingCell = document.createElement("td");
    ratingCell.textContent = song.rating;
    row.appendChild(ratingCell);

    const haveVideoCell = document.createElement("td");
    haveVideoCell.textContent = song.haveVideo;
    row.appendChild(haveVideoCell);

    var linkCell = document.createElement("td");
    var linkText = document.createElement("a");
    if(song.link!="null"){
        linkText.setAttribute('href',song.link);
        linkText.text = "click here for video";
        linkText.style.color = "#ff0000";  
    }
    else
    {
        linkText.text = song.link;
    }
    linkCell.appendChild(linkText);
    row.appendChild(linkCell);

    const publishedCell = document.createElement("td");
    publishedCell.textContent = song.published.slice(0,10).replace(/-/g, "/").split("/").reverse().join("/");;
    row.appendChild(publishedCell);

    songData.appendChild(row);
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
            clearTable()
            console.log("in the script")
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
    var table = document.getElementById("songsTable");
    var rowCount = table.rows.length;

    for (var i = rowCount - 1; i >= 1; i--) {
      table.deleteRow(i);
    }
}