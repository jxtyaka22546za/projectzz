async function loadAdminData() {
    try {
        const response = await fetch('http://localhost/โปรเจค/Backend/insert_complaint/get_admin_complaints.php');
        const complaints = await response.json();
        const tableBody = document.querySelector('.table-body') || document.querySelector('tbody');
        
        if (!complaints || complaints.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="5" style="text-align:center;">ไม่พบรายการข้อร้องเรียน</td></tr>';
            return;
        }

        tableBody.innerHTML = complaints.map(item => `
            <tr>
                <td>${item.name_or_alias}</td>
                <td>${item.subject}</td>
                <td>${item.details}</td>
                <td><span class="status-badge">${item.status}</span></td>
                <td>
                    <button class="action-btn" onclick="updateStatus(${item.id})">จัดการ</button>
                </td>
            </tr>
        `).join('');

    } catch (error) {
        console.error("เกิดข้อผิดพลาดในการโหลดข้อมูล:", error);
    }
}
window.onload = loadAdminData;