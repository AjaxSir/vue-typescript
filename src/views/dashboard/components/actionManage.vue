<template>
  <div class="pass">
    <div class="fun-data">
      <div class="data-statistics" v-for="(item, index) in routes" :key="index">
        <div class="fun-title" v-if="!item.hidden && item.children">
          <router-link v-if="item.meta && item.meta.title" :to="item.redirect">
            <div class="item">
              <div class="sing-svg" :style="{backgroundColor: item.meta.bg_color}">
                <i v-if="item.meta && item.meta.icon" :class="['iconfont', item.meta.icon]"></i>
              </div>
              <p class="item-text" v-if="item.meta && item.meta.title">{{ item.meta.title }}</p>
            </div>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    routes() {
      return this.$router.options.routes;
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
$size: 48px;
$color: #ffffff;

p {
  margin: 5px;
}

.scene-house {
  font-size: 26px;
  margin-right: 4px;
}

.scene-titile {
  color: #5c5f63;
  font-size: 15px;
}

.fun-data {
  display: flex;
  flex-wrap: wrap;
  padding: 46px 10px 5px 10px;
}

.data-statistics {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.fun-title {
  font-size: 14px;
  white-space: nowrap;
}

.item-text {
  font-size: 17px;
  line-height: 68px;
  margin-left: 20px;
}

.item {
  font-size: 14px;
  display: flex;
  border: 1px solid #e6e6e6;
  padding: 0 15px 0 0;
  background: #f9f9f9;
  margin: 5px 21px;
  border-radius: 6px;
  background: #fff;
}

.iconfont {
  font-size: $size;
  color: $color;
}

.sing-svg {
  width: 80px;
  text-align: center;
  line-height: 80px;
  height: 80px;
  box-shadow: 0 12px 20px -10px rgba(244, 67, 54, 0.28),
    0 4px 20px 0 rgba(0, 0, 0, 0.12), 0 7px 8px -5px rgba(244, 67, 54, 0.2);
  border-radius: 5px;
}
</style>
