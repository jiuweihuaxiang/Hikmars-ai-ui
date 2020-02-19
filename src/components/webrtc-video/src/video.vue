<template>
  <div class="video-player" v-if="reseted">
    <video class="video-js" ref="videoPlayer"></video>
  </div>
</template>

<script>
import videojs from 'video.js'
import 'video.js/dist/video-js.css'

const DEFAULT_EVENTS = [
  'loadeddata',
  'canplay',
  'canplaythrough',
  'play',
  'pause',
  'waiting',
  'playing',
  'ended',
  'error'
]

export default {
  name: 'HikWebRtcVideo',

  props: {
    options: {
      type: Object,
      default: () => {}
    },
    srcObject: {
      type: Object,
      default: () => {}
    }
  },

  methods: {
    initialize () {
      const emitPlayerState = (event, value) => {
        if (value) {
          this.$emit(event, value)
        } else if (event) {
          this.$emit(event, this.player)
        }
      }

      this.$refs.videoPlayer.setAttribute('playsinline', true)
      this.$refs.videoPlayer.setAttribute('webkit-playsinline', true)
      this.$refs.videoPlayer.setAttribute('x5-playsinline', true)
      this.$refs.videoPlayer.setAttribute('x5-video-player-type', 'h5')
      this.$refs.videoPlayer.setAttribute('x5-video-player-fullscreen', false)

      this.player = videojs(this.$refs.videoPlayer, this.options, function () {
        const events = DEFAULT_EVENTS
        for (let i = 0; i < events.length; i++) {
          // emit events
          (event => {
            this.on(event, () => {
              emitPlayerState(event)
            })
          })(events[i])
        }

        // time update
        this.on('timeupdate', function () {
          emitPlayerState('timeupdate', this.currentTime())
        })

        // player ready
        emitPlayerState('ready')
      })
    }
  },

  watch: {
    options: {
      deep: true,
      handle (options, oldOptions) {
        this.player.pause()
        this.player.dispose()
        this.player = null
        this.reseted = false
        this.$nextTick(() => {
          this.reseted = true
        })
        this.$nextTick(() => {
          this.initialize()
        })
      }
    }
  },

  mounted () {
    if (!this.player) {
      this.initialize()
    }
  },
  beforeDestroy () {
    if (this.player) {
      this.player.dispose()
    }
  },

  data () {
    return {
      player: null,
      reseted: true
    }
  }
}
</script>

<style>
video:focus {
  outline: none;
}
</style>
