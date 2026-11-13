let cart = [];

// Savatchaga qo'shish funksiyasi
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name, price, quantity: 1 });
    }
    updateCartCount();
    alert(`${name} savatchaga qo'shildi!`);
}

// Savatchadagi mahsulotlar sonini yangilash
function updateCartCount() {
    const countSpan = document.getElementById("cart-count");
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    countSpan.textContent = totalCount;
}

// Modal oynani boshqarish
const modal = document.getElementById("cart-modal");
const cartBtn = document.getElementById("cart-btn");
const closeBtn = document.querySelector(".close-btn");

cartBtn.addEventListener("click", () => {
    renderCartItems();
    modal.style.display = "block";
});

closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
});

window.addEventListener("click", (e) => {
    if (e.target === modal) {
        modal.style.display = "none";
    }
});

// Savatcha ichidagi narsalarni chiqarish
function renderCartItems() {
    const listContainer = document.getElementById("cart-items-list");
    const totalPriceSpan = document.getElementById("total-price");

    if (cart.length === 0) {
        listContainer.innerHTML = `<p class="empty-cart">Savatchangiz bo'sh</p>`;
        totalPriceSpan.textContent = "0";
        return;
    }

    listContainer.innerHTML = "";
    let totalPrice = 0;

    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        listContainer.innerHTML += `
            <div class="cart-item">
                <span>${item.name} (${item.quantity} ta)</span>
                <span>${itemTotal.toLocaleString()} so'm</span>
                <button onclick="removeItem(${index})" style="background:red; color:white; border:none; padding:5px 8px; border-radius:5px; cursor:pointer;">X</button>
            </div>
        `;
    });

    totalPriceSpan.textContent = totalPrice.toLocaleString();
}

// Mahsulotni o'chirish
function removeItem(index) {
    cart.splice(index, 1);
    updateCartCount();
    renderCartItems();
}

// Menyu filtrlash
document.addEventListener("DOMContentLoaded", () => {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const menuCards = document.querySelectorAll(".menu-card");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filterValue = button.getAttribute("data-filter");

            menuCards.forEach(card => {
                const category = card.getAttribute("data-category");
                if (filterValue === "all" || category === filterValue) {
                    card.style.display = "flex";
                } else {
                    card.style.display = "none";
                }
            });
        });
    });
});

// Buyurtmani Telegramga yuborish
document.getElementById("submit-order").addEventListener("click", () => {
    if (cart.length === 0) {
        alert("Savatchangiz bo'sh!");
        return;
    }

    const name = document.getElementById("customer-name").value.trim();
    const phone = document.getElementById("customer-phone").value.trim();
    const address = document.getElementById("customer-address").value.trim();

    if (!name || !phone || !address) {
        alert("Iltimos, barcha maydonlarni to'ldiring!");
        return;
    }

    let orderText = `🛍 *Yangi Buyurtma!*%0A%0A`;
    orderText += `👤 *Ism:* ${name}%0A`;
    orderText += `📞 *Telefon:* ${phone}%0A`;
    orderText += `📍 *Manzil:* ${address}%0A%0A`;
    orderText += `🛒 *Mahsulotlar:*%0A`;

    let totalPrice = 0;
    cart.forEach(item => {
        let itemSum = item.price * item.quantity;
        totalPrice += itemSum;
        orderText += `- ${item.name} x ${item.quantity} = ${itemSum.toLocaleString()} so'm%0A`;
    });

    orderText += `%0A💰 *Jami summa:* ${totalPrice.toLocaleString()} so'm`;

    // Telegram bot yoki akkauntga yo'naltirish (@qorafull)
    const telegramUsername = "qorafull";
    const telegramUrl = `https://t.me/${telegramUsername}?text=${orderText}`;

    window.open(telegramUrl, "_blank");
});