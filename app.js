// Global State & Dynamic Data Handlers for IPSF Official Portal
document.addEventListener('DOMContentLoaded', () => {
    // Set Current Date in Header
    const dateDisplay = document.getElementById('currentDateDisplay');
    if (dateDisplay) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateDisplay.innerText = new Date().toLocaleDateString('ar-EG', options);
    }

    // Initial Data Fetching
    fetchAdminStructure();
    fetchBranches();
    fetchBodies();
    fetchNewsArticles();
    fetchMediaLibrary();
});

// Modal Toggle Helper
function toggleModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.toggle('hidden');
    }
}

// 1. Navigation & Tab Switcher
function switchTab(tabId) {
    // Hide all tab content sections
    document.querySelectorAll('.tab-content').forEach(section => {
        section.classList.add('hidden');
    });

    // Reset Desktop Tab Buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active-tab');
        btn.classList.add('text-gray-200');
    });

    // Reset Mobile Tab Buttons
    document.querySelectorAll('[id^="mob-tab-"]').forEach(btn => {
        btn.classList.remove('bg-diplomatic-gold', 'text-diplomatic-dark');
        btn.classList.add('bg-diplomatic-card', 'text-white');
    });

    // Show Selected Tab Section
    const selectedSection = document.getElementById(`section-${tabId}`);
    if (selectedSection) {
        selectedSection.classList.remove('hidden');
    }

    // Activate Selected Desktop Button
    const activeDesktopBtn = document.getElementById(`tab-${tabId}`);
    if (activeDesktopBtn) {
        activeDesktopBtn.classList.add('active-tab');
    }

    // Activate Selected Mobile Button
    const activeMobileBtn = document.getElementById(`mob-tab-${tabId}`);
    if (activeMobileBtn) {
        activeMobileBtn.classList.remove('bg-diplomatic-card', 'text-white');
        activeMobileBtn.classList.add('bg-diplomatic-gold', 'text-diplomatic-dark');
    }
}

// 2. Fetch & Render Administrative Structure (الهيكل الإداري الشبكي)
async function fetchAdminStructure() {
    const container = document.getElementById('adminStructureGrid');
    if (!container) return;

    try {
        const { data, error } = await supabaseClient
            .from('admin_structure')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="col-span-full py-12 text-center bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 text-gray-500">
                    <i class="fa-solid fa-users-slash text-3xl mb-2 text-diplomatic-gold"></i>
                    <p class="font-bold">لا يوجد أعضاء في الهيكل الإداري حالياً.</p>
                    <p class="text-xs text-gray-400 mt-1">يمكن إضافة الأعضاء والصور والألقاب بسهولة عبر لوحة التحكم.</p>
                </div>
            `;
            return;
        }

        // بناء الشبكة الهيكلية كما في المخطط (7 خانات بكل سطر في الشاشات العريضة)
        container.className = "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4 md:gap-5";

        container.innerHTML = data.map(member => `
            <div class="bg-white rounded-2xl p-3 border border-diplomatic-border shadow-sm hover:shadow-xl hover:border-diplomatic-gold transition-all duration-300 flex flex-col items-center text-center group">
                <div class="w-full aspect-square bg-diplomatic-sand rounded-xl overflow-hidden mb-2.5 border border-gray-200 relative">
                    <img src="${member.photo_url || 'https://via.placeholder.com/300x300?text=IPSF'}" 
                         alt="${member.name}" 
                         class="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                         onerror="this.src='https://via.placeholder.com/300x300?text=صورة+العضو'">
                </div>
                <h4 class="font-extrabold text-xs md:text-sm text-diplomatic-dark leading-tight line-clamp-1 mb-1">${member.name}</h4>
                <p class="text-[10px] md:text-xs text-diplomatic-deep font-bold bg-diplomatic-gold/10 px-2 py-0.5 rounded-full border border-diplomatic-border w-full truncate">${member.title}</p>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = `<div class="col-span-full p-4 text-center text-red-500 text-sm font-bold">خطأ في تحميل الهيكل: ${err.message}</div>`;
    }
}

