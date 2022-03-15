<template>
  <div v-loading="headLoading" class="head-container">
    <img class="logo" src="@images/logo.png">
    <div class="operation-container">
      <span class="operation-item" @click="goToLapa">
        <span class="backUsercenter">
          <i class="lapa icon-fanhui" />
          <span>返回认证中心</span>
        </span>
      </span>
      <span class="operation-item">
        <i class="lapa icon-user" />
        {{ (getUserInfo && getUserInfo.securityUser && getUserInfo.securityUser.name) ? getUserInfo.securityUser.name : '' }}
      </span>
      <span class="operation-item" @click="loginOut">
        <i class="lapa icon-exit" />
        退出
      </span>
    </div>
  </div>
</template>
<script>
import record from '@/utils/certificationCenter.ts';

export default {
  name: 'HeaderDemo',
  components: {},
  data () {
    return {
      headLoading: false
    }
  },
  computed: {
    getUserInfo () {
      return this.$store.getters['layout/userInfo'];
    }
  },
  watch: {},
  created () {
    this.init();
  },
  // 页面渲染完
  mounted () { },
  // 组件销毁前
  beforeUnmount () { },

  methods: {
    init () { },
    goToLapa () {
      record.backOauth();
    },
    loginOut () {
      record.outSystemLogin().then(res => {
        res.defaultHand();
      });
    }
  }
};
</script>
<style lang="less" scoped>
.head-container {
  display: flex;
  height: @head-height;
  background: @head-background;
  .logo {
    margin: 10px 10px 0 20px;
    height: 30px;
  }
  .operation-container {
    flex: 100;
    color: #fff;
    text-align: right;
  }
  .operation-item {
    display: inline-block;
    padding: 0px 10px;
    height: 100%;
    line-height: 50px;
    cursor: pointer;
    vertical-align: top;
  }

  .backUsercenter {
    align-items: center;
    padding: 6px 14px;
    margin: 0;
    border-radius: 14px;
    line-height: 16px;
    cursor: pointer;
    &:hover {
      background: rgba(216, 216, 216, 0.22);
    }
    i {
      margin-right: 6px;
    }
  }
}
</style>