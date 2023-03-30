$(document).ready(() => {
    const token = localStorage.getItem('token');
  
    $.ajax({
      url: 'http://localhost:3000/users/get-user',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
      success: (response) => {
        $('#welcome-message').text(`Welcome, ${response.email}!`);
      },
      error: (xhr, status, error) => {
        alert(xhr.responseJSON.message);
        window.location.href = '/LogIn.html';
      }
    });
  });
$('#logOut').click(() => {
    localStorage.removeItem('token');
    window.location.href = 'Login.html';
});
$('#popup-button').click(function() {
    $('#popup').show();
  });
  
$('#popup-close').click(function() {
    $('#popup').hide();
  });
  
  