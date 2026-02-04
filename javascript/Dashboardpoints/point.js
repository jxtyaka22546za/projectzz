document.addEventListener('DOMContentLoaded', function() {

    function updateDashboard() {
        fetch(encodeURI('Backend/Dashboard สะสมแต้ม/get_leaderboard_api.php'))
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
            
                if (!data || !data.leaderboard) return;

            
                const myPointsElement = document.getElementById('my-points');
                if (myPointsElement) {
                
                    myPointsElement.innerText = Number(data.my_points).toLocaleString();
                }

                const lb = data.leaderboard;
                const top1 = lb[0] || { username: '---', points: 0 };
                const top2 = lb[1] || { username: '---', points: 0 };
                const top3 = lb[2] || { username: '---', points: 0 };

                const rank1Name = document.getElementById('rank1-name');
                if (rank1Name) rank1Name.innerText = top1.username;
                const rank1Points = document.getElementById('rank1-points');
                if (rank1Points) rank1Points.innerText = Number(top1.points).toLocaleString() + " แต้ม";

                const rank2Name = document.getElementById('rank2-name');
                if (rank2Name) rank2Name.innerText = top2.username;
                const rank2Points = document.getElementById('rank2-points');
                if (rank2Points) rank2Points.innerText = Number(top2.points).toLocaleString() + " แต้ม";

                const rank3Name = document.getElementById('rank3-name');
                if (rank3Name) rank3Name.innerText = top3.username;
                const rank3Points = document.getElementById('rank3-points');
                if (rank3Points) rank3Points.innerText = Number(top3.points).toLocaleString() + " แต้ม";

                const listContainer = document.getElementById('rankings-list-container');
                if (listContainer) {
                    listContainer.innerHTML = '';
                    lb.slice(3).forEach((user, index) => {
                        const rankNum = index + 4;
                        const listItem = `
                            <li class="list-item">
                                <span class="rank-number">#${rankNum}</span>
                                <img src="img/Profile.png" alt="Profile">
                                <span class="name">${user.username}</span>
                                <span class="points">${Number(user.points).toLocaleString()} แต้ม</span>
                            </li>
                        `;
                        listContainer.innerHTML += listItem;
                    });
                }

                updateLevel(data.my_points); 
            })
            .catch(error => {
                console.error('Error fetching leaderboard:', error);
            }); 
    } 

    function updateLevel(points) {
        const levelText = document.getElementById('level-text');
        if (levelText) {
            if (points >= 500) {
                levelText.innerText = "นักรบขยะ";
            } else {
                levelText.innerText = "ผู้พิทักษ์ชุมชน";
            }
        }
    }

    updateDashboard();
});