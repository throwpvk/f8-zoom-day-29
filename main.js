const productsGrid = document.querySelector(".product-grid");
productsGrid.innerHTML = "";
const allproductData = fetch("https://dummyjson.com/products")
  .then((res) => res.json())
  .then((data) => {
    data.products.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.innerHTML = `
      <img
            src="${product.thumbnail}"
            class="product-image"
            alt="${product.title}"
          />
          <div class="product-info">
            <h2 class="product-title">${product.title}</h2>
            <p class="product-price">$${product.price}</p>
            <div class="product-rating">
              <i class="fas fa-star"></i>
              <span>${product.rating} (${product.reviews.length} reviews)</span>
            </div>
            <p class="product-description">
              ${product.description}
            </p>
            <div class="product-button">
              <a href="detail.html?id=${product.id}">View Details</a>
            </div>
          </div>
      `;

      productCard.addEventListener("click", () => {
        window.location.href = `detail.html?id=${product.id}`;
      });
      productsGrid.appendChild(productCard);
    });
  });
