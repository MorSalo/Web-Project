const URL = "http://localhost:3000/branches"
const branchesController = require('../module/branches');
$(document).ready(function () {
    read_all()
})

$("#addButton").click(function (e) {
    e.preventDefault()
    createBranch()
})
//TODO: I need to figure out how to take the id o the song without showing it on the doc
$("#deleteButton").click(function (e) {
    e.preventDefault()
    deleteBranch($("#Id").val())
})
$("#updatebutton").click(function (e) {
    e.preventDefault()
    updateBranch($("#Id").val())
})
$("#showButton").click(function (e) {
    e.preventDefault()
    const branchData = document.getElementById("branch-data");

fetch("/branches")
  .then(response => response.json())
  .then(data => {
    data.forEach(appendToBranchTable)
        //branch => {

    //     //appendToBranchTable(branch)

    //   const row = document.createElement("tr");

    //   const IdCell = document.createElement("td");
    //   IdCell.textContent = branch._id;
    //   row.appendChild(IdCell);
      
    //   const cityCell = document.createElement("td");
    //   cityCell.textContent = branch.city;
    //   row.appendChild(cityCell);

    //   const addressCell = document.createElement("td");
    //   addressCell.textContent = branch.address;
    //   row.appendChild(addressCell);

    //   const yearsCell = document.createElement("td");
    //   yearsCell.textContent = branch.years;
    //   row.appendChild(yearsCell);

    //   const openCell = document.createElement("td");
    //   openCell.textContent = branch.open;
    //   row.appendChild(openCell);

    //   branchData.appendChild(row);
    // });
  });

    // const showBranchBtn = document.getElementById("showButton");
    // const songBranch = document.getElementById("branch-list");
    // const 
    // for (const branch of branchesController.branch) {
    //     const songItem = document.createElement("li");
    //     songItem.innerHTML = `
    //     <b>Title:</b> ${song.title} <br>
    //     <b>Author:</b> ${song.author} <br>
    //     <b>Length:</b> ${song.length}
    //     <b>Rate:</b> ${song.rate} seconds
    //     `;
    //     songList.appendChild(songItem);
    // }
})

function clearForm() {
    $("#Id").val('')
    $("#city").val('')
    $("#address").val('')
    $("#years").val('')
    $("#open").prop('checked', false)
}

function read_all() {
    $.ajax({
        type: "GET",
        url: URL,
        dataType: "json",
        success: function (res) {
            //not sure that it will work bc i work with shcema an d not array
            res.branch.forEach(appendToBranchTable)
            //appendToBranchTable(res.bra)
            
        },
        error: function (res) {
            alert(res.responseText)
        }
    });
}

function deleteBranch(branchId) {
    $.ajax({
        type: "DELETE",
        url: URL + '/' + branchId,
        success: function () {
            $(`#branch-${branchId}`).remove()
        },
        error: function (res) {
            alert(res.responseText)
        }
    });
}

function createBranch() {
    const city = $("#city").val()
    const years = $("#years").val()
    const address = $("#address").val()
    const open = $("#open").is(":checked")
    const data = {
        city,
        years,
        address,
        open
    }
    $.ajax({
        type: "POST",
        url: URL + '/',
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function (res) {
            //return in the controller ad the services always the new json object
            appendToSongsTable(res.branch)
            clearForm()
        },
        error: function (res) {
            alert(res.responseText)
        }
    });
}

function updateBranch(branchId) {
    const city = $("#city").val();
    const address = $("#address").val();
    const years = $("#years").val();
    const open = $("#open").is(":checked");
  
    const data = {
      city,
      address,
      years,
      open
    };
  
    $.ajax({
      type: "PUT",
      url: URL + '/' + branchId,
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (res) {
        // Update the corresponding HTML element with the updated branch data
        const updatedBranch = res.branch;
        const $branchRow = $(`#branch-${branchId}`);
        $branchRow.find(".city").text(updatedBranch.city);
        $branchRow.find(".address").text(updatedBranch.address);
        $branchRow.find(".years").text(updatedBranch.years);
        $branchRow.find(".open").text(updatedBranch.open ? "Yes" : "No");
      },
      error: function (res) {
        alert(res.responseText)
      }
    });
}
  
      


// function appendToSongsTable(song) {
//     const value = parseInt(song.rating)
//     $("#songsTable > tbody:last-child").append(`
//         <tr id="song-${song.id}">
//             <td name="id">${song.id}</td>
//             <td name="name">${song.name}</td>
//             <td name="author">${song.author}</td>
//             <td id="newRating">
//             <input type="number" id="newRatingInput" value=${value} min="0"/>
//             </td>
//             <td name="haveVideo">${song.haveVideo}</td>
//             <td name="published">${song.published}</td>
//             <td>
//                 <button id="updateButton" class="btn btn-update" onclick="updateSong(${song.id})">UPDATE</button>
//             </td>
//             <td>
//                 <button id="deleteButton" class="btn btn-delete" onclick="deleteSong(${song.id})">DELETE</button>
//             </td>
//         </tr>
//     `);
// }

function appendToBranchTable(branch) {
    const branchData = document.getElementById("branch-data");

    const row = document.createElement("tr");

    const IdCell = document.createElement("td");
    IdCell.textContent = branch._id;
    row.appendChild(IdCell);
    
    const cityCell = document.createElement("td");
    cityCell.textContent = branch.city;
    row.appendChild(cityCell);

    const addressCell = document.createElement("td");
    addressCell.textContent = branch.address;
    row.appendChild(addressCell);

    const yearsCell = document.createElement("td");
    yearsCell.textContent = branch.years;
    row.appendChild(yearsCell);

    const openCell = document.createElement("td");
    openCell.textContent = branch.open;
    row.appendChild(openCell);

    branchData.appendChild(row);

}