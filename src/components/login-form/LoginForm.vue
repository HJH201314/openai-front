<script setup lang="ts">
/* Login模态框中的代码 */
import EasyTyper from 'easy-typer-js';
import { reactive, ref, watch } from "vue";
import { Right } from "@icon-park/vue-next";
import CommonModal from "@/components/modal/CommonModal.vue";
import type { CommonModalFunc } from "@/components/modal/CommonModal";
import { useMediaQuery } from "@vueuse/core";
import { useUserStore } from "@/store/useUserStore";
import api from "@/api";

const userStore = useUserStore();
const refLoginModal = ref<CommonModalFunc>();

const typerObj = reactive({
  output: '',
  isEnd: false,
  speed: 150,
  singleBack: false,
  sleep: 0,
  type: 'normal',
  backSpeed: 40,
  sentencePause: false,
})

const typer = ref<EasyTyper>();

defineExpose({
  open: () => {
    refLoginModal.value?.open();
    init();
  },
  close: () => {
    refLoginModal.value?.close();
  },
});

const isLargeScreen = useMediaQuery('(min-width: 768px)');

const loginForm = reactive({
  username: ref(''),
  password: ref(''),
  shake: ref(0),
});
const emoji = ref('🚀');
const submitDisabled = ref(false);

function init() {
  emoji.value = '🚀';
  typer.value = new EasyTyper(typerObj, `即刻出发`);
}
async function handleLoginSubmit() {
  if (!loginForm.username) {
    loginForm.shake += 1;
    return;
  } else if (!loginForm.password) {
    loginForm.shake += 1;
    return;
  } else {
    try {
      submitDisabled.value = true;
      const result = await userStore.login(loginForm.username, loginForm.password);
    }
    catch (e) {
      console.error(e);
      loginForm.shake += 1;
      return;
    }
    finally {
      submitDisabled.value = false;
    }
  }
}

watch(() => userStore.isLogin, (v) => {
  if (v) {
    emoji.value = '🎉';
    typer.value = new EasyTyper(typerObj, '欢迎回来');
    setTimeout(() => {
      refLoginModal.value?.close();
    }, 1500);
  }
});
</script>

<template>
  <CommonModal ref="refLoginModal" :show-close="false">
    <template #default>
      <div class="login">
        <div class="sidebar-logo sidebar-logo-animation" style="font-size: 32px;">
          OpenChat
        </div>
        <div class="login-top">
          <span class="login-top-emoji transition-all-circ">{{ emoji }}</span>
          <div style="height: .01rem;" v-if="!isLargeScreen" />
          <span class="login-top-text">{{ typerObj.output }}</span>
          <span class="typed-cursor login-top-text">|</span>
        </div>
        <div class="login-bottom">
          <div class="login-form">
            <input class="login-form-input" type="text" placeholder="请输入用户名" v-model="loginForm.username" />
            <input class="login-form-input" type="password" placeholder="请输入密码" v-model="loginForm.password" />
          </div>
          <div class="login-form-submit" v-shake="loginForm.shake">
            <button style="outline: none;" :disabled="submitDisabled" @click="handleLoginSubmit">
              <Right size="32" />
            </button>
          </div>
        </div>
      </div>
    </template>
  </CommonModal>
</template>

<style scoped lang="scss">
@import "@/assets/variables";
.login {
  padding: .25rem 1rem 1rem 1rem;

  &-top {
    width: 100%;
    font-size: 100px;
    line-height: 1;
    text-align: center;
    margin: 1rem 0;
    &-emoji {
      &:focus {
        transform: scale(0.9);
      }
    }
    &-text {
      font-size: 56px;
      font-weight: bold;
      color: $color-primary;
      background-image: $linear-gradient-primary;
      -webkit-text-fill-color: rgba(0,0,0,0);
      background-clip: text;
    }
  }

  &-title {
    font-size: 20px;
    font-weight: bold;
    letter-spacing: 4px;

    &:before {
      display: inline-block;
      content: '';
      height: 1rem;
      width: 4px;
      background-color: $color-primary;
    }
  }

  &-bottom {
    display: flex;
    flex-direction: row;
    gap: .5rem;
  }

  &-form {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: .5rem;
    &-input {
      width: 100%;
      font-size: large;
      border-radius: .5rem;
      padding: .25rem .5rem;
      border: 2px solid #FFFFFF00;
      background-color: $color-gray-100;
      outline: none;
      transition: all .2s $ease-out-circ;
      &:focus {
        border: 2px solid $color-primary;
      }
    }
    &-submit {
      position: relative;
      font-size: 20px;
      background-image: $linear-gradient-primary-2;
      color: white;
      text-align: center;
      border-radius: .5rem;
      display: flex;
      padding: .75rem;
      box-sizing: border-box;
      cursor: pointer;
      transition: all .2s $ease-out-circ;
      &:hover {
        opacity: 0.85;
      }
      &:active {
        background-image: $linear-gradient-primary-3;
      }
    }
  }
}
.sidebar-logo {
  flex: 1;
  font-size: 24px;
  &-animation {
    // background-image: linear-gradient(-135deg, #41e0a3, #56d8c0, #dc8bc3, #56d8c0, #41e0a3, #56d8c0, #dc8bc3, #56d8c0, #41e0a3);
    background-image: linear-gradient(-135deg, #418ae0, #56a0d8, #dc8bc3, #56a0d8, #418ae0, #56a0d8, #dc8bc3, #56a0d8, #418ae0);
    -webkit-text-fill-color: rgba(0,0,0,0);
    background-clip: text;
    background-size: 200% 200%;
    animation: text-masked-animation 3s infinite linear;
  }
  @keyframes text-masked-animation {
    0% {
      background-position: 0 -100%;
    }
    100% {
      background-position: -100% 0;
    }
  }
}
.typed-cursor {
  margin-left: 10px;
  opacity: 1;
  animation: blink 0.9s infinite;
  @keyframes blink {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0;
    }
    100% {

      opacity: 1;
    }
  }
}
</style>