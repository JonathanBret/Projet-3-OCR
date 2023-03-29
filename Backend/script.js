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
const authorizedUser = JSON.parse(localStorage.getItem('authorizedUser'));

if (authorizedUser) {
  console.log(authorizedUser);

  const elements = document.querySelectorAll('.edit');

  elements.forEach(element => {
    const editButton = document.createElement('button');
    editButton.textContent = 'Modifier';
    editButton.classList.add('edit');
    element.appendChild(editButton);

    const icon = document.createElement('i');
    icon.classList.add('fa-pen-square');
    element.appendChild(icon);

    const toolbar = document.createElement('div');
    toolbar.style.width = '100%';
    toolbar.style.backgroundColor = 'black';
    toolbar.style.color = 'white';
    toolbar.style.display = 'none';
    toolbar.style.justifyContent = 'center';
    toolbar.style.alignItems = 'center';
    toolbar.style.position = 'fixed';
    toolbar.style.top = '0';
    toolbar.style.padding = '10px';


    const modeEdition = document.createElement('button');
    modeEdition.style.paddingRight = '50px'
    modeEdition.style.border = 'none'
    modeEdition.style.backgroundColor = 'black'
    modeEdition.style.color = "white"
    modeEdition.style.fontSize = '16px'
    modeEdition.style.width = '10%'
    modeEdition.style.cursor = 'pointer'
    modeEdition.textContent = 'Mode édition';
    toolbar.appendChild(modeEdition);

    const publierChangements = document.createElement('button');
    publierChangements.style.padding = '7px'
    publierChangements.style.backgroundColor = 'white'
    publierChangements.style.borderRadius = '15px'
    publierChangements.style.width = '12%'
    publierChangements.textContent = 'Publier les changements';
    toolbar.appendChild(publierChangements);

    document.body.appendChild(toolbar);

    toolbar.style.display = 'flex';


  });

} else {
  alert('Accès non autorisé');
}