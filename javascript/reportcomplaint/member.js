async function fetchComplaints() {
    const res = await fetch('http://localhost/โปรเจค/Backend/get_admin_complaints.php');
    const complaints = await res.json();
    
    const tbody = document.querySelector('.table-body');
    tbody.innerHTML = complaints.map(item => `
        <tr>
            <td>${item.name_or_alias || 'ไม่ระบุชื่อ'}</td>
            <td>${item.subject}</td>
            <td>${item.details}</td>
            <td><span class="badge">${item.status}</span></td>
            <td><button class="edit-btn">จัดการ</button></td>
        </tr>
    `).join('');
}
fetchComplaints();