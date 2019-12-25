<!--
  panel 搜索结果面板显示
  auto-viewport 地图跳转至目标区域
  scroll-wheel-zoom 允许鼠标滚动缩放
  zoom 缩放比例
-->
<template>
  <baidu-map
    @click="getPoint"
    :center="{lng, lat}"
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
      :key="'point-'+index"
      :dragging="false"
      :icon="{url: require('../../assets/loc.png'), size: {width: 30, height: 30}}"
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

<script lang='ts'>
declare function require(string): string;
import { Component, Prop, Vue, Mixins, Emit } from "vue-property-decorator";
import axios from "axios";
@Component({})
export default class BaiDuMap extends Vue {
  @Prop({ default: "" }) keyword: string;
  @Prop({ default: true }) searchStatus: string;
  @Prop({ default: false }) markerStatus: string;
  @Prop({ default: 10 }) zoom: number;
  @Prop({ default: false }) backStatus: boolean;
  @Prop({
    default: () => {
      return [];
    }
  })
  positionList: Array<object>;
  @Prop({ default: "116.404" }) lng: string;
  @Prop({ default: "39.915" }) lat: string;
  location: string = "";
  list: Array<object> = [];
  locImg: string = require("@/assets/loc.png");
  autoVisible: boolean = true;
  infoWindowOpen(index) {
    this.positionList[index]["show"] = true;
  }
  infoWindowClose(index) {
    this.positionList[index]["show"] = false;
  }
    getPoint(e) { // 点击地图获取一些信息，
      const _this = this
      this.autoVisible = true
      // if (this.backStatus) {
        let addRess = {
          location: '',
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
        })
        addRess = Object.assign(addRess, e.point)
        // &coordtype=wgs84ll&callback=renderReverse
        addRess['output'] = 'json'
        addRess['pois'] = '0'
        addRess['coordtype'] = 'wgs84ll'
        addRess['callback'] = 'renderReverse'
        addRess['ak'] = 'vCZU88Guz4BmAODWTm8k9BP0WlwId1V00'
        addRess['location'] = e.point.lat + ',' + e.point.lng
        this['$jsonp']('http://api.map.baidu.com/geocoder/v2/' , {
            ...addRess,
              ak: 'vCZU88Guz4BmAODWTm8k9BP0WlwId1V0'
        }).then((res)=>{
        　if (res.status === 0) {
          addRess['province'] = res.result.addressComponent.province
          addRess['city'] = res.result.addressComponent.city
          addRess['street'] = res.result.addressComponent.street
          addRess['streetNumber'] = res.result.addressComponent.street_number
          addRess['district'] = res.result.addressComponent.district
           this.$emit('pointClick', addRess)
        } else {
          this.$message({
            message: '没有找到对应的位置信息',
            type: 'error'
          })
        }
})
      //   axios({
      //   url: `/map-api/v2/`,
      //   params: {
      //     address: addRess['address'],
      //     ak: 'vCZU88Guz4BmAODWTm8k9BP0WlwId1V0',
      //     location: `${addRess.lat},${addRess.lng}`,
      //     output: 'json'
      //   },
      //   method: 'get'
      // }).then(res => {
      //   if (!res.data.status) {
      //     addRess['province'] = res.data.result.addressComponent.province
      //     addRess['city'] = res.data.result.addressComponent.city
      //     addRess['street'] = res.data.result.addressComponent.street
      //     addRess['streetNumber'] = res.data.result.addressComponent.street_number
      //     addRess['district'] = res.data.result.addressComponent.district
      //      this.$emit('pointClick', addRess)
      //   } else {
      //     this.$message({
      //       message: '没有找到对应的位置信息',
      //       type: 'error'
      //     })
      //   }
      // })
    }
  getPoint(e) {
    // 点击地图获取一些信息，
    const _this = this;
    this.autoVisible = true;
    // if (this.backStatus) {
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
    axios({
      url: `/map-api/v2/`,
      params: {
        address: addRess["address"],
        ak: "vCZU88Guz4BmAODWTm8k9BP0WlwId1V0",
        location: `${addRess.lat},${addRess.lng}`,
        output: "json"
      },
      method: "get"
    }).then(res => {
      if (!res.data.status) {
        addRess["province"] = res.data.result.addressComponent.province;
        addRess["city"] = res.data.result.addressComponent.city;
        addRess["street"] = res.data.result.addressComponent.street;
        addRess["streetNumber"] =
          res.data.result.addressComponent.street_number;
        addRess["district"] = res.data.result.addressComponent.district;
        this.$emit("pointClick", addRess);
      } else {
        this.$message({
          message: "没有找到对应的位置信息",
          type: "error"
        });
      }
    });
    // }
  }
}
</script>
<style lang="scss" scoped>
.map {
  width: 100%;
  height: 400px;
}
</style>
