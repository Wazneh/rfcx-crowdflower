require({
    paths: {
      "wavesurfer": "https://cdn.jsdelivr.net/wavesurfer.js/1.0.51/wavesurfer.min",
      "wavesurfer-timeline":"https://d1gbw6jvuihkp4.cloudfront.net/tmp/wavesurfer.timeline.min",
      "wavesurfer-regions":"https://cdn.jsdelivr.net/wavesurfer.js/1.0.51/plugin/wavesurfer.regions.min"
    },
    map: {
      "*" : { "jquery" : "jquery-noconflict" }
    },
    shim: {
      "wavesufer": {
        exports: "WaveSurfer"
      },
      "wavesurfer-timeline": {
        deps: ["wavesurfer"]
      },
      "wavesurfer-regions": {
        deps: ["wavesurfer"]
      }
    }
  }, [ "jquery-noconflict", "wavesurfer", "wavesurfer-regions", "wavesurfer-timeline"],
  function($) {

    var flower = {
      wavesurfer: Object.create(WaveSurfer),
      regions: {},
      indexes: [4,3,2,1],
      init: function () {
        this.cache();
        this.initWavesurfer();

        this.wavesurfer.load(this.audioUrl);
      },
      cache: function() {
        this.$wave = $('#wave');
        this.region = undefined;
        this.audioUrl = this.$wave.attr('data-audio-url');
        this.imgUrl   = this.$wave.attr('data-img-url');
        this.start    = parseInt(this.$wave.attr('data-start'))/1000;
        this.duration = parseInt(this.$wave.attr('data-duration'))/1000;
      },
      initWavesurfer: function() {
        this.wavesurfer.init({
          container: document.querySelector('#wave'),
          cursorColor: '#FFFFFF',
          waveColor: '#A8DBA8',
          progressColor: '#3B8686',
          regionColor: 'rgba(255, 255, 255, 0.5)',
          height: 300,
          backend: 'MediaElement',
          autoCenter: false,
          scrollParent: false,
          hideScrollbar: true
        });

        this.wavesurfer.on('ready', function () {
          this.bindEvents();
          this.setSpectrogram();
          this.initRegions();
          this.initTimeline();
          this.addMainRegion();
          this.setViewport();
          this.setViewport();
        }.bind(this));
      },
      bindEvents: function() {
        this.wavesurfer.on('region-created', function(evRegion) {
          if (evRegion.id == 'main-region') {
            return;
          }
          $('#noEvents').hide().find('input[type="checkbox"]').prop('checked', false);
          var list = evRegion.wavesurfer.regions.list;

          if (Object.keys(list).length > 4) {
            return;
          }
          var index = this.indexes.pop();
          this.regions[evRegion.id] = index;
          $('.wavesurfer-region[data-id=' + evRegion.id + ']').attr('data-region-label', index);
          $('#event' + index).removeClass('_hidden').find('input[type="checkbox"]').click();
          $(evRegion.element).append('<a href="javascript:void(0);" data-id="' + evRegion.id + '" class="cross js-delete-region" title="Delete region">&#10005;</a>');
        }.bind(this));

        this.wavesurfer.on('region-update-end', function(evRegion) {
          // wait for internal wavesurfer methods set cursor to their position and then set cursor to start of the region
          setTimeout(function() {
            // set cursor to main region start point
            if (evRegion.id == 'main-region') {
              this.wavesurfer.seekTo(0);
              this.wavesurfer.skip(evRegion.start);
            }
            var list = evRegion.wavesurfer.regions.list;
            if (Object.keys(list).length > 5) {
              this.wavesurfer.regions.list[evRegion.id].remove();
              return;
            }
            var index = this.regions[evRegion.id];
            this.updateInputs({
              index: index,
              start: evRegion.start.toFixed(2),
              end: evRegion.end.toFixed(2)
            });
          }.bind(this), 100);
        }.bind(this));

        this.wavesurfer.on('region-removed', function(evRegion) {
          var index = this.regions[evRegion.id];
          if (!index) {
            return;
          }
          this.updateInputs({
            index: index,
            start: '',
            end: ''
          });
          $('#event' + index).addClass('_hidden').find('input[type="checkbox"]').click();
          delete this.regions[evRegion.id];
        }.bind(this));

        this.$wave.on('click', '.js-delete-region', function(ev) {
          var $this = $(ev.target),
              id    = $this.attr('data-id'),
              index = this.regions[id];
          this.indexes.push(index);
          this.indexes = this.indexes.sort();
          this.indexes = this.indexes.reverse();
          this.wavesurfer.regions.list[id].remove();
          if (this.indexes.length == 4) {
            $('#noEvents').show().find('input[type="checkbox"]');
          }
        }.bind(this));

        document.querySelector('[data-action="play"]').addEventListener('click', this.wavesurfer.playPause.bind(this.wavesurfer));
      },
      updateInputs: function(data) {
        var $eventContainer = $('#event' + data.index);
        $eventContainer.find('.js-event-start').find('input').val(data.start);
        $eventContainer.find('.js-event-end').find('input').val(data.end);
      },
      setSpectrogram: function() {
        this.$wave.find('wave > canvas').css({
          'background-image': 'url(' + this.imgUrl + ')',
          'background-size': '100% 100%'
        });
      },
      initRegions: function() {
        if (this.wavesurfer.enableDragSelection) {
          this.wavesurfer.enableDragSelection({
            color: 'rgba(255, 255, 255, 0.3)',
            loop: false
          });
        }
      },
      initTimeline: function() {
        var timeline = Object.create(WaveSurfer.Timeline);

        timeline.init({
          wavesurfer: this.wavesurfer,
          container: "#wave-timeline"
        });
      },
      addMainRegion: function() {
        setTimeout(function() {
          this.region = this.wavesurfer.addRegion({
            id: 'main-region',
            start: this.start,
            end: this.start + this.duration,
            color: 'rgba(0, 0, 0, 0.3)',
            loop: true,
            drag: false,
            resize: false
          });
        }.bind(this), 1500);
      },
      setViewport: function() {
        this.wavesurfer.zoom(this.$wave.width()/this.duration);
        this.wavesurfer.seekTo(0);
        this.wavesurfer.skip(this.start);
        setInterval(function() {
          $('#wave > wave').scrollLeft(this.$wave.width()/this.duration * this.start);
        }.bind(this), 10);
      }
    };

    $(function() {
      flower.init();
    });
  });