// 3. Fetch & Render Branches (الفروع)
async function fetchBranches() {
    const container = document.getElementById('branchesGrid');
    if (!container) return;

    try {
        const { data, error } = await supabaseClient
            .from('branches')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="col-span-full py-12 text-center bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 text-gray-500">
                    <p class="font-bold">لم يتم تسجيل فروع أو مكاتب حتى الآن.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = data.map(branch => `
            <div class="bg-white rounded-2xl overflow-hidden shadow-md border border-diplomatic-border flex flex-col md:flex-row hover:shadow-xl transition-all border-r-4 border-r-diplomatic-gold">
                <img src="${branch.cover_image || 'https://via.placeholder.com/300x200?text=Branch'}" class="w-full md:w-48 h-48 object-cover" onerror="this.src='https://via.placeholder.com/300x200?text=IPSF+Branch'">
                <div class="p-5 flex-1 space-y-2">
                    <span class="bg-diplomatic-gold/15 text-diplomatic-dark text-xs font-bold px-2.5 py-1 rounded-md border border-diplomatic-border">${branch.country_city || 'مكتب دولي'}</span>
                    <h3 class="text-xl font-black text-diplomatic-dark">${branch.branch_name}</h3>
                    <p class="text-xs text-gray-600 leading-relaxed">${branch.description || 'لا يوجد وصف متاح.'}</p>
                </div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = `<div class="col-span-full p-4 text-center text-red-500 text-sm">خطأ في تحميل الفروع: ${err.message}</div>`;
    }
}

// 4. Fetch & Render Bodies (الهيئات والمراكز)
async function fetchBodies() {
    const container = document.getElementById('bodiesGrid');
    if (!container) return;

    try {
        const { data, error } = await supabaseClient
            .from('bodies')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="col-span-full py-12 text-center bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 text-gray-500">
                    <p class="font-bold">لم يتم إضافة هيئات أو مراكز حالياً.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = data.map(body => `
            <div class="bg-white p-6 rounded-2xl shadow-md border border-diplomatic-border space-y-3 hover:shadow-xl transition-all border-r-4 border-r-diplomatic-gold">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-diplomatic-dark text-diplomatic-gold flex items-center justify-center font-bold text-xl border border-diplomatic-border">
                        <i class="fa-solid fa-shield-halved"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-black text-diplomatic-dark">${body.body_name}</h3>
                        <span class="text-xs text-gray-400 font-medium">جهة معتمدة تابعة للمنتدى</span>
                    </div>
                </div>
                <p class="text-xs text-gray-600 leading-relaxed">${body.description || 'لا توجد تفاصيل حالية.'}</p>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = `<div class="col-span-full p-4 text-center text-red-500 text-sm">خطأ في تحميل الهيئات: ${err.message}</div>`;
    }
}

// 5. Fetch & Render Newspaper Articles (الجريدة الرسمية)
async function fetchNewsArticles() {
    const container = document.getElementById('newsFeed');
    if (!container) return;

    try {
        const { data, error } = await supabaseClient
            .from('news_articles')
            .select('*')
            .order('published_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="col-span-full py-12 text-center bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 text-gray-500">
                    <p class="font-bold">لا توجد منشورات في الجريدة حتى اللحظة.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = data.map(news => `
            <div class="bg-white rounded-2xl overflow-hidden shadow-md border border-diplomatic-border flex flex-col hover:shadow-xl transition-all">
                ${news.media_url ? `<img src="${news.media_url}" class="w-full h-48 object-cover" onerror="this.style.display='none'">` : ''}
                <div class="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-center text-xs mb-2">
                            <span class="bg-diplomatic-gold/20 text-diplomatic-dark font-black px-2.5 py-1 rounded-md border border-diplomatic-border">${news.category || 'خبر رسمي'}</span>
                            <span class="text-gray-400 font-medium"><i class="fa-regular fa-calendar ml-1"></i>${news.published_at}</span>
                        </div>
                        <h3 class="font-black text-lg text-diplomatic-dark leading-snug mb-2">${news.title}</h3>
                        <p class="text-xs text-gray-600 leading-relaxed line-clamp-3">${news.content}</p>
                    </div>
                </div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = `<div class="col-span-full p-4 text-center text-red-500 text-sm">خطأ في تحميل الجريدة: ${err.message}</div>`;
    }
}

// 6. Fetch & Render Media Library (المكتبة المرئية)
async function fetchMediaLibrary() {
    const container = document.getElementById('mediaGrid');
    if (!container) return;

    try {
        const { data, error } = await supabaseClient
            .from('media_library')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="col-span-full py-12 text-center bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 text-gray-500">
                    <p class="font-bold">المكتبة المرئية فارغة حالياً.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = data.map(item => `
            <div class="bg-white rounded-2xl overflow-hidden shadow-md border border-diplomatic-border space-y-2 hover:shadow-xl transition-all">
                <img src="${item.media_url}" class="w-full h-48 object-cover" alt="${item.title}" onerror="this.src='https://via.placeholder.com/400x250?text=IPSF+Media'">
                <div class="p-4">
                    <h4 class="font-black text-diplomatic-dark text-sm">${item.title}</h4>
                    <p class="text-xs text-gray-500 mt-1">${item.description || ''}</p>
                </div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = `<div class="col-span-full p-4 text-center text-red-500 text-sm">خطأ في تحميل المكتبة: ${err.message}</div>`;
    }
}

// 7. Admin Authentication & Dynamic Forms Logic
async function handleAdminLogin(e) {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const btn = document.getElementById('loginSubmitBtn');

    btn.disabled = true;
    btn.innerText = "جاري المصادقة...";

    try {
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) throw error;

        document.getElementById('loginFormSection').classList.add('hidden');
        document.getElementById('adminPanelSection').classList.remove('hidden');
        alert("تم تسجيل الدخول بنجاح إلى لوحة الإدارة السيادية.");
    } catch (err) {
        alert("فشل تسجيل الدخول: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "تسجيل الدخول للنظام";
    }
}

function logoutAdmin() {
    supabaseClient.auth.signOut();
    document.getElementById('adminPanelSection').classList.add('hidden');
    document.getElementById('loginFormSection').classList.remove('hidden');
}

// Display Dynamic Form in Modal
function showAdminForm(type) {
    const box = document.getElementById('adminFormBox');
    if (!box) return;
    box.classList.remove('hidden');

    if (type === 'structure') {
        box.innerHTML = `
            <h4 class="font-black mb-2 text-diplomatic-dark">إضافة عضو جديد للهيكل الإداري</h4>
            <form onsubmit="submitStructure(event)" class="space-y-2">
                <input type="text" id="mName" placeholder="الاسم الكامل" required class="w-full p-2.5 border rounded-xl text-xs bg-white">
                <input type="text" id="mTitle" placeholder="المسمى الوظيفي / الصفة القيادية" required class="w-full p-2.5 border rounded-xl text-xs bg-white">
                <input type="url" id="mPhoto" placeholder="رابط صورة العضو (URL)" class="w-full p-2.5 border rounded-xl text-xs bg-white">
                <input type="number" id="mOrder" placeholder="ترتيب الظهور (مثال: 1, 2, 3...)" value="0" class="w-full p-2.5 border rounded-xl text-xs bg-white">
                <button type="submit" class="bg-diplomatic-dark text-diplomatic-gold px-4 py-2.5 rounded-xl font-bold w-full text-xs shadow-md">حفظ وإضافة للهيكل</button>
            </form>
        `;
    } else if (type === 'branch') {
        box.innerHTML = `
            <h4 class="font-black mb-2 text-diplomatic-dark">إضافة فرع / مكتب جديد</h4>
            <form onsubmit="submitBranch(event)" class="space-y-2">
                <input type="text" id="bName" placeholder="اسم الفرع" required class="w-full p-2.5 border rounded-xl text-xs bg-white">
                <input type="text" id="bCountry" placeholder="الدولة / المدينة" required class="w-full p-2.5 border rounded-xl text-xs bg-white">
                <input type="url" id="bCover" placeholder="رابط صورة غلاف الفرع (URL)" class="w-full p-2.5 border rounded-xl text-xs bg-white">
                <textarea id="bDesc" placeholder="نبذة عن الفرع" class="w-full p-2.5 border rounded-xl text-xs bg-white"></textarea>
                <button type="submit" class="bg-diplomatic-dark text-diplomatic-gold px-4 py-2.5 rounded-xl font-bold w-full text-xs shadow-md">حفظ الفرع</button>
            </form>
        `;
    } else if (type === 'news') {
        box.innerHTML = `
            <h4 class="font-black mb-2 text-diplomatic-dark">نشر خبر أو قرار في الجريدة</h4>
            <form onsubmit="submitNews(event)" class="space-y-2">
                <input type="text" id="nTitle" placeholder="عنوان الخبر أو القرار" required class="w-full p-2.5 border rounded-xl text-xs bg-white">
                <textarea id="nContent" placeholder="محتوى التفاصيل والقرارات" required class="w-full p-2.5 border rounded-xl text-xs bg-white"></textarea>
                <input type="url" id="nMedia" placeholder="رابط صورة مرفقة (اختياري)" class="w-full p-2.5 border rounded-xl text-xs bg-white">
                <button type="submit" class="bg-diplomatic-dark text-diplomatic-gold px-4 py-2.5 rounded-xl font-bold w-full text-xs shadow-md">نشر في الجريدة الرسمية</button>
            </form>
        `;
    } else if (type === 'media') {
        box.innerHTML = `
            <h4 class="font-black mb-2 text-diplomatic-dark">إضافة توثيق مرئي للمكتبة</h4>
            <form onsubmit="submitMedia(event)" class="space-y-2">
                <input type="text" id="medTitle" placeholder="عنوان الصورة / التوثيق" required class="w-full p-2.5 border rounded-xl text-xs bg-white">
                <input type="url" id="medUrl" placeholder="رابط الصورة (URL)" required class="w-full p-2.5 border rounded-xl text-xs bg-white">
                <button type="submit" class="bg-diplomatic-dark text-diplomatic-gold px-4 py-2.5 rounded-xl font-bold w-full text-xs shadow-md">رفع إلى المكتبة المرئية</button>
            </form>
        `;
    }
}

// Admin Submissions Execution
async function submitStructure(e) {
    e.preventDefault();
    const name = document.getElementById('mName').value;
    const title = document.getElementById('mTitle').value;
    const photo_url = document.getElementById('mPhoto').value;
    const sort_order = parseInt(document.getElementById('mOrder').value) || 0;

    const { error } = await supabaseClient.from('admin_structure').insert([{ name, title, photo_url, sort_order }]);
    if (error) alert(error.message);
    else { alert("تمت إضافة القيادة للهيكل بنجاح"); fetchAdminStructure(); }
}

async function submitBranch(e) {
    e.preventDefault();
    const branch_name = document.getElementById('bName').value;
    const country_city = document.getElementById('bCountry').value;
    const cover_image = document.getElementById('bCover').value;
    const description = document.getElementById('bDesc').value;

    const { error } = await supabaseClient.from('branches').insert([{ branch_name, country_city, cover_image, description }]);
    if (error) alert(error.message);
    else { alert("تمت إضافة الفرع بنجاح"); fetchBranches(); }
}

async function submitNews(e) {
    e.preventDefault();
    const title = document.getElementById('nTitle').value;
    const content = document.getElementById('nContent').value;
    const media_url = document.getElementById('nMedia').value;

    const { error } = await supabaseClient.from('news_articles').insert([{ title, content, media_url }]);
    if (error) alert(error.message);
    else { alert("تم النشر في الجريدة الرسمية بنجاح"); fetchNewsArticles(); }
}

async function submitMedia(e) {
    e.preventDefault();
    const title = document.getElementById('medTitle').value;
    const media_url = document.getElementById('medUrl').value;

    const { error } = await supabaseClient.from('media_library').insert([{ title, media_url, type: 'image' }]);
    if (error) alert(error.message);
    else { alert("تم الحفظ في المكتبة المرئية"); fetchMediaLibrary(); }
}
