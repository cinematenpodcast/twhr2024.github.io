document.addEventListener('DOMContentLoaded', function () {
    var database = firebase.database();
    let teams = [];

    // Fetch teams from Firebase and render them
    function fetchTeams() {
        return database.ref('teams').once('value').then(snapshot => snapshot.val()).then(data => {
            if (data) {
                teams = data;
                renderTeams();
            }
        });
    }

    // Update team data in Firebase
    function updateTeamData(index, basisValue, eindValue, growth) {
        return database.ref('teams/' + index).update({ basisValue, eindValue, growth });
    }

    const teamList = document.getElementById('team-list');
    
    // Render the teams
    function renderTeams() {
        teamList.innerHTML = '';
        
        teams.forEach((team, index) => {
            const li = document.createElement('li');
            li.classList.add('team-item');
            
            // Default to 0 growth if basisValue is not set
            const growth = team.basisValue > 0 ? ((team.eindValue - team.basisValue) / team.basisValue * 100).toFixed(2) : 0;
            
            li.innerHTML = `
                <div class="team-info">
                    <span class="team-name">${team.name}</span>
                    <span class="team-growth" id="growth-${index}">${growth}% growth</span>
                </div>
                <div class="input-container">
                    <input type="number" min="0" class="basis-value" placeholder="Basis" data-index="${index}" value="${team.basisValue || 0}">
                    <input type="number" min="0" class="eind-value" placeholder="Eind" data-index="${index}" value="${team.eindValue || 0}">
                </div>
            `;
            teamList.appendChild(li);
        });
    }

    // Handle input changes and update growth immediately
    teamList.addEventListener('input', function (event) {
        const index = event.target.dataset.index;
        const basisValue = parseFloat(document.querySelector(`input.basis-value[data-index="${index}"]`).value) || 0;
        const eindValue = parseFloat(document.querySelector(`input.eind-value[data-index="${index}"]`).value) || 0;

        if (basisValue > 0) {
            const growth = ((eindValue - basisValue) / basisValue * 100).toFixed(2);
            teams[index].basisValue = basisValue;
            teams[index].eindValue = eindValue;
            teams[index].growth = growth;

            // Update the growth percentage in the UI
            document.getElementById(`growth-${index}`).textContent = `${growth}% growth`;

            // Update team data in Firebase
            updateTeamData(index, basisValue, eindValue, growth);
        }
    });

    fetchTeams();
});
