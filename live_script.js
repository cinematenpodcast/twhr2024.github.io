document.addEventListener('DOMContentLoaded', function () {
    var database = firebase.database();

    // Fetch the team data from Firebase
    function fetchTeams() {
        return database.ref('teams').once('value').then(snapshot => snapshot.val());
    }

    // Render the team data column-wise
    function renderTeams(teams) {
        // Sort teams by growth percentage
        teams.sort((a, b) => parseFloat(b.growth || 0) - parseFloat(a.growth || 0));

        const teamList = document.getElementById('team-list');
        teamList.innerHTML = '';

        const totalTeams = teams.length;
        const columnCount = 3; // We want 3 columns
        const teamsPerColumn = Math.ceil(totalTeams / columnCount); // Calculate how many teams per column

        // Create arrays to hold the teams for each column
        const columns = [[], [], []];

        // Distribute teams vertically down each column
        for (let row = 0; row < teamsPerColumn; row++) {
            for (let col = 0; col < columnCount; col++) {
                const index = row + col * teamsPerColumn;
                if (teams[index]) {
                    columns[col][row] = teams[index];
                }
            }
        }

        // Now render the columns
        for (let col = 0; col < columnCount; col++) {
            const column = document.createElement('div');
            column.classList.add('team-column');

            for (let row = 0; row < teamsPerColumn; row++) {
                const team = columns[col][row];
                if (team) { // Only render if a team exists (might be fewer teams in last rows)
                    const growth = (team.growth && !isNaN(parseFloat(team.growth))) ? parseFloat(team.growth).toFixed(2) : '0.00';

                    const li = document.createElement('li');
                    li.innerHTML = `
                        <div class="team-info">
                            <span class="team-name">${team.name}</span>
                            <span class="team-growth">${growth}%</span>
                        </div>
                    `;
                    column.appendChild(li); // Add each team to the column
                }
            }

            teamList.appendChild(column); // Add the column to the list
        }
    }

    // Function to update the live view with the fetched team data
    function updateLiveView() {
        fetchTeams().then(teams => {
            if (teams) {
                renderTeams(teams);
            }
        });
    }

    // Initial data fetch and setup for live updates
    updateLiveView();
    setInterval(updateLiveView, 5000); // Refresh every 5 seconds
});