fetch('http://localhost:5678/api/works')
  .then(response => {
    return response.json();
  })
  .then(data => {
    for (let i = 0; i < data.length; i++) {
      const imageUrl = data[i].imageUrl;
      const img = document.createElement('img');
      img.src = imageUrl;
      document.body.appendChild(img);
    }
  })
  .catch(error => {
    console.error('Erreur :', error);
  });
