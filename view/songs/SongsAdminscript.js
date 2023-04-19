const URL = "http://localhost:3000/songs";
// Import the Twitter library
var Twitter = require('twitter');
const client = new Twitter({
  consumer_key: 'u0Z9fky4EN0piQ3bwJWlCtlCa',
  consumer_secret: 'xPXzSY2wOudm4dpRDLUz9CO3CMTN2vD0CjDmodCBATV9dKytS5',
  access_token_key: '1648417416337055745-FQpWqnRJ75tO1f7MtsUFnaVSLQt8zp',
  access_token_secret: 'I8T00IDw9QO4c8LSQaCcbNjE9dH2gSsAKPRlEzZAItisI'
});

$(document).ready(function () {
    const socket = io("http://localhost:3000");
    socket.on("new-song", (res) => {
        appendToSongsTable(res.song)
        $(`#chartsvg`).empty();
        read_chart();
        if(res.song.link!="null") {
            getLikes(res.song)
        }
        else
        {
            $(`#song-${song._id} #newLikes #newLikesInput`).val(0);
        }
    })
    socket.on("deleted-song", (res) => {
        console.log("should be deleted");
        $(`#song-${res.song._id}`).remove();
        $(`#chartsvg`).empty();
        read_chart();
    })
    socket.on("updated-song", (res) => {
        $(`#song-${res.song._id}`).remove();
        appendToSongsTable(res.song)
        $(`#chartsvg`).empty();
        read_chart();
        if(res.song.link=="null") {
            $(`#song-${song._id} #newLikes #newLikesInput`).val(0);
        }
        else
        {
            getLikes(res.song)
        }
    });
    read_all();
    read_chart();
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
    $("#likes").val('')
    $("#haveVideo").prop('checked', false)
    $("#link").prop('checked', false)
    $("#nameCB").prop('checked', false)
    $("#authorCB").prop('checked', false)
    $("#likesCB").prop('checked', false)
    $("#haveVideoCB").prop('checked', false)
    $("#linkCB").prop('checked', false)
}

function read_all() {
    $.ajax({
        type: "GET",
        url: URL,
        success: function (res) {
            res.songs.map(appendToSongsTable)
            const songsWithLinks = res.songs.filter(song => song.link !== "null")
            for (let i = 0; i < songsWithLinks.length; i++) {
                getLikes(songsWithLinks[i])
            }
        },
        error: function (res) {
            alert(res.responseText)
        }
    });
}
function read_chart() {
    $.ajax({
        type: "GET",
        url: URL+'/chart',
        success: function (res) {
            statistics(res.songs)        
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
    var likes = 0;
    var haveVideo = $("#haveVideo").is(":checked")
    var link = $("#link").val();
    if(link=="")
        link="null";
    const data = {
        name,
        author,
        likes,
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
            PostMessageToTwitter(name,author)
        },
        error: function (res) {
            alert(res.responseText)
        }
    });
}

function updateSong(songId) {
    const name = $(`#song-${songId} #newName #newNameInput`).val()
    const author = $(`#song-${songId} #newAuthor #newAuthorInput`).val()
    const likes = $(`#song-${songId} #newLikes #newLikesInput`).val()
    const haveVideo = $(`#song-${songId} #newHaveVideo #newHaveVideoInput`).prop('checked')
    const link = $(`#song-${songId} #newLink #newLinkInput`).val()
    const data = {
        name,
        author,
        likes,
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
    var table = document.getElementById("songsTable");
    var rowCount = table.rows.length;

    for (var i = rowCount - 1; i >= 1; i--) {
      table.deleteRow(i);
    }
}
function appendToSongsTable(song) {
    const likesValue = 0
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
        <td id="newLikes">
        <input type="string" id="newLikesInput" value="${likesValue}" disabled/>
        </td>
        <td id="newHaveVideo">
        <input type="checkbox" id="newHaveVideoInput" ${haveVideoValue}>
        </td>
        <td id="newLink">
        <input type="string" id="newLinkInput" value="${linkValue}" >
        </td>
        <td name="published">${song.published.slice(0,10).replace(/-/g, "/").split("/").reverse().join("/")}</td>
        <td>
            <button id="updateButton" class="btn btn-update" onclick="updateSong('${songId}')">UPDATE</button>
        </td>
        <td>
            <button id="deleteButton" class="btn btn-delete" onclick="deleteSong('${songId}')">DELETE</button>
        </td>
        </tr>
    `);
}
function statistics(data){

    // Create the SVG element
        const svg = d3.select('#chartsvg');
    
    // Set the chart's dimensions
        const margin = { top: 20, right: 20, bottom: 40, left: 50 };
        const width = 600 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;
    
    // Set the scale for the chart
        const xScale = d3.scaleBand()
            .domain(data.map(d => d._id))
            .range([0, width])
            .padding(0.1);
    
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.count)])
            .range([height, 0]);
    
    // Create the chart
        const chart = svg.append('g')
            .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
        chart.selectAll('rect')
            .data(data)
            .enter()
            .append('rect')
            .attr('x', d => xScale(d._id))
            .attr('y', d => yScale(d.count))
            .attr('width', xScale.bandwidth())
            .attr('height', d => height - yScale(d.count))
            .attr('fill', 'steelblue');
    
        chart.selectAll('text')
            .data(data)
            .enter()
            .append('text')
            .attr('x', d => xScale(d._id) + xScale.bandwidth() / 2)
            .attr('y', d => yScale(d.count) - 5)
            .attr('text-anchor', 'middle')
            .text(d => d.count);
    
    // Add the x-axis label
        chart.append('text')
            .attr('x', width / 2)
            .attr('y', height + margin.bottom)
            .attr('text-anchor', 'middle')
            .text('Artist');
    
    // Add the x-axis
        chart.append('g')
            .attr('transform', `translate(0, ${height})`)
            .call(d3.axisBottom(xScale));
    
    // Add the y-axis label
        chart.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -170)
            .attr('y', -32)
            .attr('text-anchor', 'middle')
            .text('Number of songs');
    
    // Add the y-axis
        chart.append('g')
            .call(d3.axisLeft(yScale));
    
    }
    async function getLikes(song) {
        const VIDEO_ID = song.link.slice(32)
        const Youtube_Api_Super_Secret_Noams_Key='AIzaSyCe6UgRnWDYgz2_IrOz-uvOA7IAjxFsihM'
        const apiUrl = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${VIDEO_ID}&key=${Youtube_Api_Super_Secret_Noams_Key}`;
        $.ajax({
            url: apiUrl,
            method: 'GET',
            success: function (response) {
                const likes = response.items[0].statistics.likeCount
                $(`#song-${song._id} #newLikes #newLikesInput`).val(likes);
            },
            error: function (error) {
                // Handle any errors here
                console.log(error);
            }
        });
    }



function PostMessageToTwitter(song_name, author){
// Define the tweet content
const message = "'" + song_name + "' has been added by " + "'" + author + "'";
const tweet = {
  status: message
};

// Post the tweet
client.post('statuses/update', tweet,  function(error, tweet, response) {
    if(error) throw error;
    console.log(tweet);  // Tweet body.
    console.log(response);  // Raw response object.
  });
}
    