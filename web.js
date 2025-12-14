// javascript for mathak store

console.log("mathak store loaded!");

// cookie data
var cookieData = [
    {
        id: 1,
        name: "chocolate cookies",
        description: "soft with chocolate chips",
        price: 3.00,
        category: "cookies",
        image: "ookies.jpg"
    },
    {
        id: 2,
        name: "red velvet cookies",
        description: "soft red cookies",
        price: 4.00,
        category: "cookies",
        image: "red-velvet-cookies.jpg"
    },
    {
        id: 3,
        name: "brownie cake",
        description: "chocolate cake",
        price: 8.00,
        category: "cakes",
        image: "brownie-cake.jpg"
    },
    {
        id: 4,
        name: "cookies cake",
        description: "cake for sharing",
        price: 7.00,
        category: "cakes",
        image: "cookies-cake.jpg"
    },
    {
        id: 5,
        name: "tiramisu",
        description: "coffee dessert",
        price: 6.00,
        category: "cakes",
        image: "tiramisu.jpg"
    },
    {
        id: 6,
        name: "cookie bites",
        description: "small cookies box",
        price: 15.00,
        category: "boxes",
        image: "Cookie bites.PNG"
    },
    {
        id: 7,
        name: "brownies bites",
        description: "chocolate bites",
        price: 15.00,
        category: "boxes",
        image: "Brownies bites.PNG"
    },
    {
        id: 8,
        name: "mixed bites",
        description: "cookies and brownies",
        price: 18.00,
        category: "boxes",
        image: "brownie-and-cookie-bites.jpg"
    },
    {
        id: 9,
        name: "cup cookies",
        description: "cookies in cups",
        price: 16.00,
        category: "boxes",
        image: "Cup cookies.JPG"
    },
    {
        id: 10,
        name: "feuilletine cake",
        description: "crunchy cake",
        price: 16.00,
        category: "cakes",
        image: "feuilletine cake.JPG"
    }
];

// get elements
var menuToggle = document.getElementById('menuToggle');
var mainNav = document.querySelector('.main-nav');
var cartSidebar = document.getElementById('cartSidebar');
var cartOverlay = document.getElementById('cartOverlay');
var closeCart = document.querySelector('.close-cart');
var cartCount = document.querySelector('.cart-count');

// cart
var cart = [];
if (localStorage.getItem('mathakCart')) {
    cart = JSON.parse(localStorage.getItem('mathakCart'));
}

// custom cookie settings
var customCookie = {
    base: "vanilla",
    icing: "vanilla",
    topping: "chips",
    message: ""
};

// page loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("page ready");
    
    setupMenu();
    setupFilters();
    setupCart();
    updateCartCount();
    setupAddButtons();
    setupCustomCookieBuilder();
    updateCustomDescription();
});

// menu 
function setupMenu() {
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
        });
    }
}

// filter buttons
function setupFilters() {
    var filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            // remove active from all
            filterButtons.forEach(function(btn) {
                btn.classList.remove('active');
            });
            
            // add to clicked
            this.classList.add('active');
            
            var filter = this.getAttribute('data-filter');
            filterItems(filter);
        });
    });
}

// filter items
function filterItems(filter) {
    var allItems = document.querySelectorAll('.cookie-card');
    
    allItems.forEach(function(item) {
        var category = item.getAttribute('data-category');
        
        if (filter === 'all' || category === filter) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}

// cart setup
function setupCart() {
    var cartLink = document.querySelector('a[href="#cart"]');
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            openCart();
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', closeCartFunc);
    }
    
    if (cartOverlay) {
        cartOverlay.addEventListener('click', closeCartFunc);
    }
    
    // checkout button
    var checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('cart is empty!');
                return;
            }
            
            var total = 0;
            for (var i = 0; i < cart.length; i++) {
                total += cart[i].price * cart[i].quantity;
            }
            
            alert('thanks! total: ' + total.toFixed(2) + ' lyd\n(this is a demo)');
            
            cart = [];
            updateCart();
            closeCartFunc();
        });
    }
}

// open cart
function openCart() {
    if (cartSidebar) cartSidebar.classList.add('active');
    if (cartOverlay) cartOverlay.classList.add('active');
    showCartItems();
}

// close cart
function closeCartFunc() {
    if (cartSidebar) cartSidebar.classList.remove('active');
    if (cartOverlay) cartOverlay.classList.remove('active');
}

// setup add to cart buttons
function setupAddButtons() {
    var buttons = document.querySelectorAll('.add-to-cart:not(#addCustomCookie)');
    buttons.forEach(function(button) {
        button.addEventListener('click', function() {
            var card = this.closest('.cookie-card');
            var id = parseInt(card.getAttribute('data-id'));
            addToCart(id);
        });
    });
}

