const URL = "http://localhost:3000/songs";
$(document).ready(function () {
    const socket = io("http://localhost:3000");
    socket.on("new-song", (res) => {
        appendToSongsTable(res.song);
        $(`#chartsvg`).empty();
        read_chart();
        if(res.song.link!="null") {
            getLikes(res.song)
        }
        else
        {
            $(`#song-${song._id} #newLikes`)[0].innerText = 0;
        }
    })
    socket.on("deleted-song", (res) => {
        console.log("should be deleted");
        $(`#song-${res.song._id}`).remove();
        $(`#chartsvg`).empty();
        read_chart();
    });
    socket.on("updated-song", (res) => {
        $(`#song-${res.song._id}`).remove();
        appendToSongsTable(res.song)
        $(`#chartsvg`).empty();
        read_chart();
        if(res.song.link=="null") {
            $(`#song-${song._id} #newLikes`)[0].innerText = 0;
        }
        else
        {
            getLikes(res.song)
        }
    });
    read_all();
    read_chart();
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
    $("#likes").val('')
    $("#haveVideo").prop('checked', false)
    $("#link").val('')
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

function appendToSongsTable(song) {
    const likesValue = parseInt(song.likes)
    const nameValue = song.name
    const authorValue = song.author
    const haveVideoValue = song.haveVideo ? 'checked' : ''
    const linkValue = song.link
    const songId = String(song._id)
    if(song.link=="null"){
        $("#songsTable > tbody:last-child").append(`
        <tr id="song-${song._id}">
        <td id="newName">
        ${nameValue}
        </td>
        <td id="newAuthor">
        ${authorValue}
        </td>
        <td id="newLikes">
        ${likesValue}
        </td>
        <td id="newHaveVideo">
        ${song.haveVideo}
        </td>
        <td id="newLink">
        ${linkValue}
        </td>
        <td name="published">${song.published.slice(0,10).replace(/-/g, "/").split("/").reverse().join("/")}</td>
        </tr>
        `);
    }
    else
    {
        $("#songsTable > tbody:last-child").append(`
        <tr id="song-${song._id}">
        <td id="newName">
        ${nameValue}
        </td>
        <td id="newAuthor">
        ${authorValue}
        </td>
        <td id="newLikes">
        ${likesValue}
        </td>
        <td id="newHaveVideo">
        ${song.haveVideo}
        </td>
        <td id="newLink">
        <a href=${linkValue} style.color = "#ff0000">Click here for video</a>"
        </td>
        <td name="published">${song.published.slice(0,10).replace(/-/g, "/").split("/").reverse().join("/")}</td>
        </tr>
    `);
    }
    /*const songData = document.getElementById("song-data");

    const row = document.createElement("tr");

    row.setAttribute("id",`song-${song._id}`)
    
    const nameCell = document.createElement("td");
    nameCell.textContent = song.name;
    row.appendChild(nameCell);

    const authorCell = document.createElement("td");
    authorCell.textContent = song.author;
    row.appendChild(authorCell);

    var likesCell = document.createElement("td");
    likesCell.setAttribute("_id",`likesTD`)
    likesCell.textContent = song.likes;
    row.appendChild(likesCell);

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
        linkText.text = "no video available yet";
    }
    linkCell.appendChild(linkText);
    row.appendChild(linkCell);

    const publishedCell = document.createElement("td");
    publishedCell.textContent = song.published.slice(0,10).replace(/-/g, "/").split("/").reverse().join("/");
    row.appendChild(publishedCell);

    songData.appendChild(row);
    */
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
                const likes = response.items[0].statistics.likeCount;
                $(`#song-${song._id} #newLikes`)[0].innerText = likes;
            },
            error: function (error) {
                // Handle any errors here
                console.log(error);
            }
        });
    }