document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('wasteReportForm');
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault(); 
            const submitBtn = this.querySelector('.submit-btn');
            if(submitBtn) submitBtn.disabled = true;

            const formData = new FormData(this);
            fetch('Backend/manage_waste/reports_issue.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    return response.text().then(text => { throw new Error(text) });
                }
                return response.json();
            })
            .then(data => {
                if (data.message) {
                    alert("บันทึกข้อมูลสำเร็จ! คุณได้รับ +10 คะแนน"); 
                    window.location.href = 'แจ้งปัญหาขยะ.html'; 
                } else {
                    alert("ข้อผิดพลาด: " + data.error);
                    if(submitBtn) submitBtn.disabled = false;
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert("เกิดข้อผิดพลาด: " + error.message);
                if(submitBtn) submitBtn.disabled = false;
            });
        });
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();

            if (confirm('คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?')) {
                fetch('Backend/Dashboard สะสมแต้ม/logout.php') 
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

    const menuToggle = document.querySelector('.hamburger-menu');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }
});