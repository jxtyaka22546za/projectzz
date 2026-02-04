document.addEventListener('DOMContentLoaded', function() {
    // === 1. ส่วนดึงข้อมูลสมาชิกมาแสดงผล (Code เดิมของคุณ) ===
    fetch('Backend/จัดการสมาชิก/get_staff.php')
        .then(response => response.json())
        .then(data => {
            const wrapper = document.getElementById('member-list-wrapper');
            if (!wrapper) return;
            wrapper.innerHTML = ''; 

            if (data.length === 0) {
                wrapper.innerHTML = '<li class="member-item">ไม่พบข้อมูล</li>';
                return;
            }

            data.forEach(staff => {
                const li = document.createElement('li');
                li.className = 'member-item';
                li.innerHTML = `
                    <div class="user-info">
                        <strong>${staff.username}</strong>
                        <div style="font-size: 0.85em; color: #666;">
                            ${staff.email} | ${staff.role} | ${staff.created_at}
                        </div>
                    </div>
                `;
                wrapper.appendChild(li);
            });
        })
        .catch(error => {
            console.error('Fetch Error:', error);
            const wrapper = document.getElementById('member-list-wrapper');
            if (wrapper) {
                wrapper.innerHTML = '<li style="color:red;">เชื่อมต่อฐานข้อมูลล้มเหลว</li>';
            }
        });

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();

            if (confirm('คุณต้องการออกจากระบบเจ้าหน้าที่ใช่หรือไม่?')) {
                fetch('Backend/logout.php') 
                    .then(() => {
                        localStorage.clear(); 
                        sessionStorage.clear();

                        alert('ออกจากระบบเรียบร้อย✅');
                        
                        window.location.replace('index.html'); 
                    })
                    .catch(error => {
                        console.error('Logout Error:', error);
                        localStorage.clear();
                        window.location.replace('index.html');
                    });
            }
        });
    }
});