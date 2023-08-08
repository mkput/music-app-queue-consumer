const { Pool } = require('pg');

class PlaylistsService {
  constructor() {
    this._pool = new Pool();
  }

  async getPlaylistSongs(playlistId) {
    const playlistQuery = {
      text: `SELECT playlists.id, playlists.name, users.username
            FROM playlists INNER JOIN users ON playlists.owner = users.id
            WHERE playlists.id = $1`,
      values: [playlistId],
    };

    const songsQuery = {
      text: `SELECT songs.id, songs.title, songs.performer
            FROM playlist_songs LEFT JOIN songs ON playlist_songs.song_id = songs.id
            WHERE playlist_songs.playlist_id = $1`,
      values: [playlistId],
    };

    const playlistResult = await this._pool.query(playlistQuery);

    if (!playlistResult.rows.length) {
      throw new NotFoundError('playlist tidak ditemukan');
    }

    const songsResult = await this._pool.query(songsQuery);
    console.log(songsResult.rows);

    return {
      ...playlistResult.rows[0],
      songs: [...songsResult.rows],
    };
  }
}

module.exports = PlaylistsService;
