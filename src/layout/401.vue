<template>
  <div class="errPage-container">
    <div class="errPage-main">
      <div>
        <img
          :src="errGifGif"
          alt="Girl has dropped her ice cream."
          height="428"
          width="313"
        >
      </div>
      <div style="flex: 100; min-width: 230px; padding-top: 50px;">
        <!-- <h1 class="text-jumbo text-ginormous">
          抱歉，你没有该页面权限，无法访问!
        </h1> -->
        <h1 style="margin-bottom: 10px">
          抱歉，你没有该页面权限，无法访问!
        </h1>
        <h2 style="margin-top: 25px;">
          你可以点击 返回首页 或 重新登录 切换账号！
        </h2>
        <div style="margin-top: 50px; padding-left: 30px;">
          <!-- <a
            class="bullshit__return-home"
            href="/"
          >返回首页</a> -->
          <el-button
            type="primary"
            @click="goToPageHome"
          >
            返回首页
          </el-button>
          <el-button
            type="primary"
            @click="loginOut"
          >
            重新登录
          </el-button>
        </div>
      </div>
      <!-- </el-row> -->
    </div>
  </div>
</template>

<script lang="ts" setup>
  import errGif from '@images/401.gif';
  const errGifGif = errGif + '?' + +new Date();
  const loginOut = () => {}
  const goToPageHome = () => {
    const location = window.location;
    window.location.href = `${location.origin}${location.pathname}`;
  }
</script>

<style lang="less" scoped>
  .errPage-container {
    position: relative;
    height: 100%;
    background: #fff;
    .errPage-main{
      display: flex;
      position: absolute;
      max-width: 90%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .pan-back-btn {
      background: #008489;
      color: #fff;
      border: none !important;
    }
    .pan-gif {
      margin: 0 auto;
      display: block;
    }
    .pan-img {
      display: block;
      margin: 0 auto;
      width: 100%;
    }
    .text-jumbo {
      font-size: 46px;
      font-weight: 700;
      color: #484848;
      margin-bottom: 10px;
    }
    .bullshit__return-home {
        display: block;
        width: 110px;
        height: 36px;
        background: #1482f0;
        border-radius: 100px;
        text-align: center;
        color: #ffffff;
        font-size: @font-size;
        line-height: 36px;
        cursor: pointer;
        animation-name: slideUp;
        animation-duration: 0.5s;
        animation-delay: 0.3s;
        animation-fill-mode: forwards;
      }
    .list-unstyled {
      font-size: 16px;
      font-weight: bolder;
      margin-top: 10px;
      li {
        padding-bottom: 5px;
      }
      a {
        color: #008489;
        text-decoration: none;
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
</style>
