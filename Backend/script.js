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
      image.dataset.id = item.id;
      image.setAttribute('data-id', item.id);
      figure.dataset.id = item.id;
      figure.setAttribute('data-id', item.id);

      figure.appendChild(image);
      figure.appendChild(text);

      document.querySelectorAll('.gallery').forEach(div => {
        let images = div.querySelectorAll('img');
        let imageExists = false;
        images.forEach(img => {
          if (img.src === image.src) {
            imageExists = true;
          }
        });
        if (!imageExists) {
          div.appendChild(figure);
        }
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
    <div class="gallery-item" data-id="${item.id}">
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

if (authorizedUser && authorizedUser.isAdmin) {
  console.log(authorizedUser);

  const elements = document.querySelectorAll('.edit');

  elements.forEach(element => {
    const editButton = document.createElement('button');
    editButton.textContent = 'Modifier';
    editButton.style.paddingTop = '10px'
    editButton.classList.add('edit');
    element.appendChild(editButton);

    const icon = document.createElement('i');
    icon.style.paddingTop = '10px'
    icon.classList.add('far', 'fa-edit');
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
    toolbar.style.left = '0';
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

    const deconnexion = document.createElement('button');
    deconnexion.textContent = 'Déconnexion';
    deconnexion.style.marginLeft = '50px'
    deconnexion.style.width = '7%'
    deconnexion.style.borderRadius = '10px'
    toolbar.appendChild(deconnexion);

    document.body.appendChild(toolbar);

    toolbar.style.display = 'flex';

    deconnexion.addEventListener('click', () => {
      localStorage.removeItem('authorizedUser');
      window.location.href = 'index.html';
    });
  });

}

//modale
if (authorizedUser && authorizedUser.isAdmin) {
  const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY4NDAxNTYxNSwiZXhwIjoxNjg0MTAyMDE1fQ.lwv1uNv-TG9dycfVaUsEBUsV2uBsPHqmywTbMn38Teg';
  const editButtons = document.querySelectorAll('.edit');
  const addPhotosButton = document.querySelector('.add-photos');
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('images');
  const addPhotosModal = document.getElementById('add-photos-modal');
  const closeBtn = document.querySelector('.close');

  function deleteImage(id, imageSrc) {
    fetch(`http://localhost:5678/api/works/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error('Une erreur s\'est produite lors de la suppression de l\'image');
        }
        const mainImages = document.querySelectorAll('.gallery-item img');
        mainImages.forEach(mainImage => {
          if (mainImage.src === imageSrc) {
            mainImage.parentNode.remove();
          }
        });
        const modalImages = document.querySelectorAll('.image-container img');
        modalImages.forEach(modalImage => {
          if (modalImage.src === imageSrc) {
            modalImage.parentNode.remove();
          }
        });
      })
      .catch(error => {
        console.error(error);
      });
  }

  editButtons.forEach(editButton => {
    editButton.addEventListener('click', function () {
      modalContent.innerHTML = '';

      const galleryItems = document.querySelectorAll('.gallery-item');

      galleryItems.forEach(galleryItem => {
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
        imageContainer.dataset.id = galleryItem.dataset.id;

        const img = galleryItem.querySelector('img').cloneNode();
        img.dataset.id = galleryItem.dataset.id;

        img.addEventListener('click', function (event) {
          const id = event.target.parentNode.dataset.id;
          console.log('id', id);
        });

        const deleteIcon = document.createElement('i');
        deleteIcon.classList.add('fas', 'fa-trash');
        deleteIcon.addEventListener('click', function () {
          const id = imageContainer.dataset.id;
          const imageSrc = img.src;
          galleryItem.remove();
          deleteImage(id, imageSrc);
        });

        imageContainer.appendChild(img);
        imageContainer.appendChild(deleteIcon);

        modalContent.appendChild(imageContainer);
      });

      modal.style.display = 'block';
    });
  });


  closeBtn.addEventListener('click', function () {
    modal.style.display = 'none';
  });

  window.addEventListener('click', function (event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });
}

const addPhotosModal = document.getElementById('add-photos-modal');
const addPhotosButton = document.querySelector('.add-photos');
const addPhotosModalCloseButton = addPhotosModal.querySelector('.close');

addPhotosButton.addEventListener('click', function () {
  addPhotosModal.style.display = 'block';
});

addPhotosModalCloseButton.addEventListener('click', function () {
  addPhotosModal.style.display = 'none';
});

//ajouter image 2e modale
const photoForm = document.getElementById('photo-form');
const photoFile = document.getElementById('photo-file');
const photoTitle = document.getElementById('photo-title');
const photoCategory = document.getElementById('photo-category');
const submitButton = document.querySelector('button[type="submit"]');
const previewContainer = document.getElementById('preview-container');
const photoGallery = document.querySelector('.gallery');
const newapiUrl = 'http://localhost:5678/api/works';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY4NDAxNTYxNSwiZXhwIjoxNjg0MTAyMDE1fQ.lwv1uNv-TG9dycfVaUsEBUsV2uBsPHqmywTbMn38Teg';

const inputs = [photoFile, photoTitle, photoCategory];

inputs.forEach(input => {
  input.addEventListener('input', () => {
    if (inputs.every(input => input.value.trim() !== '')) {
      submitButton.style.backgroundColor = '#1D6154';
    } else {
      submitButton.style.backgroundColor = 'gray';
    }
  });
});

photoForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const file = photoFile.files[0];
  const reader = new FileReader();

  reader.onloadend = function () {
    const formData = new FormData();
    formData.append('title', photoTitle.value);
    formData.append('category', photoCategory.value);
    formData.append('image', file);

    fetch(newapiUrl, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer ' + token
        },
        body: formData
      })
      .then(response => response.json())
      .then(data => {
        console.log('data:', data);
        const newPhoto = document.createElement('div');
        newPhoto.classList.add('gallery-item');

        const newPhotoImg = document.createElement('img');
        newPhotoImg.src = data.imageUrl;
        newPhotoImg.alt = photoTitle.value;
        newPhoto.appendChild(newPhotoImg);

        const newPhotoText = document.createElement('div');
        newPhotoText.classList.add('gallery-item-text');
        const newPhotoTitle = document.createTextNode(photoTitle.value);
        newPhotoText.appendChild(newPhotoTitle);
        newPhoto.appendChild(newPhotoText);

        photoGallery.appendChild(newPhoto);

        photoFile.value = '';
        photoTitle.value = '';
        photoCategory.value = '';
        previewContainer.innerHTML = '';


      })
      .catch(error => console.error(error));
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    previewContainer.innerHTML = 'No image selected';
  }
});

photoFile.addEventListener('change', (e) => {
  const file = photoFile.files[0];
  const reader = new FileReader();

  reader.onloadend = function () {
    const previewImg = document.createElement('img');
    previewImg.src = reader.result;
    previewImg.alt = 'preview';
    previewContainer.innerHTML = '';
    previewContainer.appendChild(previewImg);
  };

  if (file) {
    reader.readAsDataURL(file);
  } else {
    previewContainer.innerHTML = 'No image selected';
  }
});