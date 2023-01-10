const productsWrapper = document.querySelector(".product-wrapper")
const addedProductWrapper=document.querySelector(".added-products")
const cartModal=document.querySelector(".cart-modal")
const cartClose= document.querySelector(".cart-close")
const cartOpenbtn=document.querySelector(".cart-open-btn")
const itemHoldCount=document.querySelector(".item-count")




function getProducts() {
    fetch('http://localhost:3000/products')
        .then(res => {
            if (!res.ok) throw new Error("Something went wrong")
            return res.json();
        })
        .then(data =>{
          renderProducts(data)
          loadingLocalData(data)
          
        })
        .catch(err => renderError(err.message))
}

getProducts();

function currencyFormatter(price) {
    return price.toLocaleString("en-us", {
        style: "currency",
        currency: "USD",
    })
}

function renderProducts(products) {
    products.forEach(product => {
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
        productsWrapper.insertAdjacentHTML("afterbegin", html)
    });

    //add to cart event
    const addToCartsBtns = document.querySelectorAll(".add-to-cart-btn")
 
    addToCartsBtns.forEach(btn => {
        btn.addEventListener("click", function (e) {
            const id = e.target.dataset.id;
            //calling another fetch function
            getSingleProductData(id)
            //cart open
            cartModal.classList.remove('hidden');
        })
    })

}

function getSingleProductData(id) {
    fetch(`http://localhost:3000/products/${id}`)
        .then(res => res.json())
        .then(data =>{
          renderSingleProduct(data)
          saveInLocalStorage(data)
        })
}
function saveInLocalStorage(product){
  //get data from localstorage
  const greetingLocalData=JSON.parse(localStorage.getItem(`item-${product.id}`))
  //if data exists ,return null
  if(greetingLocalData) return null
  //if not exist ,set 
  if(!greetingLocalData){
    localStorage.setItem(`item-${product.id}`,JSON.stringify(product))
  }
}

function loadingLocalData(products){
  let localData=[]

  for(let i=0; i<=products.length; i++){
    const dataParsing=JSON.parse(localStorage.getItem(`item-${i}`));
    if(dataParsing) localData.push(dataParsing);
  }

  //render local Data
  localData.forEach((product)=>{
    renderSingleProduct(product)
  })


  //render item count
  const itemCount=localData.length;

  itemHoldCount.textContent=itemCount
}







function renderSingleProduct(product) {
    const html = `
        <div class="added-product grid grid-cols-4 border-b pb-2 gap-2 overflow-hidden">
            <div class="img overflow-hidden w-20 rounded flex justify-center items-center  ">
              <img src=${product.image} alt=${product.title}
              class="block w-full rounded"
              >
            </div>
            <div class="texts flex flex-col gap-2 col-span-2">
              <h4 class="font-semibold">=${product.title}</h4>
              <div class="flex justify-between items-center">
                <p class="price text-rose-500 font-bold">${currencyFormatter(product.price)}</p>
                <p class="font-semibold text-xl overflow-hidden flex cursor-pointer b">
                  <span class="bg-sky-500 text-sky-50 px-2 cursor-pointer active:bg-gray-700">-</span>
                  <span class="px-2">1</span>
                  <span class="bg-sky-500 text-sky-50 px-2 cursor-pointer active:bg-gray-700">+</span>
                </p>
              </div>
            </div>
            <button onClick="removeItem(${product.id})" class=  "remove-btn justify-self-end hover:text-rose-500">
              <i class="fa-regular fa-trash-can "></i>
            </button>
          </div>
        `;
        addedProductWrapper.insertAdjacentHTML("afterbegin",html)
}

function removeItem(id){

const data=JSON.parse(localStorage.getItem(`item-${id}`))
if(data.id===id){
  localStorage.removeItem(`item-${id}`)
}

}

cartClose.addEventListener("click",function(){
 cartModal.classList.add("hidden")
})


//cart open from cart open btn
cartOpenbtn.addEventListener("click",function(){
  cartModal.classList.remove("hidden")
    
})

// const bodyTag=document.getElementsByTagName("body")
// bodyTag.addEventListener("click",function(){
//   cartModal.classList.add("hidden")
// })
// error method
function renderError(errMsg) {
    productsWrapper.innerHTML = "";
    const html = `
    <p>${errMsg}</p>
    `;
    productsWrapper.insertAdjacentHTML("afterbegin", html);
}
