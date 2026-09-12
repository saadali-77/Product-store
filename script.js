
const API_URL = "https://dummyjson.com/products";

const productsContainer =
    document.getElementById("productsContainer");

const loadingMessage =
    document.getElementById("loadingMessage");

const errorMessage =
    document.getElementById("errorMessage");

const searchInput =
    document.getElementById("searchInput");

const favouriteCount =
    document.getElementById("favouriteCount");

let products = [];
let favourites = new Set();


async function fetchProducts() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch products");
        }

        const data = await response.json();

        products = data.products;

        renderProducts(products);

        loadingMessage.hidden = true;

    } catch (error) {
        console.error("Error:", error);

        loadingMessage.hidden = true;
        errorMessage.hidden = false;
    }
}


function renderProducts(productsToRender) {
    productsContainer.innerHTML = "";

    productsToRender.forEach((product) => {
        const productCard =
            document.createElement("article");

        productCard.className = "product-card";

        productCard.innerHTML = `
            <img
                src="${product.thumbnail}"
                alt="${product.title}"
            >

            <div class="product-info">

                <h2 class="product-title">
                    ${product.title}
                </h2>

                <p class="product-price">
                    $${product.price}
                </p>

                <button
                    class="favourite-button ${
                        favourites.has(product.id)
                            ? "active"
                            : ""
                    }"
                    data-product-id="${product.id}"
                >
                    ${
                        favourites.has(product.id)
                            ? "♥ Favourite"
                            : "♡ Favourite"
                    }
                </button>

            </div>
        `;

        const favouriteButton =
            productCard.querySelector(".favourite-button");

        favouriteButton.addEventListener("click", () => {
            toggleFavourite(
                product.id,
                favouriteButton
            );
        });

        productsContainer.appendChild(productCard);
    });
}


function toggleFavourite(productId, button) {
    if (favourites.has(productId)) {
        favourites.delete(productId);

        button.textContent = "♡ Favourite";
        button.classList.remove("active");

    } else {
        favourites.add(productId);

        button.textContent = "♥ Favourite";
        button.classList.add("active");
    }

    updateFavouriteCount();
}


function updateFavouriteCount() {
    favouriteCount.textContent = favourites.size;
}


searchInput.addEventListener("input", () => {
    const searchTerm =
        searchInput.value.toLowerCase();

    const filteredProducts =
        products.filter((product) => {
            return product.title
                .toLowerCase()
                .includes(searchTerm);
        });

    renderProducts(filteredProducts);
});


fetchProducts();

