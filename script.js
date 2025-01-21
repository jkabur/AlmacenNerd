let products = [];

const productForm = document.getElementById('productForm');
const clearButton = document.getElementById('clearForm');
const productsContainer = document.getElementById('productsContainer');

async function isValidImageUrl(url) {
    try {
        const response = await fetch(url, { method: 'HEAD' });
        const contentType = response.headers.get('Content-Type');
        return contentType.startsWith('image/');
    } catch {
        return false;
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(error => {
        error.style.display = 'none';
        error.textContent = '';
    });
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

async function validateForm(formData) {
    clearErrors();
    let isValid = true;

    if (!formData.get('productName').trim()) {
        showError('nameError', 'El nombre es requerido');
        isValid = false;
    }

    const price = parseFloat(formData.get('productPrice'));
    if (isNaN(price) || price <= 0) {
        showError('priceError', 'El precio debe ser un número válido mayor a 0');
        isValid = false;
    }

    const imageUrl = formData.get('productImage');
    if (!imageUrl) {
        showError('imageError', 'La URL de la imagen es requerida');
        isValid = false;
    } else {
        const isValidImage = await isValidImageUrl(imageUrl);
        if (!isValidImage) {
            showError('imageError', 'La URL debe ser de una imagen válida');
            isValid = false;
        }
    }

    return isValid;
}

function renderProducts() {
    productsContainer.innerHTML = '';
    products.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
            </div>
            <button class="btn-delete" title="Eliminar producto" onclick="deleteProduct(${index})">
                <i class="fas fa-trash-alt"></i>
            </button>
        `;
        productsContainer.appendChild(productCard);
    });
}

window.deleteProduct = function(index) {
    products.splice(index, 1); 
    renderProducts(); 
}

productForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(productForm);
    
    if (await validateForm(formData)) {
        const newProduct = {
            name: formData.get('productName'),
            price: parseFloat(formData.get('productPrice')),
            image: formData.get('productImage')
        };
        
        products.push(newProduct);
        renderProducts(); 
        productForm.reset();
    }
});

clearButton.addEventListener('click', () => {
    productForm.reset();
    clearErrors();
});
