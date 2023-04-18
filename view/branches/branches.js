const URL = "http://localhost:3000/branches"

// $(document).bind('pageinit',function () {
//     initMap()
//     read_all()
// })

$(document).ready(function () {
    initMap()
    read_all()
})

$("#addButton").click(function (e) {
    e.preventDefault()
    createBranch()
})
$("#deleteButton").click(function (e) {
    e.preventDefault()
    deleteBranch($("#Id").val())
})
$("#updateButton").click(function (e) {
    e.preventDefault()
    updateBranch($("#Id").val())
})
$("#findButton").click(function (e){
    e.preventDefault()
    findBranch()
})
$("#showButton").click(function(e){
    e.preventDefault()
    clearTable()
    deleteMarkers()
    read_all()
})

//clear input fields
function clearForm() {
    $("#Id").val('')
    $("#city").val('')
    $("#address").val('')
    $("#years").val('')
    $("#open").prop('checked', false)
}

//show all branches
function read_all() {
    $.ajax({
        type: "GET",
        url: URL+"/",
        dataType: "json",
        success: function (res) {
            clearTable()
            res.forEach(appendToBranchTable)
            res.forEach(addMarker)            
        },
        error: function (res) {
            alert(res.responseText)
        }
    });
}

//delete branch by id
function deleteBranch(branchId) {
    console.log("script delete:"+branchId)
    $.ajax({
        type: "DELETE",
        url: URL + '/' + branchId,
        success: function () {
            $(`#${branchId}`).remove()
            clearForm()

            deleteMarkers()
            read_all()
        },
        error: function (res) {
            alert(res.responseText)
        }
    });
}

//create branch
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
            appendToBranchTable(res.branch)
            clearForm()

            deleteMarkers()
            read_all()
        },
        error: function (res) {
            alert(res.responseText)
        }
    });
}

//update branch by id
function updateBranch(branchId) {
    console.log("update branch:"+branchId)
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

    console.log(data)
  
    $.ajax({
      type: "PUT",
      url: URL + '/' + branchId,
      contentType: "application/json",
      data: JSON.stringify(data),
      success: function (res) {
        $(`#${branchId}`).remove()
        appendToBranchTable(res.branch)
        clearForm()

        deleteMarkers()
        read_all()

      },
      error: function (res) {
        alert(res.responseText)
      }
    });
}


//appand to branche's list
function appendToBranchTable(branch) {

    const branchData = document.getElementById("branch-data");

    const row = document.createElement("tr");

    row.setAttribute("id",branch._id)

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

//find branches by criterias
function findBranch() {
    var url2 = URL + "/";

    var city = undefined;
    var years = undefined;
    var open = undefined;

    const Iscity = $("#cityCB").is(":checked");
    if(Iscity == true){
        city = $("#city").val();
        url2 += "city/"+city+"/"
    }else{
        url2 += "city/"
    }

    const Isyears = $("#yearsCB").is(":checked");
    if(Isyears == true){
        years = $("#years").val();

        url2 += "years/"+years+"/"
    }else{
        url2 += "years/"
    }

    const Isopen = $("#openCB").is(":checked");
    if(Isopen == true){
        open = $("#open").is(":checked");
       url2 += "open/"+open
    }else{
        url2 += "open"
    }

    console.log("url: " + url2)
    console.log("city: "+city+"   years: "+years+"  open: "+open)

    $.ajax({
        type: "GET",
        url: url2,
        dataType: "json",
        success: function (res) {
            console.log("in the script")
            //remove all the table
            clearTable()
            //and show the branches that answer the same criteria
            console.dir(res)
            if(res != undefined){
                res.branches.forEach(appendToBranchTable)   
            }       
        },
        error: function (res) {
            alert(res.responseText)
        }
    });
}


//clear the list of the branches
function clearTable() {
    var table = document.getElementById("branch-data");
    var rowCount = table.rows.length;

    // Loop through each row and remove it
    for (var i = rowCount - 1; i >= 0; i--) {
      table.deleteRow(i);
    }
}

////////////////////////////////////////////////////////////////////////////////////////
// //GOOGLE MAPS
///////////////////////////////////////////////////////////////////////////////////////

let map;
let markers = [];
let geocoder;

// Initialize and add the map
async function initMap() {
  // The location of the collage    31.970557137683475, 34.772830115344256
  const position = { lat: 31.970557137683475, lng: 34.772830115344256 };
  // Request needed libraries.
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerView } = await google.maps.importLibrary("marker");

  // The map, centered at the collage
  map = new Map(document.getElementById("map"), {
    zoom: 7,
    center: position,
  });

}

function addMarker(branch) {
    //convert the address to position on the map

    console.log("in the add marker")
    geocoder = new google.maps.Geocoder();
    var address = branch.address + ", " + branch.city
    geocoder.geocode( { 'address': address}, function(results, status) {
        console.log("in the geo")

        if (status == 'OK') {
            console.log("ok")
            var where = results[0].geometry.location;
            console.log(where)
          var marker = new google.maps.Marker({
              map: map,
              position: where
          });
          marker.setMap(map);
          markers.push(marker);
        } else {
          alert('Geocode was not successful for the following reason: ' + status);
        }
    });
}


function setMapOnAll(map) {
    for (let i = 0; i < markers.length; i++) {
      markers[i].setMap(map);
    }
}
  
function hideMarkers() {
    setMapOnAll(null);
}

function deleteMarkers() {
    hideMarkers();
    markers = [];
}
  

