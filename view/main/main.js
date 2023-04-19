const URL = "http://localhost:3000/users";
$(document).ready(() => {
    const token = localStorage.getItem('token');
  

  
    $.ajax({
      url: URL+'/get/user',
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
  })