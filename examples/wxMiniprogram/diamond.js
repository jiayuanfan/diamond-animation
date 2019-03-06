// components/diamond/diamond.js
const App = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 从黑步出现到钻石出现中间的过渡等待毫秒数
    waitMs: {
      type: Number,
      value: 1000,
    },
    // 钻石停留毫秒数
    middlePauseMs: {
      type: Number,
      value: 3000,
    },
    // 钻石飞完黑布停留毫秒数
    endWaitMs: {
      type: Number,
      value: 0
    },
    // 语音评价（1：excellent；2：awesome；3：good-job）
    comment: {
      type: Number,
      value: 3
    },
    // 钻石落地点的x（坐标原点左上角）
    flyEndpointX: {
      type: Number,
      value: App.globalData.pageWidth
    },
    // 钻石落地点的y（坐标原点左上角）
    flyEndpointY: {
      type: Number,
      value: 0
    },
    // 整个主体宽（px）
    width: {
      type: Number,
      value: 200
    },
    // 整个主体高（px）
    height: {
      type: Number,
      value: 200
    },
    // 主体的left（px）
    left: {
      type: Number,
      value: 100
    },
    // 主体的top（px）
    top: {
      type: Number,
      value: 200
    },
    // 动画结束的回调事件名
    callbackEventName: {
      type: String,
      value: 'diamondcallback'
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    silkClassName: 'silk',
    diamondClassName: 'diamond',
    starClassName: 'star',
    rippleDdt1ClassName: 'ddt1',
    rippleDdt2ClassName: 'ddt2',
    innerBreathClassName: 'inner-breath',
    spreadClassName: 'spread',
    containerStyle: '',
    diamondStyle: '',
    innerAudioContext: null
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 执行整个动画流程
    startAnimation() {
      setTimeout(() => {
        // 执行出现动画
        this.playCommentAudio();
        this.animationStep1();

        setTimeout(() => {
          // 获取落地点
          const endpoint = this.transferFlyEndpoint();

          // 执行飞行动画
          this.playDiamondFlyAudio();
          this.animationStep2(endpoint.x, endpoint.y);

          setTimeout(() => {
            // 通知调用组建的页面
            this.triggerEvent(this.properties.callbackEventName, {
              success: 1
            })
          }, this.properties.endWaitMs + 800);
        }, this.properties.middlePauseMs);
      }, this.properties.waitMs);
    },

    // 初始化数据
    initAnimationData() {
      const containerStyle = `width: ${this.properties.width}px; height: ${this.properties.height}px;left: ${this.properties.left}px;top: ${this.properties.top}px;`;

      const initData = {};
      initData['containerStyle'] = containerStyle;

      if (wx.createInnerAudioContext) {
        initData['innerAudioContext'] = wx.createInnerAudioContext();
      }

      this.setData(initData);
    },

    // 整体出现的动画
    animationStep1() {
      this.setData({
        silkClassName: 'silk silk-animation',
        diamondClassName: 'diamond diamond-animation',
        starClassName: 'star init-star-animation',
        rippleDdt1ClassName: 'ddt1 init-ddt1-animation',
        rippleDdt2ClassName: 'ddt2 init-ddt2-animation',
        innerBreathClassName: 'inner-breath init-inner-breath-animation',
        spreadClassName: 'spread spread-animation'
      });

      setTimeout(() => {
        this.setData({
          rippleDdt1ClassName: 'ddt1 ddt1-animation',
          rippleDdt2ClassName: 'ddt2 ddt2-animation'
        });
      }, 200);

      setTimeout(() => {
        this.setData({
          starClassName: 'star star-animation',
          innerBreathClassName: 'inner-breath inner-breath-animation'
        });
      }, 300);
    },

    // 钻石飞出的动画
    animationStep2(endpointX, endpointY) {
      this.setData({
        silkClassName: 'silk hide-silk-animation',
        starClassName: 'star hide-star-animation',
        rippleDdt1ClassName: 'ddt1 hide-ddt1-animation',
        rippleDdt2ClassName: 'ddt2 hide-ddt2-animation',
        innerBreathClassName: 'inner-breath hide-inner-breath-animation',
        spreadClassName: 'spread hide-spread-animation'
      });

      setTimeout(() => {
        this.setData({
          diamondClassName: 'diamond hide-diamond-animation',
          diamondStyle: `top: ${endpointY}px; left: ${endpointX}px; width: 18.6px; height: 30px; transition: width 0.4s linear, height 0.4s linear, left 0.4s linear, top 0.4s cubic-bezier(0, 0.3, 0.3, 0.99)`
        });
      }, 300);
    },

    // 处理钻石飞出的落地点坐标
    transferFlyEndpoint() {
      return {
        x: this.properties.flyEndpointX - this.properties.left,
        y: this.properties.flyEndpointY - this.properties.top
      }
    },

    // 播放初始显示时的评价音效
    playCommentAudio() {
      switch (this.properties.comment) {
        case 1:
          this.playAudio('');
          break;
        
        case 2:
          this.playAudio('');
          break;

        case 3:
          this.playAudio('');
          break;

        default:
          break;
      }
    },

    // 播放钻石飞出的轨迹音效
    playDiamondFlyAudio() {
      this.playAudio('');
    },

    playAudio(src) {
      const { innerAudioContext } = this.data;

      if(innerAudioContext) {
        innerAudioContext.src = src;
        innerAudioContext.play();
        return;
      }

      wx.playVoice({
        filePath: src,
      });
      return;
    }
  },

  // 整个组件创建时事件处理
  attached() {
    this.initAnimationData();
    this.startAnimation();
  },

  // 整个组件销毁时事件处理
  detached() {
    console.log('钻石特效组件被销毁了');
  },
})
