products = [
    {
        id:1,
        name: "BTC",
        description: "Bitcoin M.Cap 913B$",
        image: "https://upload.wikimedia.org/wikipedia/commons/9/9a/BTC_Logo.svg",
        price: 112000,
    },
    {
        id:2,
        name: "ETH",
        description: "Ethereum M.Cap 409B$",
        image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/1200px-Ethereum-icon-purple.svg.png",
        price: 7000,
    },
    {
        id:3,
        name: "LTC",
        description: "LiteCoin M.Cap 12.2B$",
        image: "https://s2.coinmarketcap.com/static/img/coins/200x200/2.png",
        price: 500,
    },
    {
        id:4,
        name: "FLM",
        description: "Flamingo M.Cap 88M$",
        image: "https://img.api.cryptorank.io/coins/flamingo1600863237683.png",
        price: 5,
    },
    {
        id:5,
        name: "EOS",
        description: "EOS M.Cap 5.2B$",
        image: "https://assets.coingecko.com/coins/images/738/large/eos-eos-logo.png?1547034481",
        price: 5,
    },
    {
        id:6,
        name: "VET",
        description: "VeChain M.Cap 7.3B$",
        image: "https://avatars.githubusercontent.com/u/33248556?s=200&v=4",
        price: 2,
    },
]

cart= [];

let cartElement = document.getElementById("cart");

const AddToCart = (e)=>{
    let itemId = parseInt(e.target.parentNode.className.substring(5));
    let product = GetProductById(itemId);
    let catalogItemQuantityElement = document.getElementById(`quantity-${itemId}`)

    let prodQuantity = parseInt(catalogItemQuantityElement.innerHTML)
    catalogItemQuantityElement.innerHTML = 0;

    let didFindProductInCart = false; // assuming the product is not in the cart
    cart.map((prod)=>{
        if(prod.item_id === itemId){
            prod.quantity+=prodQuantity;
            prod.totalPrice = CalcTotalPrice(prod.quantity, product.price);
            didFindProductInCart=true;
        }
    })
    if(!didFindProductInCart){
        let newCartItem = {
            id: cart.length+1,
            item_id: itemId,
            name: product.name,
            quantity: prodQuantity,
            totalPrice: CalcTotalPrice(prodQuantity, product.price),
        }
        cart.push(newCartItem);
    }
    ClearCart(cartElement);
    LoadCart();

};
const AddQuantityCart = (e)=>{
    let itemId = parseInt(e.target.parentNode.className.substring(10))
    let cartItemQuantity = document.getElementById(`cart-quantity-${itemId}`);
    let newQuantity = (parseInt(cartItemQuantity.innerHTML.substring(10)) + 1);
    cartItemQuantity.innerHTML = "Quantity: " + newQuantity;
    ChangeCartProductQuantityById(itemId, 1);
    LoadCart();
}

const DeductQuantityCart = (e)=>{
    let itemId = parseInt(e.target.parentNode.className.substring(10))
    let cartItemQuantity = document.getElementById(`cart-quantity-${itemId}`)
    cartItemQuantity.innerHTML = "Quantity: " + (parseInt(cartItemQuantity.innerHTML.substring(10)) - 1);
    ChangeCartProductQuantityById(itemId, -1);
    LoadCart();
}
const AddQuantity = (e)=>{
    let itemId = parseInt(e.target.parentNode.className.substring(5))
    let catalogItemQuantityElement = document.getElementById(`quantity-${itemId}`)
    catalogItemQuantityElement.innerHTML = parseInt(catalogItemQuantityElement.innerHTML)+1;
}

const DeductQuantity = (e)=>{
    let itemId = parseInt(e.target.parentNode.className.substring(5))
    let catalogItemQuantityElement = document.getElementById(`quantity-${itemId}`)
    catalogItemQuantityElement.innerHTML = parseInt(catalogItemQuantityElement.innerHTML)-1;
}

LoadCatalog();
LoadCart();
CalculteCartTotal();

