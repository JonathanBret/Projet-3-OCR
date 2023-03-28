//afficher les photos
fetch('http://localhost:5678/api/works')
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      let figure = document.createElement('figure');
      let image = document.createElement('img');
      let text = document.createElement('figcaption');

      image.src = item.imageUrl;
      text.textContent = item.title;

      figure.appendChild(image);
      figure.appendChild(text);

      document.querySelectorAll('.gallery').forEach(div => {
        div.appendChild(figure);
      });
    });
  })
  .catch(error => console.error(error));

//filtre
const apiUrl = 'http://localhost:5678/api/works';

const getData = async () => {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
};

const filterData = (data, category) => {
  if (category === 'all') {
    return data;
  } else {
    return data.filter(item => item.categoryId === parseInt(category));
  }
};

const displayData = (data) => {
  const gallery = document.querySelector('.gallery');

  gallery.innerHTML = data.map(item => `
    <div class="gallery-item">
      <img src="${item.imageUrl}" alt="${item.title}">
      <div class="gallery-item-text">${item.title}</div>
    </div>
  `).join('');

  const filterButtons = document.querySelectorAll('.filter-button');
  filterButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const category = button.dataset.category;
      const filteredData = filterData(data, category);
      gallery.innerHTML = filteredData.map(item => `
        <div class="gallery-item">
          <img src="${item.imageUrl}" alt="${item.title}">
          <div class="gallery-item-text">${item.title}</div>
        </div>
      `).join('');
    });
  });
};


const init = async () => {
  const data = await getData();
  displayData(data);
};

init();


//login opérationnel

const authorizedUsers = [{
  email: "sophie.bluel@test.tld",
  password: "S0phie"
}, ];

const loginForm = document.getElementById('login');

loginForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const credentials = {
    email: email,
    password: password
  };

  const authorizedUser = authorizedUsers.find(user => user.email === email && user.password === password);

  if (authorizedUser) {
    window.location.href = 'index.html';
    console.log(authorizedUser)

    const elements = document.querySelectorAll('.edit');

    elements.forEach(element => {
      const editButton = document.createElement('button');
      editButton.textContent = 'Modifier';
      editButton.classList.add('edit');
      element.appendChild(editButton);
    });

  } else {
    alert('Identifiants incorrects');
  }
});