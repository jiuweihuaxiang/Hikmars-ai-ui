<template>
  <HikWebRtcVideo ref="videoPlayer" :options="playerOptions" />
</template>

<script>
import axios from 'axios'
import * as mediasoupClient from 'mediasoup-client'

export default {
  name: 'webrtc-video',

  methods: {
    // 获取流
    async getStream () {
      await axios.post(`/webrtc/watch/${this.streamName}`).then(data => data.data)
    },
    // 加载Device
    async loadDevice () {
      const responseData = await axios
        .get(`/webrtc/getRouterRtpCapabilities/${this.streamName}`)
        .then(data => data.data)
      this.device = new mediasoupClient.Device()
      await this.device.load({ routerRtpCapabilities: responseData })
    },
    // 消费端
    async consume (transport) {
      const { rtpCapabilities } = this.device
      const data = await axios
        .post(`/webrtc/consume/${this.streamName}`, { rtpCapabilities })
        .then(data => data.data)
      const { producerId, id, kind, rtpParameters } = data

      let codecOptions = {}
      const consumer = await transport.consume({
        id,
        producerId,
        kind,
        rtpParameters,
        codecOptions
      })
      const stream = new MediaStream()
      stream.addTrack(consumer.track)
      return stream
    },
    // 创建消费端运输
    async createComsumerTransport () {
      const responseData = await axios
        .get(`/webrtc/createConsumerTransport/${this.streamName}`)
        .then(data => data.data)
      const transport = this.device.createRecvTransport(responseData)

      transport.on('connect', ({ dtlsParameters }, callback, errback) => {
        axios
          .post(`/webrtc/connectConsumerTransport/${this.streamName}`, {
            transportId: transport.id,
            dtlsParameters
          })
          .then(callback)
          .catch(errback)
      })

      const stream = await this.consume(transport)
      this.videoElement.srcObject = stream
      this.videoElement.play()
      axios.get(`/webrtc/resume/${this.streamName}`)
    },
    // 视频开始按钮点击
    async videoButtonClick () {
      await this.getStream()
      await this.loadDevice()
      await this.createComsumerTransport()
    }
  },

  mounted () {
    this.$nextTick(() => {
      this.videoElement = this.$refs.videoPlayer.getVideoElement()
      this.player = this.$refs.videoPlayer.player
      this.player.bigPlayButton.on('click', this.videoButtonClick)
    })
  },

  data () {
    return {
      videoElement: {},
      streamName: 'timer',
      device: {},
      player: null,

      playerOptions: {
        height: '360',
        autoplay: false,
        language: 'en',
        muted: true,
        controls: true,
        playbackRates: [0.7, 1.0, 1.5, 2.0]
      }
    }
  }
}
</script>
