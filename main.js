const productsGrid = document.querySelector(".product-grid");
productsGrid.innerHTML = "";
const allProcductData = fetch("https://dummyjson.com/products")
  .then((res) => res.json())
  .then((data) => {
    data.products.forEach((procduct) => {
      const procductCard = document.createElement("div");
      procductCard.className = "product-card";
      procductCard.innerHTML = `
      <img
            src="${procduct.thumbnail}"
            class="product-image"
            alt="${procduct.title}"
          />
          <div class="product-info">
            <h2 class="product-title">${procduct.title}</h2>
            <p class="product-price">$${procduct.price}</p>
            <div class="product-rating">
              <i class="fas fa-star"></i>
              <span>${procduct.rating} (${procduct.reviews.length} reviews)</span>
            </div>
            <p class="product-description">
              ${procduct.description}
            </p>
            <div class="product-button">
              <a href="detail.html?id=${procduct.id}">View Details</a>
            </div>
          </div>
      `;

      productsGrid.appendChild(procductCard);
    });
  });
