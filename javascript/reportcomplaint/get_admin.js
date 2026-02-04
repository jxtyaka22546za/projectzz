document.addEventListener('DOMContentLoaded', function() {
    const complaintList = document.getElementById('complaint-list');
    if (complaintList) {
        fetch('Backend/insert_complaint/get_admin_complaints.php')
            .then(response => response.json())
            .then(data => {
                complaintList.innerHTML = data.map(item => `
                    <tr>
                        <td>${item.name_or_alias}</td>
                        <td>${item.subject}</td>
                        <td>${item.details}</td>
                        <td><span class="status-badge">${item.status}</span></td>
                        <td>
                            ${item.status === 'รอดำเนินการ' 
                                ? `<button class="manage-btn" onclick="handleComplaint(${item.id})">จัดการ</button>` 
                                : '<span class="text-success">✅ เรียบร้อย</span>'}
                        </td>
                    </tr>
                `).join('');
            })
            .catch(err => console.error('Fetch Error:', err));
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

function handleComplaint(complaintId) {
    if(confirm('ยืนยันว่าได้ดำเนินการข้อร้องเรียนนี้แล้วใช่หรือไม่?')) {
        fetch(`/Backend/insert_complaint/update_status.php?id=${complaintId}`)
            .then(response => response.json())
            .then(data => {
                if(data.status === 'success') {
                    alert('เปลี่ยนสถานะเป็น ดำเนินการแล้ว สำเร็จ!');
                    location.reload();
                } else {
                    alert('เกิดข้อผิดพลาด: ' + data.message);
                }
            })
            .catch(error => console.error('Error:', error));
    }
}