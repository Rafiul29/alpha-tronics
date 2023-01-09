const productsWrapper = document.querySelector(".product-wrapper");
function getProducts() {
    fetch("http://localhost:3000/products").then((res)=>{
        if (!res.ok) throw new Error("Something went wrong");
        return res.json();
    }).then((data)=>renderProducts(data)).catch((err)=>renderError(err.message));
}
getProducts();
function currencyFormatter(price) {
    return price.toLocaleString("en-us", {
        style: "currency",
        currency: "USD"
    });
}
function renderProducts(products) {
    products.forEach((product)=>{
        const html = `
         <div class="products overflow-hidden w-96 h-auto bg-white/75 backdrop-blur-lg rounded-xl shadow-lg shadow-gray-200 ">
        <div class="product-img h-60 overflow-hidden flex justify-center items-center">
          <img src=${product.image}
          class="w-full block h-60 p-5"
          alt=${product.title}>
        </div>
        <div class="product-texts p-5 flex flex-col gap-1">
        <p class="text-sm uppercase font-bold tracking-widest text-sky-500">${product.catagory}
        </p>
        <h1 class="text-2xl font-semibold truncate ">
        ${product.title}
        </h1>
        <p class="text-xl text-rose-500">${currencyFormatter(product.price)}<span class="text-sm text-gray-600">(${product.review} reviews)</span>
        </p>
        <button
        data-id="${product.id}"
        class="add-to-cart-btn bg-sky-500 self-start text-sky-50 p-2 px-5 rounded shadow-lg shadow-sky-200 font-semibold hover:shadow-rose-200 hover:bg-rose-500 hover:text-rose duration-300">Add to Cart
        </button>
        </div>
      </div>
    `;
        productsWrapper.insertAdjacentHTML("afterbegin", html);
    });
    //add to cart event
    const addToCartsBtns = document.querySelectorAll(".add-to-cart-btn");
    addToCartsBtns.forEach((btn)=>{
        btn.addEventListener("click", function(e) {
            const id = e.target.dataset.id;
            //calling another fetch function
            getSingleProductData(id);
        });
    });
}
function getSingleProductData(id) {
    fetch(`http://localhost:3000/products/${id}`).then((res)=>res.json()).then((data)=>renderSingleProduct(data));
}
function renderSingleProduct(product) {}
// error method
function renderError(errMsg) {
    productsWrapper.innerHTML = "";
    const html = `
    <p>${errMsg}</p>
    `;
    productsWrapper.insertAdjacentHTML("afterbegin", html);
}

//# sourceMappingURL=index.816e7b21.js.map
