const params = new URLSearchParams(window.location.search);
const productId = params.get("id");
const procductDetailContainer = document.querySelector(".product-detail");

const procductData = fetch(`https://dummyjson.com/products/${productId}`)
  .then((res) => res.json())
  .then((data) => {
    procductDetailContainer.innerHTML = `
        <div class="slideshow-container">
          ${getImg(data.images)}
        </div>
        <div class="product-info">
          <h2 class="product-title">${data.title}</h2>
          <p class="product-price">$${data.price}</p>
          <div class="product-rating">
            <i class="fas fa-star"></i>
            <span>${data.rating} (${data.reviews.length} reviews)</span>
          </div>
          <p class="product-description">
            ${data.description} 
          </p>
          <div class="product-button">
            <a href="#">Add to Cart <i class="fa-solid fa-cart-plus" style="margin-left: 5px;"></i></a>
          </div>
          <div class="product-meta">
            <p><span>Category:</span> ${data.category}</p>
            <p><span>Brand:</span> ${data.brand}</p>
            <p><span>Stock:</span> ${data.availabilityStatus}</p>
            <p><span>Weight:</span> ${data.weight}</p>
            <p><span>Dimensions:</span> ${data.dimensions.width} x ${
      data.dimensions.height
    } x ${data.dimensions.depth}</p>
            <p><span>Warranty:</span> ${data.warrantyInformation}</p>
            <p><span>Shipping:</span> ${data.shippingInformation}</p>
            <p><span>Return Policy:</span> ${data.returnPolicy}</p>
            <p><span>Minimum Order:</span> ${data.rating}24 units</p>
            <p><span>Tags:</span> ${getTags(data.tags)}</p>
          </div>
          <div class="product-reviews">
            <h3>Customer Reviews</h3>
            ${getReviews(data.reviews)}
          </div>
        </div>
      `;

    // Bật render slideshow
    initSlideshows();
  });

// Hàm lấy ảnh trong dữ liệu tạo thành danh sách ảnh chạy trong slideshow
// Nếu chỉ có một ảnh thì không hiển thị slideshow
function getImg(images) {
  if (!images || images.length === 0) return "";

  if (images.length === 1) {
    // Chỉ 1 ảnh: hiển thị ảnh đơn
    return `
      <div class="single-image" style="
        background-image: url('${images[0]}');
        background-size: cover;
        background-position: center;
        width: 100%;
        height: 400px;
      "></div>
    `;
  }

  // Nhiều ảnh: hiển thị slideshow
  const slideItemsHTML = images
    .map(
      (imgUrl) => `
        <div class="slide-item" style="background-image: url('${imgUrl}');"></div>`
    )
    .join("");

  return `
      <div class="slideshow">
        <div class="slideshow-track"">
          ${slideItemsHTML}
        </div>
        <button class="slideshow-button prev">
          <i class="fa-solid fa-chevron-left"></i>
        </button>
        <button class="slideshow-button next">
          <i class="fa-solid fa-chevron-right"></i>
        </button>
      </div>
  `;
}

// Nối tags và viết hoa chữ đầu
function getTags(tags) {
  if (!Array.isArray(tags) || tags.length === 0) return "";
  return tags.map((tag) => tag[0].toUpperCase() + tag.slice(1)).join(", ");
}

// Hàm tạo icons star theo như số star hiện có
// Nếu lớn hơn số lẻ 0.5 sao thì hiển thị thành icon nửa sao
// Phần còn lại hiển thị icon rỗng
function getStar(starNum) {
  let starHtml = "";
  const fullStars = Math.floor(starNum);
  const hasHalfStar = starNum % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    starHtml += `<i class="fas fa-star"></i>`;
  }

  if (hasHalfStar) {
    starHtml += `<i class="fas fa-star-half-alt"></i>`;
  }

  for (let i = 0; i < emptyStars; i++) {
    starHtml += `<i class="far fa-star"></i>`;
  }

  return starHtml;
}

// Hàm tạo html của phần review
function getReviews(reviews) {
  return reviews
    .map((review) => {
      const { rating, comment, reviewerName, date } = review;
      const formattedDate = new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });

      return `
        <div class="review-item">
          <div class="review-rating">
            ${getStar(rating)}
            <span>${rating}/5</span>
          </div>
          <p class="review-comment">${comment}</p>
          <p class="review-meta">${reviewerName} - ${formattedDate}</p>
        </div>
      `;
    })
    .join("");
}
