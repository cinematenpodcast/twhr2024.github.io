document.addEventListener('DOMContentLoaded', function () {
    var database = firebase.database();
    let teams = [];
    let editingIndex = -1;

    function fetchTeams() {
        return database.ref('teams').once('value').then(snapshot => snapshot.val()).then(data => {
            teams = data || [];
            renderTeams();
        });
    }

    function updateTeamsOnServer() {
        return database.ref('teams').set(teams);
    }

    const teamList = document.getElementById('team-list');
    const teamNameInput = document.getElementById('team-name');
    const saveTeamButton = document.getElementById('save-team');
    const deleteTeamButton = document.getElementById('delete-team');
    const formTitle = document.getElementById('form-title');

    function renderTeams() {
        teamList.innerHTML = '';
        teams.forEach((team, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="team-name">${team.name}</span>
            `;
            li.addEventListener('click', () => editTeam(index));
            teamList.appendChild(li);
        });
    }

    saveTeamButton.addEventListener('click', function () {
        const teamName = teamNameInput.value;

        if (teamName) {
            const newTeam = { name: teamName, basisValue: 0, eindValue: 0, growth: 0 };

            if (editingIndex === -1) {
                teams.push(newTeam);
            } else {
                teams[editingIndex] = newTeam;
                editingIndex = -1;
                formTitle.innerText = 'Add New Team';
                deleteTeamButton.style.display = 'none';
            }

            updateTeamsOnServer().then(() => {
                renderTeams();
                teamNameInput.value = '';
            });
        } else {
            alert('Please enter a valid team name.');
        }
    });

    function editTeam(index) {
        editingIndex = index;
        const team = teams[index];
        teamNameInput.value = team.name;
        formTitle.innerText = 'Edit Team';
        deleteTeamButton.style.display = 'inline-block';
    }

    deleteTeamButton.addEventListener('click', function () {
        if (confirm('Are you sure you want to delete this team?')) {
            teams.splice(editingIndex, 1);
            updateTeamsOnServer().then(() => {
                renderTeams();
                teamNameInput.value = '';
                editingIndex = -1;
                formTitle.innerText = 'Add New Team';
                deleteTeamButton.style.display = 'none';
            });
        }
    });

    fetchTeams();
});
