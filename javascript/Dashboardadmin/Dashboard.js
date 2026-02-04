function fetchDashboardData() {
    console.log("กำลังดึงข้อมูล..."); 

    fetch('Backend/Dashboardadmin/api_stats.php?t=' + new Date().getTime())
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log("ข้อมูลที่ได้รับ:", data);
            
            const elements = {
                'reports-num': data.reports,
                'donations-num': data.donations,
                'complaints-num': data.complaints,
                'users-num': data.users
            };

            for (const [id, value] of Object.entries(elements)) {
                const el = document.getElementById(id);
                if (el) {
                    el.innerText = value !== undefined ? value : 0;
                }
            }
        })
        .catch(error => {
            console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', error);
        });
}

document.addEventListener('DOMContentLoaded', function() {
    
    fetchDashboardData();
    setInterval(fetchDashboardData, 5000);

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

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}