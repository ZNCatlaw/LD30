var music_sprites, music, nextMusicSegment;

music_sprites = {
  full: [0, 255000],
  part1: [0, 125000],
  part2: [125000, 130000]
}

music = new Howl({
  src: ['assets/music.ogg', 'assets/music.mp3'],
  sprite: music_sprites,
  volume: 0,
  onload: function() { nextMusicSegment(); }
});

nextMusicSegment = function nextMusicSegment(current_sprite, fade_time) {
  if (current_sprite == null) { current_sprite = _.sample(['part1', 'full']); }
  if (fade_time == null) { fade_time = 10000;}

  var duration = music_sprites[current_sprite][1];

  music.once('play', function(sound_id){
    // Fade in
    console.log('SND: Fade in "' + current_sprite + '" (' + fade_time + 'ms)');
    music.fade(0, 1, fade_time, sound_id);

    //Determine next sound.
    var next_sprite;
    if (current_sprite == 'part1') {
      next_sprite = _.sample(['part1', 'full']);
    } else if (current_sprite == 'part2'){
      next_sprite = _.sample(['part1', 'part2', 'full']);
    } else if (current_sprite == 'full'){
      next_sprite = _.sample(['part1', 'part2']);
    }

    // Set fade timer
    var timer = duration - fade_time;
    console.log('SND: Next "' + next_sprite + '" (in '+ timer +'ms)');
    setTimeout(function(){
      nextMusicSegment(next_sprite);
      console.log('SND: Fade out "' + current_sprite + '" (' + fade_time + 'ms)');
      music.fade(1, 0, fade_time, sound_id);
    }, timer);

  });

  music.play(current_sprite);
};
