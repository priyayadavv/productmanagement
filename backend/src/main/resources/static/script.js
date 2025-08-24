const formContainer = document.querySelector(".form-container");
const tableContainer = document.querySelector(".table-container");
const form = document.querySelector(".form");
const productsContainer = document.querySelector(".products");
const addProductTab = document.querySelector(".add-product");
const homeTab = document.querySelector(".home");

const apiUrl = "/api/products";

// Show form on "Add product" click
addProductTab.addEventListener("click", () => {
  formContainer.style.display = "block";
  tableContainer.style.display = "none";
});

// Show table on "Home" click
homeTab.addEventListener("click", () => {
  formContainer.style.display = "none";
  tableContainer.style.display = "block";
  fetchProducts();
});

// Handle form submit
form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const desc = document.getElementById("desc").value.trim();
  const price = document.getElementById("price").value.trim();
  const status = document.getElementById("status").value.trim();

  if (!name || !desc || !price || !status) {
    alert("Please fill all fields!");
    return;
  }

  const product = { name, desc, price, status };

  fetch(apiUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  })
    .then((res) => res.json())
    .then(() => {
      fetchProducts();
      form.reset();
      formContainer.style.display = "none";
      tableContainer.style.display = "block";
    })
    .catch((err) => console.error("Error adding product:", err));
});

// Fetch products from backend
function fetchProducts() {
  fetch(apiUrl)
    .then((res) => res.json())
    .then((data) => {
      renderProducts(data);
    })
    .catch((err) => {
      console.error("Error fetching products:", err);
      productsContainer.innerHTML = `
        <div>
          <li>S.NO</li>
          <li>Product name</li>
          <li>Description</li>
          <li>Price</li>
          <li>Status</li>
          <li>Action</li>
        </div>
        <div><li colspan="6">⚠️ Error loading products</li></div>
      `;
    });
}

// Render products table
function renderProducts(products) {
  // Always render table header
  productsContainer.innerHTML = `
    <div>
      <li>S.NO</li>
      <li>Product name</li>
      <li>Description</li>
      <li>Price</li>
      <li>Status</li>
      <li>Action</li>
    </div>
  `;

  if (!products || products.length === 0) {
    const emptyRow = document.createElement("div");
    emptyRow.innerHTML = `<li colspan="6">No products available</li>`;
    productsContainer.appendChild(emptyRow);
    return;
  }

  products.forEach((p, index) => {
    const row = document.createElement("div");
    row.innerHTML = `
      <li>${index + 1}</li>
      <li>${p.name}</li>
      <li>${p.desc}</li>
      <li>${p.price}</li>
      <li>${p.status}</li>
      <li><button class="delete-btn" data-id="${p.id}">Delete</button></li>
    `;
    productsContainer.appendChild(row);
  });
}

// Handle delete
productsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    const id = e.target.getAttribute("data-id");
    fetch(`${apiUrl}/${id}`, { method: "DELETE" })
      .then(() => fetchProducts())
      .catch((err) => console.error("Error deleting product:", err));
  }
});

// On page load → show table & fetch products
window.addEventListener("DOMContentLoaded", () => {
  formContainer.style.display = "none";
  tableContainer.style.display = "block";
  fetchProducts();
});
