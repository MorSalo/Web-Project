$(document).ready(() => {
    const token = localStorage.getItem('token');
  
    $.ajax({
      url: 'http://localhost:3000/users/get/user',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${token}` },
      success: (response) => {
        $('#welcome-message').text(`Welcome, ${response.username}!`);
      },
      error: (xhr, status, error) => {
        alert(xhr.responseJSON.message);
        window.location.href = '../users/LogIn.html';
      }
    });
  });