// add to cart
function addToCart(id) {
    var cookie = cookieData.find(function(item) {
        return item.id === id;
    });
    
    if (!cookie) return;
    
    var existing = cart.find(function(item) {
        return item.id === id;
    });
    
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: cookie.id,
            name: cookie.name,
            price: cookie.price,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(cookie.name);
}

// update cart
function updateCart() {
    localStorage.setItem('mathakCart', JSON.stringify(cart));
    updateCartCount();
    showCartItems();
}

// update cart count
function updateCartCount() {
    if (!cartCount) return;
    
    var total = 0;
    for (var i = 0; i < cart.length; i++) {
        total += cart[i].quantity;
    }
    
    cartCount.textContent = total;
}

// show cart items
function showCartItems() {
    var container = document.querySelector('.cart-items');
    var totalElement = document.querySelector('.total-price');
    
    if (!container) return;
    
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">cart is empty</p>';
        if (totalElement) totalElement.textContent = '0.00 lyd';
        return;
    }
    
    var total = 0;
    
    cart.forEach(function(item) {
        var itemElement = document.createElement('div');
        itemElement.className = 'cart-item';
        itemElement.innerHTML = `
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>${item.price.toFixed(2)} lyd × ${item.quantity}</p>
            </div>
            <div class="cart-item-actions">
                <span class="cart-item-total">${(item.price * item.quantity).toFixed(2)} lyd</span>
                <button class="remove-item" data-id="${item.id}">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        container.appendChild(itemElement);
        
        total += item.price * item.quantity;
    });
    
    //  remove listeners
    var removeButtons = document.querySelectorAll('.remove-item');
    removeButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var id = parseInt(this.getAttribute('data-id'));
            removeFromCart(id);
        });
    });
    
    if (totalElement) {
        totalElement.textContent = total.toFixed(2) + ' lyd';
    }
}

// remove from cart
function removeFromCart(id) {
    cart = cart.filter(function(item) {
        return item.id !== id;
    });
    updateCart();
}

// show notification
function showNotification(name) {
    // create notification
    var notif = document.createElement('div');
    notif.className = 'cart-notification';
    notif.innerHTML = '<i class="fas fa-check"></i> added ' + name;
    notif.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: green;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        z-index: 1000;
    `;
    
    document.body.appendChild(notif);
    
    // remove after 2 seconds
    setTimeout(function() {
        if (notif.parentNode) {
            document.body.removeChild(notif);
        }
    }, 2000);
}

function setupCustomCookieBuilder() {
    // setup option buttons
    var optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var optionType = this.getAttribute('data-option');
            var value = this.getAttribute('data-value');
            
            // remove active from same type
            var sameType = document.querySelectorAll('.option-btn[data-option="' + optionType + '"]');
            sameType.forEach(function(btn) {
                btn.classList.remove('active');
            });
            
            // add active to clicked
            this.classList.add('active');
            
            // update custom cookie
            customCookie[optionType] = value;
            updateCustomDescription();
        });
    });
    
    // custom message input
    var messageInput = document.getElementById('cookieMessage');
    if (messageInput) {
        messageInput.addEventListener('input', function() {
            customCookie.message = this.value;
            updateCustomDescription();
        });
    }
    
    // add custom cookie button
    var addCustomBtn = document.getElementById('addCustomCookie');
    if (addCustomBtn) {
        addCustomBtn.addEventListener('click', addCustomCookieToCart);
    }
}

// update custom cookie description
function updateCustomDescription() {
    var descElement = document.getElementById('cookieDescription');
    if (!descElement) return;
    
    var description = customCookie.base + ' cookie';
    
    if (customCookie.icing !== 'none') {
        description += ' with ' + customCookie.icing;
    }
    
    if (customCookie.topping !== 'none') {
        description += ' and ' + customCookie.topping;
    }
    
    if (customCookie.message) {
        description += ' - "' + customCookie.message + '"';
    }
    
    descElement.textContent = description;
}

// add custom cookie to cart
function addCustomCookieToCart() {
    var cookieName = "custom " + customCookie.base + " cookie";
    
    if (customCookie.message) {
        cookieName = customCookie.message + " cookie";
    }
    
    var customItem = {
        id: Date.now(),
        name: cookieName,
        description: customCookie.base + " cookie with " + customCookie.icing + " and " + customCookie.topping,
        price: 5.00,
        quantity: 1
    };
    
    cart.push(customItem);
    updateCart();
    showNotification("custom cookie");
    
    // reset message
    var messageInput = document.getElementById('cookieMessage');
    if (messageInput) {
        messageInput.value = "";
        customCookie.message = "";
        updateCustomDescription();
    }
}

document.querySelectorAll('a[href^="#"]').forEach(function(link) {
    link.addEventListener('click', function(e) {
        var href = this.getAttribute('href');
        
        if (href === '#cart') {
            e.preventDefault();
            openCart();
            return;
        }
        
        e.preventDefault();
        var target = document.querySelector(href);
        if (target) {
            window.scrollTo({
                top: target.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});