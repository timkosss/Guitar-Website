const input = document.getElementById("songInput");

input.addEventListener("keydown", function(event) {
  if (event.key === "Enter") {
    addSong();
  }
});

// Function to retrieve the list of songs from localStorage
function getSongs() {
    return JSON.parse(localStorage.getItem('songs') || '[]');
}

// Function to save the list of songs to localStorage
function saveSongs(songs) {
    localStorage.setItem('songs', JSON.stringify(songs));
}

// Function to create and return a list item element for a song, including a link to its details and a delete button
function renderSongItem(song) {
    const li = document.createElement('li');
    const link = document.createElement('a');
    link.textContent = song.title;
    link.href = 'song_info.html?songId=' + encodeURIComponent(song.id);

    const statusSpan = document.createElement('span');
    statusSpan.textContent = song.status ? song.status : '';
    statusSpan.style.marginLeft = '10px';
    statusSpan.style.marginRight = '15px';
    
    // Map status to color (red to green)
    const statusColors = {
        'Just Started': '#e74c3c',      // Red
        'Know The Chords': '#f39c12',   // Orange
        'Can Play': '#f1c40f',          // Yellow
        'Almost There': '#2ecc71',      // Light Green
        'Mastered': '#27ae60'           // Green
    };
    statusSpan.style.color = statusColors[song.status] || '#888';

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.onclick = function() {
        let songs = getSongs();
        songs = songs.filter(s => s.id !== song.id);
        saveSongs(songs);
        li.remove();
    };

    li.appendChild(link);
    li.appendChild(statusSpan);
    li.appendChild(deleteBtn);
    return li;
}

// Function to load and display all songs in the song list on the page
function loadSongs() {
    const list = document.getElementById('songList');
    list.innerHTML = '';
    const songs = getSongs();
    songs.slice().reverse().forEach(song => {
        list.appendChild(renderSongItem(song));
    });
}

// Function to add a new song to the list and save it to localStorage
function addSong() {
    const input = document.getElementById('songInput');
    const title = input.value.trim();

    if (title === '') return;

    const song = { id: Date.now().toString(), title: title};

    const songs = getSongs();
    songs.push(song);
    saveSongs(songs);

    const li = renderSongItem(song);
    document.getElementById('songList').prepend(li);

    input.value = '';
}

// Event listener that runs when the DOM content is loaded, calling loadSongs to display the songs
window.addEventListener('DOMContentLoaded', loadSongs);

