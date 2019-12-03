<!--
  panel 搜索结果面板显示
  auto-viewport 地图跳转至目标区域
  scroll-wheel-zoom 允许鼠标滚动缩放
  zoom 缩放比例
-->
<template>
  <baidu-map
    @click="getPoint"
    :center="{lng: 116.404, lat: 39.915}"
    :zoom="zoom"
    :scroll-wheel-zoom="true"
    class="map"
  >
    <!--是否需要搜索功能-->
    <slot name="search"></slot>
    <bm-local-search
      :autoViewport="autoVisible"
      :panel="false"
      :keyword="keyword"
      :location="location"
      v-if="searchStatus"
    ></bm-local-search>
    <slot name="point"></slot>
    <bm-marker
      v-show="markerStatus"
      v-for="(item, index) in positionList"
      :position="item.position"
      :key="index"
      :dragging="false"
      @click="infoWindowOpen(index)"
    >
      <bm-info-window
        :show="item.show"
        @close="infoWindowClose(index)"
        @open="infoWindowOpen(index)"
      >
        {{`名字:${item.title}`}}
        <br />
        {{`具体地址:${item.address}`}}
      </bm-info-window>
    </bm-marker>
    <bm-marker
      v-show="backStatus"
      v-for="(item, index) in list"
      :position="item.position"
      :key="index"
      :dragging="false"
      :icon="{url: locImg, size: {width: 30, height: 30}}"
    >
      <!-- <bm-info-window
            :show="item.show"
            @close="infoWindowClose(index)"
            @open="infoWindowOpen(index)">
            {{`名字:${item.title}`}} <br>
            {{`具体地址:${item.address}`}}
      </bm-info-window>-->
    </bm-marker>
    <slot name="line"></slot>
  </baidu-map>
</template>

<script>
export default {
  props: {
    keyword: {
      // 主要用这个
      type: String,
      default: ""
    },
    searchStatus: {
      // 搜索功能状态
      type: Boolean,
      default: true
    },
    markerStatus: {
      // 需要定点状态
      type: Boolean,
      default: true
    },
    markList: {
      type: Array,
      default: () => {
        return [];
      }
    },
    zoom: {
      type: Number,
      default: 10
    },
    backStatus: {
      default: false,
      type: Boolean
    },
    positionList: {
      type: [Array, Object],
      default: function() {
        return [
          // {
          //   show: false,
          //   title: '我爱北京天安门2',
          //   position: { lng: 114.404, lat: 39.915 }
          // }
        ];
      }
    }
  },
  data() {
    return {
      location: "",
      list: [],
      locImg: require("@/assets/loc.png"),
      autoVisible: true
    };
  },
  mounted() {
    this.autoVisible = true;
  },
  methods: {
    infoWindowOpen(index) {
      this.positionList[index].show = true;
    },
    infoWindowClose(index) {
      this.positionList[index].show = false;
    },
    getPoint(e) {
      // 点击地图获取一些信息，
      this.autoVisible = false;
      if (this.backStatus) {
        let addRess = {
          lng: "",
          lat: "",
          province: "",
          city: "",
          district: "",
          street: "",
          streetNumber: ""
        };
        this.list = [];
        this.list.push({
          show: false,
          position: { lng: e.point.lng, lat: e.point.lat }
        });
        addRess = Object.assign(addRess, e.point);
        const geocoder = new BMap.Geocoder(); // 创建地址解析器的实例
        geocoder.getLocation(e.point, rs => {
          addRess = Object.assign(addRess, rs.addressComponents);
          this.$emit("pointClick", addRess);
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.map {
  width: 100%;
  height: 400px;
}
</style>