const CheckProductInCart=(prodName)=>{

}
const GetProductById = (id)=>{
    return products.filter((prod)=>prod.id===id)[0];
}
const GetProductByName = (prodName)=>{
    return products.filter((prod)=>prod.name===prodName)[0];
}
const ChangeCartProductQuantityById = (id,add)=>{
    cart.map((prod)=>{
        if(prod.id == id){
            let product = GetProductByName(prod.name);
            prod.quantity+=add;
            prod.totalPrice = prod.quantity * product.price;
        }
    })
}

const CalcTotalPrice = (quantity, price)=>{
    return quantity*price;
}

function ClearCart(cart){
    while(cart.firstChild){
        cart.removeChild(cart.firstChild);
    }
}

function DeleteCartProduct(e){
    let itemId = parseInt(e.target.parentNode.className.substring(10));

    cart = cart.filter((prod)=>prod.id !== itemId);

    let totalElement = document.getElementById("total");
    if(cart.length === 0)
    {
        totalElement.innerHTML=0 + " $";
    }
    ClearCart(cartElement);
    LoadCart();
}
function LoadCart() {
    ClearCart(cartElement);

    if(cart.length === 0){
        return EmptyCartNotification();
    }
    cart.map((prod) => {
        let tag = document.createElement("p");
        let cartEl = document.getElementById("cart");

        let { name, quantity, totalPrice } = ExtractProductData(prod);
        
        let nameText = CartProductName(name);
        let quantityText = CartProductQuantity(quantity, prod);
        let totalPriceText = CartProductTotalPrice(totalPrice);

        let deleteCartProductBtn = ConfigDeleteCartButton();


        let addQuantityBtn = ConfigAddButton();
        let deductQuantityBtn = ConfigDeductButton();

        AppendChildren(tag, nameText, addQuantityBtn, deductQuantityBtn, quantityText, totalPriceText, deleteCartProductBtn);

        tag.className = `cart-item ${prod.id}`;
        cartEl.appendChild(tag);
    });
    CalculteCartTotal();
}

function EmptyCartNotification() {
    let tag = document.createElement("p");
    let cartEl = document.getElementById("cart");
    tag.innerHTML = "Cart is Empty";
    cartEl.appendChild(tag);
    return;
}

function ExtractProductData(prod) {
    let name = prod.name;
    let quantity = prod.quantity;
    let totalPrice = prod.totalPrice;
    return { name, quantity, totalPrice };
}

function CartProductName(name) {
    let nameText = document.createElement("p");
    nameText.innerHTML = name;
    nameText.className = "cart-prod-name";
    return nameText;
}

function CartProductQuantity(quantity, prod) {
    let quantityText = document.createElement("p");
    quantityText.innerHTML = "Quantity: " + quantity;
    quantityText.className = "cart-prod-quantity";
    quantityText.id = `cart-quantity-${prod.id}`;
    return quantityText;
}

function CartProductTotalPrice(totalPrice) {
    let totalPriceText = document.createElement("p");
    totalPriceText.innerHTML = totalPrice.toLocaleString() + " $";
    totalPriceText.className = "cart-prod-price";
    return totalPriceText;
}

function ConfigDeleteCartButton() {
    let deleteCartProductBtn = document.createElement("btn");
    deleteCartProductBtn.className = "btn delete";
    deleteCartProductBtn.innerHTML = "X";
    deleteCartProductBtn.onclick = DeleteCartProduct;
    return deleteCartProductBtn;
}

function ConfigAddButton() {
    let addQuantityBtn = document.createElement("btn");
    addQuantityBtn.className = "btn quan-cart-add";
    addQuantityBtn.innerHTML = "+";
    addQuantityBtn.onclick = AddQuantityCart;
    return addQuantityBtn;
}

function ConfigDeductButton() {
    let deductQuantityBtn = document.createElement("btn");
    deductQuantityBtn.className = "btn quan-cart-deduct";
    deductQuantityBtn.innerHTML = "-";
    deductQuantityBtn.onclick = DeductQuantityCart;
    return deductQuantityBtn;
}

