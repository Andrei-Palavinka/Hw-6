const searchInput = document.querySelector('input[type="search"]');
const searchForm = document.querySelector('form[role="search"]');
let cart = [];
const totalPriceElement = document.querySelector(".totalPrice");
const cartButton = document.querySelector(".btn-cart");
const orderButton = document.querySelector(".btn-order");

const incProduct = (id) => {
  const index = cart.findIndex((item) => item.id == id);

  if (index !== -1) {
    cart[index].counter++;
  }

  renderCart();
  updateTotalPrice();
};

const decProduct = (id) => {
  const index = cart.findIndex((item) => item.id == id);

  if (index === -1) return;
  if (cart[index].counter === 0) {
    return;
  } else {
    cart[index].counter--;
  }

  renderCart();
  updateTotalPrice();
};

const removeFromOrder = (id) => {
  const newCart = cart.filter((item) => item.id != id);
  cart = newCart;
  renderCart();
  updateTotalPrice();
};

fetch("https://dummyjson.com/products")
  .then((res) => res.json())
  .then((data) => {
    products = data.products;
    showCards(products);
  });

function showCards(productsToShow) {
  const wrapper = document.querySelector(".wrapper");
  wrapper.innerHTML = "";
  productsToShow.forEach((product) => {
    const card = document.createElement("div");
    card.classList.add("card", "col-lg-3", "col-md-4", "col-sm-12");
    card.innerHTML = `
      <img class="card-img-top card-img_size" src="${product.thumbnail}" alt="${product.title}">
      <div class="card-body card-body_flex">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text">${product.description}</p>

        <div class="product-info">
          <span class="product-price">Price: $${product.price}</span>
          <span class="product-rating">Rating: ${product.rating}</span>
        </div>

        <button  class="btn btn-primary btn-size add-to-cart">Add to cart</button>
      </div>
    `;
    wrapper.appendChild(card);
  });

  document.querySelectorAll(".add-to-cart").forEach((button, index) => {
    button.addEventListener("click", () => {
      addToCart(products[index]);
    });
  });
}

function addToCart(product) {
  const productId = product.id;

  const index = cart.findIndex((item) => item.id === productId);

  if (index !== -1) {
    cart[index].counter++;
    console.log("cart", cart);
  } else {
    const newProduct = { ...product, counter: 1 };
    cart.push(newProduct);
  }

  console.log("cart>", cart);

  renderCart();

  updateTotalPrice();
}

function updateTotalPrice() {
  let totalPrice = 0;
  cart.forEach((product) => {
    totalPrice += product.price * product.counter;
  });
  console.log("totalPrice", totalPrice);
  totalPriceElement.textContent = `Total: ${totalPrice.toFixed(2)}$`;
  cartButton.textContent = `Your cart - $${totalPrice.toFixed(2)}`;
}

searchForm.addEventListener("submit", productSearch);

function productSearch(event) {
  event.preventDefault();
  const searchQuery = searchInput.value.toLowerCase();

  const filteredProducts = products.filter(
    (product) =>
      product.title.toLowerCase().includes(searchQuery) ||
      product.description.toLowerCase().includes(searchQuery)
  );

  showCards(filteredProducts);
}

const renderCart = () => {
  if (cart.length) {
    orderButton.disabled = false;
  } else {
    orderButton.disabled = true;
  }

  const cartElement = document.querySelector(".items-cart");
  cartElement.innerHTML = "";
  cart.forEach((product) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
				<div class= "cart-item-left">
					<img class="cart-img" src="${product.thumbnail}" alt="${product.title}">
					<h5 class="cart-title">${product.title}</h5>
				</div>
        
				<div class= "cart-item-right">
					<div class= "cart-quantity-control">
						<button ${product.counter === 1 ? "disabled" : ""} class="btn btn-secondary minus"  data-product-id="${product.id}">-</button>

						<div class="cart-item-price">${product.price}$ X ${product.counter} </div>

						<button  class="btn btn-secondary plus"  data-product-id="${product.id}" >+</button>
					</div>
			
					<button  data-product-id="${product.id}"  class="delete-item-cart btn btn-danger">Remove from order</button>
				</div>
    `;
    cartElement.appendChild(cartItem);
  });
};

const cartElement = document.querySelector(".items-cart");
cartElement.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("plus")) {
    incProduct(target.dataset.productId);
  } else if (target.classList.contains("minus")) {
    decProduct(target.dataset.productId, target);
  } else if (target.classList.contains("delete-item-cart")) {
    removeFromOrder(target.dataset.productId);
  }
});
