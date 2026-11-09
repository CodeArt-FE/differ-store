// رقم الواتساب الخاص بالبراند DIFFER (اكتبي رقمك هنا بالشكل الدولي بدون علامة + مثل: 201234567890)
const brandPhoneNumber = "201029053373"; 

let cart = [];

// 1. فتح وإغلاق قائمة السلة الجانبية
function toggleCart() {
    const drawer = document.getElementById('cart-drawer');
    drawer.classList.toggle('open');
}

// 2. تصفية المنتجات حسب القسم (شتوي، صيفي، أو الكل)
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach(btn => btn.classList.remove('active'));
    event && event.target.classList.add('active');

    products.forEach(product => {
        let productCategory = product.getAttribute('data-category');
        if (category === 'all' || productCategory === category) {
            product.style.display = 'block';
        } else {
            product.style.display = 'none';
        }
    });
}

// 3. إضافة منتج للسلة
function addToCart(name, price) {
    let existingItem = cart.find(item => item.name === name);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ name: name, price: price, quantity: 1 });
    }
    updateCartUI();
    alert("تمت إضافة المنتج إلى السلة بنجاح!");
}

// 4. تحديث واجهة السلة والعداد الإجمالي
function updateCartUI() {
    const cartItemsList = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const totalPriceSpan = document.getElementById('total-price');

    cartItemsList.innerHTML = '';
    let total = 0;
    let totalCount = 0;

    cart.forEach(item => {
        total += item.price * item.quantity;
        totalCount += item.quantity;

        let li = document.createElement('li');
        li.innerHTML = `<span>${item.name} (x${item.quantity})</span> <span>${item.price * item.quantity} ج.م</span>`;
        cartItemsList.appendChild(li);
    });

    cartCount.innerText = totalCount;
    totalPriceSpan.innerText = total;
}

// 5. تأكيد الطلب، إرساله للواتساب، ثم تفريغ السلة تلقائياً
function sendOrderToWhatsApp() {
    if (cart.length === 0) {
        alert("سلة الشراء فارغة!");
        return;
    }

    let message = "مرحباً DIFFER 👋، أريد تأكيد الطلب التالي:\n\n";
    cart.forEach((item, index) => {
        message += `${index + 1}. ${item.name} - العدد: ${item.quantity} - السعر: ${item.price * item.quantity} ج.م\n`;
    });

    let total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\nإجمالي المبلغ المطلوب: ${total} ج.م`;
    message += `\n\nشكراً لكم!`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${brandPhoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');

    // تفريغ السلة وتحديث الشاشة بعد الإرسال
    cart = [];
    updateCartUI();
    toggleCart();
}

// 6. زر البحث المحسّن (يأخذك أوتوماتيكياً لقسم المنتجات ويظهر المطلوب فوراً)
function openSearch() {
    let searchTerm = prompt("ابحث عن منتج في متجر DIFFER:");
    if (!searchTerm) return;

    searchTerm = searchTerm.toLowerCase().trim();
    let products = document.querySelectorAll('.product-card');
    let foundCount = 0;
    let firstMatchedProduct = null;

    products.forEach(product => {
        let titleElement = product.querySelector("h3");
        let productText = titleElement ? titleElement.innerText.toLowerCase() : "";

        if (productText.includes(searchTerm)) {
            product.style.display = "block";
            foundCount++;
            if (!firstMatchedProduct) {
                firstMatchedProduct = product; // حفظ أول منتج تم إيجاده
            }
        } else {
            product.style.display = "none";
        }
    });

    if (foundCount > 0) {
        // الانتقال التلقائي (Scroll) إلى قسم المنتجات أو أول منتج مطابق
        document.getElementById('shop').scrollIntoView({ behavior: 'smooth' });
    } else {
        alert("عذراً، لم يتم العثور على منتج بهذا الاسم.");
        // إعادة إظهار كافة المنتجات إذا لمש يتم العثور على شيء
        products.forEach(p => p.style.display = "block");
    }
}