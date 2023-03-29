const URL = "http://localhost:3000/branches"
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
    console.log("button on click delete "+$("#Id").val())
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
    read_all()
})

//TODO: to figure it out
// $("#showButton").click(function (e) {
//     e.preventDefault()
//     const branchData = document.getElementById("branch-data");

// fetch("/branches")
//   .then(response => response.json())
//   .then(data => {
//     data.forEach(appendToBranchTable)
//   });
// })

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
        url: URL,
        dataType: "json",
        success: function (res) {
            //not sure that it will work bc i work with shcema an d not array
            res.forEach(appendToBranchTable)

            //appendToBranchTable(res.bra)
            
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
            //return in the controller ad the services always the new json object
            console.log(res.branch)
            appendToBranchTable(res.branch)
            clearForm()
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
        // Update the corresponding HTML element with the updated branch data
        // const updatedBranch = res.branch;
        // console.log("updated branch:" + updatedBranch)
        // const $branchRow = $(`#${branchId}`);
        // $branchRow.find(".city").text(updatedBranch.city);
        // $branchRow.find(".address").text(updatedBranch.address);
        // $branchRow.find(".years").text(updatedBranch.years);
        // $branchRow.find(".open").text(updatedBranch.open ? "Yes" : "No");
        $(`#${branchId}`).remove()
        appendToBranchTable(res.branch)
        clearForm()
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

    // var city = $("#city").val();
    // var years = $("#years").val();
    // var open = $("#open").is(":checked");
    const Iscity = $("#cityCB").is(":checked");
    if(Iscity == true){
        var city = $("#city").val();
        url2 += "city=" + city+"/"
    }

    const Isyears = $("#yearsCB").is(":checked");
    if(Isyears == true){
        years = $("#years").val()
        url2 += "years=" + years +"/"
    }

    const Isopen = $("#openCB").is(":checked");
    if(Isopen == true){
        open = $("#open").is(":checked")
        url2 += "open=" + open+"/"
    }
    //remove the last /
    url2 = url2.substring(0, url2.length - 1);

    console.log("url: " + url2)
    console.log("years: "+years+"   city: "+city+"  open: "+open)

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
                res.forEach(appendToBranchTable)   
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
    for (var i = rowCount - 1; i > 0; i--) {
      table.deleteRow(i);
    }
}


