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
        btn.classList.add('text-white');
    });

    // Reset Mobile Tab Buttons
    document.querySelectorAll('[id^="mob-tab-"]').forEach(btn => {
        btn.classList.remove('bg-brand-gold', 'text-brand-dark');
        btn.classList.add('bg-brand-primary', 'text-white');
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
        activeMobileBtn.classList.remove('bg-brand-primary', 'text-white');
        activeMobileBtn.classList.add('bg-brand-gold', 'text-brand-dark');
    }
}

// 2. Fetch & Render Administrative Structure (الإدارة العامة)
async function fetchAdminStructure() {
    const container = document.getElementById('adminStructureGrid');
    try {
        const { data, error } = await supabaseClient
            .from('admin_structure')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="col-span-full p-8 text-center bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-500">
                    <i class="fa-solid fa-users-slash text-3xl mb-2 text-brand-gold"></i>
                    <p class="font-bold">لا يوجد أعضاء في الهيكل الإداري حالياً.</p>
                    <p class="text-xs">يمكن للمشرف إضافتهم من لوحة التحكم.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = data.map(member => `
            <div class="bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex flex-col items-center text-center hover:shadow-xl transition-all border-t-4 border-brand-gold">
                <img src="${member.photo_url || 'https://via.placeholder.com/150?text=Member'}" alt="${member.name}" class="w-24 h-24 rounded-full object-cover border-2 border-brand-gold mb-3 shadow">
                <h4 class="font-bold text-lg text-brand-dark">${member.name}</h4>
                <p class="text-xs font-bold text-brand-primary bg-brand-sand px-3 py-1 rounded-full mt-1 border border-brand-gold/20">${member.title}</p>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = `<div class="col-span-full p-4 text-center text-red-500 text-sm">خطأ في تحميل البيانات: ${err.message}</div>`;
    }
}

// 3. Fetch & Render Branches (الفروع)
async function fetchBranches() {
    const container = document.getElementById('branchesGrid');
    try {
        const { data, error } = await supabaseClient
            .from('branches')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="col-span-full p-8 text-center bg-white rounded-2xl shadow-sm border text-gray-500">
                    <p class="font-bold">لم يتم تسجيل فروع حتى الآن.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = data.map(branch => `
            <div class="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col md:flex-row hover:shadow-xl transition-all">
                <img src="${branch.cover_image || 'https://via.placeholder.com/300x200?text=Branch'}" class="w-full md:w-48 h-48 object-cover">
                <div class="p-5 flex-1 space-y-2">
                    <span class="bg-brand-primary/10 text-brand-primary text-xs font-bold px-2.5 py-0.5 rounded-full">${branch.country_city || 'فرع دولي'}</span>
                    <h3 class="text-xl font-extrabold text-brand-dark">${branch.branch_name}</h3>
                    <p class="text-xs text-gray-600 leading-relaxed">${branch.description || 'لا يوجد وصف متاح.'}</p>
                </div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = `<div class="col-span-full p-4 text-center text-red-500 text-sm">خطأ في تحميل الفروع: ${err.message}</div>`;
    }
}

// 4. Fetch & Render Bodies (الهيئات)
async function fetchBodies() {
    const container = document.getElementById('bodiesGrid');
    try {
        const { data, error } = await supabaseClient
            .from('bodies')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="col-span-full p-8 text-center bg-white rounded-2xl shadow-sm border text-gray-500">
                    <p class="font-bold">لم يتم إضافة هيئات حالياً.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = data.map(body => `
            <div class="bg-white p-6 rounded-2xl shadow-md border border-gray-100 space-y-3 hover:shadow-xl transition-all border-r-4 border-brand-gold">
                <div class="flex items-center gap-3">
                    <div class="w-12 h-12 rounded-xl bg-brand-primary/10 text-brand-primary flex items-center justify-center font-bold text-xl">
                        <i class="fa-solid fa-shield-halved"></i>
                    </div>
                    <div>
                        <h3 class="text-xl font-bold text-brand-dark">${body.body_name}</h3>
                        <span class="text-xs text-gray-400">جهة تابعة للمنتدى</span>
                    </div>
                </div>
                <p class="text-xs text-gray-600 leading-relaxed">${body.description || 'لا يوجد تفاصيل حالية.'}</p>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = `<div class="col-span-full p-4 text-center text-red-500 text-sm">خطأ في تحميل الهيئات: ${err.message}</div>`;
    }
}

// 5. Fetch & Render Newspaper Articles (الجريدة الرسمية)
async function fetchNewsArticles() {
    const container = document.getElementById('newsFeed');
    try {
        const { data, error } = await supabaseClient
            .from('news_articles')
            .select('*')
            .order('published_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="col-span-full p-8 text-center bg-white rounded-2xl shadow-sm border text-gray-500">
                    <p class="font-bold">لا توجد منشورات في الجريدة حتى اللحظة.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = data.map(news => `
            <div class="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 flex flex-col hover:shadow-xl transition-all">
                ${news.media_url ? `<img src="${news.media_url}" class="w-full h-48 object-cover">` : ''}
                <div class="p-5 space-y-3 flex-1 flex flex-col justify-between">
                    <div>
                        <div class="flex justify-between items-center text-xs mb-2">
                            <span class="bg-brand-gold/20 text-brand-dark font-bold px-2.5 py-1 rounded-md border border-brand-gold/30">${news.category || 'خبر'}</span>
                            <span class="text-gray-400"><i class="fa-regular fa-calendar"></i> ${news.published_at}</span>
                        </div>
                        <h3 class="font-extrabold text-lg text-brand-dark leading-snug mb-2">${news.title}</h3>
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
    try {
        const { data, error } = await supabaseClient
            .from('media_library')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            container.innerHTML = `
                <div class="col-span-full p-8 text-center bg-white rounded-2xl shadow-sm border text-gray-500">
                    <p class="font-bold">المكتبة المرئية فارغة حالياً.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = data.map(item => `
            <div class="bg-white rounded-2xl overflow-hidden shadow-md border border-gray-100 space-y-2 hover:shadow-xl transition-all">
                <img src="${item.media_url}" class="w-full h-48 object-cover" alt="${item.title}">
                <div class="p-4">
                    <h4 class="font-bold text-brand-dark text-sm">${item.title}</h4>
                    <p class="text-xs text-gray-500 mt-1">${item.description || ''}</p>
                </div>
            </div>
        `).join('');
    } catch (err) {
        container.innerHTML = `<div class="col-span-full p-4 text-center text-red-500 text-sm">خطأ في تحميل المكتبة: ${err.message}</div>`;
    }
}

// 7. Admin Authentication & Form Display
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
        alert("تم تسجيل الدخول بنجاح.");
    } catch (err) {
        alert("فشل تسجيل الدخول: " + err.message);
    } finally {
        btn.disabled = false;
        btn.innerText = "دخول لوحة التحكم";
    }
}

function logoutAdmin() {
    supabaseClient.auth.signOut();
    document.getElementById('adminPanelSection').classList.add('hidden');
    document.getElementById('loginFormSection').classList.remove('hidden');
}

// Display Dynamic Form for Admin Actions
function showAdminForm(type) {
    const box = document.getElementById('adminFormBox');
    box.classList.remove('hidden');

    if (type === 'structure') {
        box.innerHTML = `
            <h4 class="font-bold mb-2">إضافة عضو جديد للهيكل الإداري</h4>
            <form onsubmit="submitStructure(event)" class="space-y-2">
                <input type="text" id="mName" placeholder="اسم العضو واللقب" required class="w-full p-2 border rounded text-xs">
                <input type="text" id="mTitle" placeholder="الصفة / المسمى الوظيفي" required class="w-full p-2 border rounded text-xs">
                <input type="url" id="mPhoto" placeholder="رابط صورة العضو (URL)" class="w-full p-2 border rounded text-xs">
                <button type="submit" class="bg-brand-primary text-white px-4 py-2 rounded font-bold w-full text-xs">حفظ وإضافة</button>
            </form>
        `;
    } else if (type === 'branch') {
        box.innerHTML = `
            <h4 class="font-bold mb-2">إضافة فرع جديد</h4>
            <form onsubmit="submitBranch(event)" class="space-y-2">
                <input type="text" id="bName" placeholder="اسم الفرع (مثال: فرع إسبانيا)" required class="w-full p-2 border rounded text-xs">
                <input type="text" id="bCountry" placeholder="الدولة / المدينة" required class="w-full p-2 border rounded text-xs">
                <textarea id="bDesc" placeholder="نبذة عن الفرع" class="w-full p-2 border rounded text-xs"></textarea>
                <button type="submit" class="bg-brand-primary text-white px-4 py-2 rounded font-bold w-full text-xs">حفظ الفرع</button>
            </form>
        `;
    } else if (type === 'news') {
        box.innerHTML = `
            <h4 class="font-bold mb-2">نشر خبر أو قرار بالجريدة</h4>
            <form onsubmit="submitNews(event)" class="space-y-2">
                <input type="text" id="nTitle" placeholder="عنوان الخبر / القرار" required class="w-full p-2 border rounded text-xs">
                <textarea id="nContent" placeholder="تفاصيل الخبر" required class="w-full p-2 border rounded text-xs"></textarea>
                <input type="url" id="nMedia" placeholder="رابط صورة مرفقة (اختياري)" class="w-full p-2 border rounded text-xs">
                <button type="submit" class="bg-brand-primary text-white px-4 py-2 rounded font-bold w-full text-xs">نشر الآن</button>
            </form>
        `;
    } else if (type === 'media') {
        box.innerHTML = `
            <h4 class="font-bold mb-2">إضافة مادة للمكتبة المرئية</h4>
            <form onsubmit="submitMedia(event)" class="space-y-2">
                <input type="text" id="medTitle" placeholder="عنوان الصورة / التوثيق" required class="w-full p-2 border rounded text-xs">
                <input type="url" id="medUrl" placeholder="رابط الصورة (URL)" required class="w-full p-2 border rounded text-xs">
                <button type="submit" class="bg-brand-primary text-white px-4 py-2 rounded font-bold w-full text-xs">رفع للمكتبة</button>
            </form>
        `;
    }
}

// Admin Submissions Logic
async function submitStructure(e) {
    e.preventDefault();
    const name = document.getElementById('mName').value;
    const title = document.getElementById('mTitle').value;
    const photo_url = document.getElementById('mPhoto').value;

    const { error } = await supabaseClient.from('admin_structure').insert([{ name, title, photo_url }]);
    if (error) alert(error.message);
    else { alert("تمت الإضافة بنجاح"); fetchAdminStructure(); }
}

async function submitBranch(e) {
    e.preventDefault();
    const branch_name = document.getElementById('bName').value;
    const country_city = document.getElementById('bCountry').value;
    const description = document.getElementById('bDesc').value;

    const { error } = await supabaseClient.from('branches').insert([{ branch_name, country_city, description }]);
    if (error) alert(error.message);
    else { alert("تمت إضافة الفرع"); fetchBranches(); }
}

async function submitNews(e) {
    e.preventDefault();
    const title = document.getElementById('nTitle').value;
    const content = document.getElementById('nContent').value;
    const media_url = document.getElementById('nMedia').value;

    const { error } = await supabaseClient.from('news_articles').insert([{ title, content, media_url }]);
    if (error) alert(error.message);
    else { alert("تم نشر الخبر بنجاح"); fetchNewsArticles(); }
}

async function submitMedia(e) {
    e.preventDefault();
    const title = document.getElementById('medTitle').value;
    const media_url = document.getElementById('medUrl').value;

    const { error } = await supabaseClient.from('media_library').insert([{ title, media_url, type: 'image' }]);
    if (error) alert(error.message);
    else { alert("تم الإضافة للمكتبة"); fetchMediaLibrary(); }
}