function AppendChildren(tag, nameText, addQuantityBtn, deductQuantityBtn, quantityText, totalPriceText, deleteCartProductBtn) {
    tag.appendChild(nameText);
    tag.appendChild(addQuantityBtn);
    tag.appendChild(deductQuantityBtn);
    tag.appendChild(quantityText);
    tag.appendChild(totalPriceText);
    tag.appendChild(deleteCartProductBtn);
}

function CalculteCartTotal(){
    let total = 0;
    let totalElement = document.getElementById("total");
    if(cart.length === 0)
    {
        totalElement.innerHTML=0 + " $";
        return;
    }
    cart.map((prod)=> total+=prod.totalPrice);
    totalElement.innerHTML = total.toLocaleString() + " $";
}
function LoadCatalog() {
    products.map((prod) => {
        let tag = document.createElement("p");
        let catalog = document.getElementById("catalog");

        let name = prod.name;
        let description = prod.description;
        let img = prod.image;
        let price = prod.price;

        let nameText = ProductName(name);
        let descText = ProductDescription(description);
        let imageProduct = ProductImage(img);
        let priceProduct = ProductPrice(price);

        let addToCartBtn = ConfigAddToCartButton();
        let addQuantityBtn = ConfigAddCatalogButton();
        let deductQuantityBtn = ConfigDeductCatalogButton();
        let quantityText = ProductQuantity(prod);
        



        AppendCatalogChildren(tag, nameText, descText, imageProduct, priceProduct, addQuantityBtn, deductQuantityBtn, quantityText, addToCartBtn);

        tag.className = `item ${prod.id}`;
        catalog.appendChild(tag);
    });
}

function ProductName(name) {
    let nameText = document.createElement("p");
    nameText.innerHTML = name;
    nameText.className = "bold";
    return nameText;
}

function ProductDescription(description) {
    let descText = document.createElement("p");
    descText.innerHTML = description;
    return descText;
}

function ProductImage(img) {
    let imageProduct = document.createElement("img");
    imageProduct.src = img;
    return imageProduct;
}

function ProductPrice(price) {
    let priceProduct = document.createElement("p");
    priceProduct.innerHTML = price + "$";
    return priceProduct;
}

function ConfigAddToCartButton() {
    let addToCartBtn = document.createElement("btn");
    addToCartBtn.className = "btn";
    addToCartBtn.innerHTML = "Add To Cart";
    addToCartBtn.onclick = AddToCart;
    return addToCartBtn;
}

function ConfigAddCatalogButton() {
    let addQuantityBtn = document.createElement("btn");
    addQuantityBtn.className = "btn quan";
    addQuantityBtn.innerHTML = "+";
    addQuantityBtn.onclick = AddQuantity;
    return addQuantityBtn;
}

function ConfigDeductCatalogButton() {
    let deductQuantityBtn = document.createElement("btn");
    deductQuantityBtn.className = "btn quan";
    deductQuantityBtn.innerHTML = "-";
    deductQuantityBtn.onclick = DeductQuantity;
    return deductQuantityBtn;
}

function ProductQuantity(prod) {
    let quantityText = document.createElement("p");
    quantityText.innerHTML = "0";
    quantityText.className = "quantity";
    quantityText.id = `quantity-${prod.id}`;
    return quantityText;
}

function AppendCatalogChildren(tag, nameText, descText, imageProduct, priceProduct, addQuantityBtn, deductQuantityBtn, quantityText, addToCartBtn) {
    tag.appendChild(nameText);
    tag.appendChild(descText);
    tag.appendChild(imageProduct);
    tag.appendChild(priceProduct);
    tag.appendChild(addQuantityBtn);
    tag.appendChild(deductQuantityBtn);
    tag.appendChild(quantityText);
    tag.appendChild(document.createElement("br"));
    tag.appendChild(addToCartBtn);
}

