var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
ctx.beginPath();
var centerX = canvas.width / 2;
var centerY = canvas.height / 2;
// //grey circles
// radius = 140;
// ctx.arc(centerX,centerY,radius, 0 ,2*Math.PI);
// ctx.fillStyle = ""

// ctx.strokeStyle = "black";
// ctx.lineWidth = 10;
// for (var i = 0; i < 30; i++) {
//   ctx.beginPath();
//   ctx.moveTo(250 + 130 * Math.cos(i / 15 * Math.PI), 250 + 130 * Math.sin(i / 15 * Math.PI));
//   ctx.lineTo(250 + 170 * Math.cos(i / 15 * Math.PI), 250 + 170 * Math.sin(i / 15 * Math.PI));
//   ctx.stroke();
// }

// //red circle
// radius = 200;
// ctx.arc(centerX, centerY, radius, 0, 2*Math.PI);
// ctx.fillStyle = "red";
// ctx.fill();

// Draw the outer circle
ctx.beginPath();
ctx.arc(250, 250, 200, 0, 2 * Math.PI);
ctx.fillStyle = "black";
ctx.fill();

// Draw the inner circle
ctx.beginPath();
ctx.arc(250, 250, 150, 0, 2 * Math.PI);
ctx.fillStyle = "white";
ctx.fill();

// Draw the record grooves
ctx.strokeStyle = "black";
ctx.lineWidth = 10;
for (var i = 0; i < 30; i++) {
  ctx.beginPath();
  ctx.moveTo(250 + 130 * Math.cos(i / 15 * Math.PI), 250 + 130 * Math.sin(i / 15 * Math.PI));
  ctx.lineTo(250 + 170 * Math.cos(i / 15 * Math.PI), 250 + 170 * Math.sin(i / 15 * Math.PI));
  ctx.stroke();
}


$(document).ready(() => {
    const token = localStorage.getItem('token');
  
    $.ajax({
      url: 'http://localhost:3000/users/get/user',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
      success: (response) => {
        $('#welcome-message').text(`Welcome, ${response.user.username}!`);
      },
      error: (xhr, status, error) => {
        alert(xhr.responseJSON.message);
        window.location.href = '../users/LogIn.html';
      }
    });
  });


